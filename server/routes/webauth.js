import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import dotenv from 'dotenv';
dotenv.config();

// Schemas
import { Passkey, InProcessItem } from '../models/PasskeyAuth.js';
import User from '../models/User.js';

const webauthRouter = express.Router();
const HOST = process.env.HOST || null;
const HOST_URL = process.env.HOST_URL || null;

const currentChallenges = new Map(); // Currently in-process challenges for login

if (!HOST || !HOST_URL) {
  console.error('Please set the HOST and HOST_URL environment variables');
  process.exit(1);
}

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  message: {
    error:
      "You went too fast my friend, but don't worry… I won't remember this anyway. ~ 💚",
  },
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000 * 5, // 2 minutes
  max: 15,
  standardHeaders: true,
  message: {
    error:
      "You're trying a bit too hard to be noticed… but I'm not even supposed to be here. 💚",
  },
});

webauthRouter.use(generalLimiter);

webauthRouter.get("/", (req, res) => {
  res.json({"message":"Working"});
});

webauthRouter.post('/register', loginLimiter, async (req, res) => {
  const { username } = req.body; // same as email
  console.log('Username', username);
  console.log("MONGO", process.env.MONGO_URI);
  // check if user exists

  // Disabled temporarily
  /*
  const user = await User.findOne({
    email: username});
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }
    */

  // They are registered now, so find if they are in the passkey database

  var passkeyUser = await Passkey.findOne({
    username: username,
  });

    console.log('Username', passkeyUser);

  var userID = new Uint8Array(32);

  if (!passkeyUser) {
    // Create the user in the passkey database
    crypto.randomFillSync(userID);

    const newPasskeyUser = new Passkey({
      username: username,
      userID: userID,
      passkeys: [],
      inProcess: [],
    });
    await newPasskeyUser.save();

    passkeyUser = newPasskeyUser;
  } else {
    userID = passkeyUser.userID;
  }

  const options = await generateRegistrationOptions({
    rpName: 'VerCert',
    rpID: HOST,
    userID: userID,
    userName: username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  const newInProcessItem = new InProcessItem({
    challenge: options.challenge,
  });

  await newInProcessItem.save();

  passkeyUser.inProcess.push(newInProcessItem);
  await passkeyUser.save();
  // console.log('Passkey User', passkeyUser);
  res.json(options);
});

webauthRouter.post('/verify-registration', async (req, res) => {
  const { username, credential } = req.body;
  const user = await Passkey.findOne({
    username: username,
  });

  if (!user) return res.status(400).json({ error: 'User not found' });

  // console.log('User', user);
  // console.log('Credential', credential);

  var expectedChallenge = null;
  try {
    const inProcessRegistrations = user.inProcess;
    const validChallenges = [];

    // Parse the clientDataJSON from base64
    const clientDataJSON = JSON.parse(
      Buffer.from(credential.response.clientDataJSON, 'base64').toString()
    );
    const receivedChallenge = clientDataJSON.challenge;

    for (const inProcessRegistration of inProcessRegistrations) {
      const inProcessChallenge = await InProcessItem.findOne({
        _id: inProcessRegistration,
      });
      // console.log('In Process Challenge', inProcessChallenge);
      if (inProcessChallenge) {
        // Compare the stored challenge with the decoded challenge
        if (inProcessChallenge.challenge === receivedChallenge) {
          expectedChallenge = inProcessChallenge.challenge;
          // console.log('Expected Challenge', expectedChallenge);
        } else {
          validChallenges.push(inProcessRegistration);
        }
      }
    }

    // Clean up used challenges
    user.inProcess = validChallenges;
    await user.save();

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: expectedChallenge,
      expectedOrigin: HOST_URL,
      expectedRPID: HOST,
    });

    if (verification.verified) {
      // console.log(verification);
      // Store the credential along with its counter from registrationInfo
      const verifiedCredential = verification.registrationInfo.credential;
      user.passkeys.push(verifiedCredential);
      await user.save();
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

webauthRouter.post('/login', loginLimiter, async (req, res) => {
  const { username } = req.body;
  const user = await Passkey.findOne({
    username: username,
  });

  if (!user) return res.status(400).json({ error: 'User not found' });
  if (user.passkeys.length === 0) {
    return res.status(400).json({ error: 'No passkeys registered' });
  }

  const allowedCreds = [];
  for (const cred of user.passkeys) {
    allowedCreds.push({
      id: cred.id,
      type: 'public-key',
    });
  }
  const options = await generateAuthenticationOptions({
    rpID: HOST,
    userVerification: 'preferred',
    allowCredentials: allowedCreds,
  });

  currentChallenges.set(username, {
    challenge: options.challenge,
    credentials: allowedCreds,
    expires: Date.now() + 240000, // 4 minutes
  });
  res.json(options);
  // console.log(currentChallenges);

  // Cleanup expired challenges
  setTimeout(() => {
    // console.log('Cleaning up expired challenges for', username);
    if (
      currentChallenges.has(username) &&
      currentChallenges.get(username).expires < Date.now()
    ) {
      currentChallenges.delete(username);
    }
  }, 300000);
});
webauthRouter.post('/verify-login', async (req, res) => {
  const { username, assertion } = req.body;
  const user = await Passkey.findOne({ username: username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  // Retrieve stored challenge info from our in-memory map
  const challengeData = currentChallenges.get(username);
  if (!challengeData) {
    return res.status(400).json({ error: 'No challenge found for user' });
  }

  // Find the credential object from the user's stored passkeys that matches the assertion
  const credentialRecord = user.passkeys.find(
    (cred) => cred.id === assertion.id
  );
  if (!credentialRecord) {
    return res.status(400).json({ error: 'Credential not found' });
  }

  // console.log('Credential Record', credentialRecord);
  // console.log('Challenge Data', challengeData);

  // Create a proper credential object with the publicKey converted to a Buffer
  const processedCredential = {
    ...credentialRecord,
    // Convert the MongoDB Binary format to a standard Buffer
    publicKey:
      credentialRecord.publicKey instanceof Buffer
        ? credentialRecord.publicKey
        : Buffer.from(
            credentialRecord.publicKey.$binary?.base64 ||
              credentialRecord.publicKey.toString('base64'),
            'base64'
          ),
  };

  // console.log(
  //   'Processed publicKey type:',
  //   typeof processedCredential.publicKey
  // );
  // console.log('Is Buffer?', Buffer.isBuffer(processedCredential.publicKey));

  try {
    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: HOST_URL,
      expectedRPID: HOST,
      credential: processedCredential, // Use the processed credential
      requireUserVerification: false,
    });

    if (verification.verified) {
      // console.log(verification);
      const authInfo = verification.authenticationInfo;

      // Update the stored counter in the matching passkey credential
      credentialRecord.counter = authInfo.newCounter;
      await user.save();

      // Remove the challenge from the in-memory map after successful verification
      currentChallenges.delete(username);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
});

export default webauthRouter;
