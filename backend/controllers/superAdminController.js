const Organization = require('../models/Organization');
const generateToken = require('../utils/generateToken');

const loginSuperAdmin = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
    res.json({
      role: 'SUPER_ADMIN',
      token: generateToken({ role: 'SUPER_ADMIN' })
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const createOrganization = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const organization = await Organization.create({ name });
    res.status(201).json(organization);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find({}).lean();
    res.json(organizations);
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrganizations, createOrganization, loginSuperAdmin };