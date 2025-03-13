import mongoose from 'mongoose';

// A separate schema and model for expiring subdocuments
const inProcessSchema = new mongoose.Schema({
  challenge: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});
const InProcessItem = mongoose.model('InProcessItem', inProcessSchema);

// The main schema and model for storing passkeys
const PasskeySchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    userID: [],
    passkeys: [{ type: mongoose.Schema.Types.Mixed }], // Verified stored passkeys
    inProcess: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InProcessItem' }],
    /**
        In-process passkeys
        The inProcess array will contain references to InProcessItem documents. 
        These documents will be automatically deleted after 10 minutes
        as specified by the expires option in the inProcessSchema definition.
     */
  },
  { strict: false }
);

const Passkey = mongoose.model('Passkey', PasskeySchema);

export { Passkey, InProcessItem };
