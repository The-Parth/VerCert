import mongoose from "mongoose";

// TODO: Build the user schema @KaushalBhadra15

const userSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin', 'superadmin']
    }
}); // sample

const User = mongoose.model('User', userSchema);

export default User;