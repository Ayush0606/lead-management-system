import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

export async function createUser({ email, password }) {
  const user = new User({ email, password });
  await user.save();
  return { id: user._id, email: user.email };
}

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function findUserById(id) {
  return User.findById(id).select('id email');
}
