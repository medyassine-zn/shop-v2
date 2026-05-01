const Admin = require('../models/Admin');
const Settings = require('../models/Settings');

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        password: 'admin123',
      });
      console.log('✅ Default admin created: username=admin, password=admin123');
    }

    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        storeName: 'MyShop',
        storeDescription: 'Your one-stop shop for quality products',
        contactPhone: '+33 1 23 45 67 89',
        contactEmail: 'contact@myshop.com',
        address: '123 Rue du Commerce, Paris, France',
        whatsappNumber: '+33612345678',
        notificationEmail: '',
        currency: 'EUR',
        currencySymbol: '€',
      });
      console.log('✅ Default settings created');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedAdmin;
