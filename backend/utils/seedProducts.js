/**
 * Demo product seeder
 * Run: node utils/seedProducts.js
 */
require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const Product = require('../models/Product')

const DEMO_PRODUCTS = [
  {
    name: 'Sneakers Urban Pro',
    description: 'Des sneakers modernes et confortables pour un style urbain au quotidien. Semelle amortissante et tige respirante.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Chaussures',
    stock: 45,
    isPopular: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 128,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    tags: ['sneakers', 'urban', 'sport'],
  },
  {
    name: 'Sac à Dos Nomade',
    description: 'Le compagnon parfait pour vos aventures. Imperméable, 30L, compartiment laptop 15".',
    price: 65.00,
    category: 'Sacs',
    stock: 30,
    isPopular: true,
    rating: 4.7,
    reviewCount: 89,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    tags: ['sac', 'voyage', 'laptop'],
  },
  {
    name: 'Montre Classic Steel',
    description: 'Élégance intemporelle avec bracelet en acier inoxydable. Étanche 50m, mouvement automatique.',
    price: 149.00,
    originalPrice: 199.00,
    category: 'Accessoires',
    stock: 20,
    isPopular: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 56,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    tags: ['montre', 'acier', 'élégant'],
  },
  {
    name: 'T-Shirt Premium Coton',
    description: 'T-shirt 100% coton bio, coupe moderne. Doux, respirant, résiste au lavage.',
    price: 29.99,
    category: 'Vêtements',
    stock: 100,
    rating: 4.3,
    reviewCount: 204,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
    tags: ['tshirt', 'coton', 'basique'],
  },
  {
    name: 'Casque Audio Sans Fil',
    description: 'Son cristallin avec réduction de bruit active. Autonomie 30h, connexion multipoint.',
    price: 179.00,
    originalPrice: 229.00,
    category: 'Électronique',
    stock: 15,
    isPopular: true,
    rating: 4.6,
    reviewCount: 312,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    tags: ['casque', 'audio', 'bluetooth'],
  },
  {
    name: 'Veste Softshell Outdoor',
    description: 'Protection optimale contre le vent et la pluie légère. Idéale pour la randonnée et le quotidien.',
    price: 119.00,
    category: 'Vêtements',
    stock: 25,
    isFeatured: true,
    rating: 4.4,
    reviewCount: 67,
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600'],
    tags: ['veste', 'outdoor', 'imperméable'],
  },
  {
    name: 'Portefeuille Cuir Italien',
    description: 'Cuir pleine fleur tanné végétal, 8 emplacements cartes, compartiment billets.',
    price: 45.00,
    category: 'Accessoires',
    stock: 50,
    rating: 4.9,
    reviewCount: 143,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
    tags: ['portefeuille', 'cuir', 'luxe'],
  },
  {
    name: 'Bouteille Isotherme 500ml',
    description: 'Maintient vos boissons chaudes 12h et froides 24h. Acier inox, sans BPA.',
    price: 34.99,
    category: 'Sport',
    stock: 75,
    isPopular: true,
    rating: 4.5,
    reviewCount: 189,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
    tags: ['bouteille', 'isotherme', 'sport'],
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    const existing = await Product.countDocuments()
    if (existing > 0) {
      console.log(`ℹ️  ${existing} products already exist. Skipping seed.`)
      console.log('   To reseed: delete all products from admin panel first.')
    } else {
      await Product.insertMany(DEMO_PRODUCTS)
      console.log(`✅ ${DEMO_PRODUCTS.length} demo products created!`)
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected.')
    process.exit(0)
  }
}

seed()
