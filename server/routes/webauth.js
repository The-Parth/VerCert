import express from "express";
import cors from "cors";
import crypto from "crypto";
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

const webauthRouter = express.Router();
const users = new Map(); // In-memory store for demo

webauthRouter.post("/register", async (req, res) => {
    const { username } = req.body;

    if (users.has(username)) {
        console.log("User already registered");
        return res.status(400).json({ error: "User already registered" });
    }

    // Generate a unique userID as a uint8 array
    const userID = new Uint8Array(32);
    crypto.randomFillSync(userID);

    const options = await generateRegistrationOptions({
        rpName: "Demo App",
        rpID: "localhost",
        userID: userID,
        userName: username,
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
        },
    });

    users.set(username, { userID, challenge: options.challenge });
    // wait for promose to resolve
    // console.log("Registration options", options);
    res.json(options);
});
// ...existing code...
webauthRouter.post("/verify-registration", async (req, res) => {
    const { username, credential } = req.body;
    const user = users.get(username);
    if (!user) return res.status(400).json({ error: "User not found" });

    try {
        const verification = await verifyRegistrationResponse({
            response: credential,
            expectedChallenge: user.challenge,
            expectedOrigin: "http://localhost:5000",
            expectedRPID: "localhost",
        });

        if (verification.verified) {
            console.log(verification);
            // Store the credential along with its counter from registrationInfo
            users.set(username, {
                ...user,
                credential: verification.registrationInfo.credential,
                challenge: null,
            });
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
// ...existing code...

webauthRouter.post("/login", async (req, res) => {
    const { username } = req.body;
    const user = users.get(username);
    if (!user || !user.credential) {
        return res.status(400).json({ error: "User not registered" });
    }

    const options = await generateAuthenticationOptions({
        rpID: "localhost",
        userVerification: "preferred",
        allowCredentials: [
            {
                id: user.credential.id,
                type: "public-key",
            },
        ],
    });

    users.get(username).challenge = options.challenge;
    res.json(options);
});


webauthRouter.post("/verify-login", async (req, res) => {
    const { username, assertion } = req.body;
    const user = users.get(username);
    if (!user) return res.status(400).json({ error: "User not found" });

    try {
        const verification = await verifyAuthenticationResponse({
            response: assertion,
            expectedChallenge: user.challenge,
            expectedOrigin: "http://localhost:5000",
            expectedRPID: "localhost",
            credential: user.credential,
            requireUserVerification: false,
        });

        if (verification.verified) {
            console.log(verification);
            const authInfo = verification.authenticationInfo;
            // Update the stored counter with the new value from authenticationInfo
            users.set(username, {
                ...user,
                credential : {
                    ...user.credential,
                    counter: authInfo.newCounter,
                },
            });
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
