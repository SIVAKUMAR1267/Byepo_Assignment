const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Flag = require('../models/featureFlag');
const generateToken = require('../utils/generateToken');

const signup = async (req, res, next) => {
  try {
    const { email, password, organizationId } = req.body;

    if (!email || !password || !organizationId) {
      return res.status(400).json({ message: 'Email, password, and organizationId are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      organizational_id: organizationId,
      role: 'ORG_ADMIN'
    });

    const token = generateToken({ id: user._id, role: user.role, orgId: user.organizational_id });

    res.status(201).json({ token, role: user.role });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: user.role, orgId: user.organizational_id });

    res.json({ token, role: user.role });
  } catch (error) {
    next(error);
  }
};

const getFlags = async (req, res, next) => {
  try {
    const flags = await Flag.find({ organizationId: req.user.organizational_id }).lean();
    res.json(flags);
  } catch (error) {
    next(error);
  }
};

const createFlag = async (req, res, next) => {
  try {
    const { key, isEnabled } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: 'Flag key is required' });
    }

    const flagExists = await Flag.findOne({ key, organizationId: req.user.organizational_id });
    if (flagExists) {
      return res.status(400).json({ message: 'Flag with this key already exists' });
    }
    
    const newFlag = await Flag.create({
      key,
      isEnabled: isEnabled || false,
      organizationId: req.user.organizational_id 
    });
    
    res.status(201).json(newFlag);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateFlag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;

    const updatedFlag = await Flag.findOneAndUpdate(
      { _id: id, organizationId: req.user.organizational_id },
      { isEnabled },
      { new: true, runValidators: true }
    );

    if (!updatedFlag) {
      return res.status(404).json({ message: 'Flag not found or unauthorized' });
    }

    res.json(updatedFlag);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const deleteFlag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFlag = await Flag.findOneAndDelete({
      _id: id,
      organizationId: req.user.organizational_id
    });

    if (!deletedFlag) {
      return res.status(404).json({ message: 'Flag not found or unauthorized' });
    }

    res.json({ message: 'Flag deleted successfully' });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = { signup, login, createFlag, updateFlag, getFlags, deleteFlag };