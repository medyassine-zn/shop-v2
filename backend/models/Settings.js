const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'MyShop' },
  storeDescription: { type: String, default: 'Your one-stop shop for everything' },
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  address: { type: String, default: '' },
  whatsappNumber: { type: String, default: '' },
  notificationEmail: { type: String, default: '' },
  logo: { type: String, default: '' },
  currency: { type: String, default: 'EUR' },
  currencySymbol: { type: String, default: '€' },
  freeShippingThreshold: { type: Number, default: 0 },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
