const FeatureFlag = require('../models/featureFlag');

const evaluateFlag = async (req, res, next) => {
  try {
    const { organizationId, featureKey } = req.body;

    if (!organizationId || !featureKey) {
      return res.status(400).json({ message: 'organizationId and featureKey are required' });
    }

    const flag = await FeatureFlag.findOne({ organizationId, key: featureKey });

    if (!flag) {
      return res.json({ 
        featureKey, 
        isEnabled: false, 
        message: 'Flag not found for this organization. Defaulting to disabled.' 
      });
    }

    res.json({
      featureKey: flag.key,
      isEnabled: flag.isEnabled
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { evaluateFlag };