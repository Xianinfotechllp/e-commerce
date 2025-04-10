import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: Number, default: 0 },       // 0 = user, 1=vendor,2 = admin, etc.
  address:  { type: String },
  suspended:{ type: Boolean, default: false }
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
