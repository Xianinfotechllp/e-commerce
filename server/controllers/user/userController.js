import userModel from '../../model/userModel.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      address
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.suspended) return res.status(403).json({ message: 'Account suspended' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    
   

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Get Single User
export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { name, email, address },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Suspend / Unsuspend User
export const toggleSuspendUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.suspended = !user.suspended;
    await user.save();

    res.status(200).json({ message: `User ${user.suspended ? 'suspended' : 'unsuspended'} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status', error: err.message });
  }
};
