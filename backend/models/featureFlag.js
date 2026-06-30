const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.models.Flag || mongoose.model('Flag', flagSchema);