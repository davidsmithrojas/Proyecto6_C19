// Script para crear los productos faltantes
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuración de la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proyecto_6_db';

// Esquemas simples
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  firstName: String,
  lastName: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  sizes: [String],
  colors: [String],
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Productos de ropa
const products = [
  {
    name: 'Camisa Formal Blanca',
    description: 'Camisa de algodón 100% para ocasiones formales, corte clásico y cómodo',
    price: 45000,
    category: 'Camisas',
    stock: 50,
    code: 'CAM-001',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Azul', 'Negro'],
    images: [{
      url: '/images/camisa-formal-blanca.jpg',
      alt: 'Camisa Formal Blanca',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Camisa Casual Rayas',
    description: 'Camisa casual con rayas verticales, perfecta para el día a día',
    price: 35000,
    category: 'Camisas',
    stock: 50,
    code: 'CAM-002',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Azul y Blanco', 'Rojo y Blanco'],
    images: [{
      url: '/images/camisa-casual-rayas.jpg',
      alt: 'Camisa Casual Rayas',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Camisa Polo Deportiva',
    description: 'Camisa polo de algodón piqué, ideal para actividades deportivas',
    price: 28000,
    category: 'Camisas',
    stock: 50,
    code: 'CAM-003',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro', 'Azul', 'Verde'],
    images: [{
      url: '/images/camisa-polo-deportiva.jpg',
      alt: 'Camisa Polo Deportiva',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Camisa Lino Verano',
    description: 'Camisa de lino 100% para el verano, fresca y transpirable',
    price: 55000,
    category: 'Camisas',
    stock: 50,
    code: 'CAM-004',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Blanco', 'Azul Claro'],
    images: [{
      url: '/images/camisa-lino-verano.jpg',
      alt: 'Camisa Lino Verano',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Pantalón Jeans Clásico',
    description: 'Jeans de mezclilla clásico, corte recto y cómodo para cualquier ocasión',
    price: 65000,
    category: 'Pantalones',
    stock: 50,
    code: 'PAN-001',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Azul Clásico', 'Azul Oscuro', 'Negro'],
    images: [{
      url: '/images/pantalon-jeans-clasico.jpg',
      alt: 'Pantalón Jeans Clásico',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Pantalón Chino Elegante',
    description: 'Pantalón chino de algodón, perfecto para oficina o eventos casuales',
    price: 48000,
    category: 'Pantalones',
    stock: 50,
    code: 'PAN-002',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Beige', 'Azul Marino', 'Gris', 'Negro'],
    images: [{
      url: '/images/pantalon-chino-elegante.jpg',
      alt: 'Pantalón Chino Elegante',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Pantalón Deportivo',
    description: 'Pantalón deportivo con tecnología de secado rápido',
    price: 32000,
    category: 'Pantalones',
    stock: 50,
    code: 'PAN-003',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Azul', 'Verde'],
    images: [{
      url: '/images/pantalon-deportivo.jpg',
      alt: 'Pantalón Deportivo',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Pantalón Cargo Aventura',
    description: 'Pantalón cargo con múltiples bolsillos, ideal para aventuras',
    price: 42000,
    category: 'Pantalones',
    stock: 50,
    code: 'PAN-004',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Verde Militar', 'Negro', 'Gris', 'Beige'],
    images: [{
      url: '/images/pantalon-cargo-aventura.jpg',
      alt: 'Pantalón Cargo Aventura',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Zapatos Oxford Negros',
    description: 'Zapatos Oxford de cuero genuino, elegantes y cómodos para ocasiones formales',
    price: 85000,
    category: 'Zapatos',
    stock: 50,
    code: 'ZAP-001',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Negro', 'Marrón'],
    images: [{
      url: '/images/zapatos-oxford-negros.jpg',
      alt: 'Zapatos Oxford Negros',
      isPrimary: true
    }],
    isActive: true
  },
  {
    name: 'Zapatillas Deportivas',
    description: 'Zapatillas deportivas con tecnología de amortiguación, perfectas para correr',
    price: 75000,
    category: 'Zapatos',
    stock: 50,
    code: 'ZAP-002',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Blanco', 'Negro', 'Azul', 'Rojo'],
    images: [{
      url: '/images/zapatillas-deportivas.jpg',
      alt: 'Zapatillas Deportivas',
      isPrimary: true
    }],
    isActive: true
  }
];

async function fixProducts() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const User = mongoose.model('User', userSchema);
    const Product = mongoose.model('Product', productSchema);

    // Obtener el usuario admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No se encontró usuario admin');
      return;
    }

    console.log('👤 Usuario admin encontrado:', adminUser.email);

    // Crear productos
    for (const productData of products) {
      const existingProduct = await Product.findOne({ code: productData.code });
      
      if (!existingProduct) {
        const product = new Product({
          ...productData,
          createdBy: adminUser._id,
          updatedBy: adminUser._id
        });
        await product.save();
        console.log('✅ Producto creado:', productData.name);
      } else {
        console.log('ℹ️ Producto ya existe:', productData.name);
      }
    }

    // Mostrar resumen
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log('\n📊 Resumen:');
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Productos: ${productCount}`);

    console.log('\n🎉 Proceso completado exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

fixProducts();
