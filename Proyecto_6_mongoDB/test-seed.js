// Script de prueba para el seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuración de la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proyecto_6_db';

// Datos de prueba
const testUser = {
  username: 'testadmin',
  email: 'testadmin@proyecto6.com',
  password: 'Test123!',
  role: 'admin',
  firstName: 'Test',
  lastName: 'Admin'
};

const testProduct = {
  name: 'Producto de Prueba',
  description: 'Un producto para probar el sistema',
  price: 25000,
  category: 'Camisas',
  stock: 10,
  code: 'TEST-001',
  sizes: ['S', 'M', 'L'],
  colors: ['Blanco', 'Negro'],
  images: [{
    url: '/images/test-product.jpg',
    alt: 'Producto de Prueba',
    isPrimary: true
  }],
  isActive: true
};

async function testSeed() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Definir esquemas simples
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
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema);
    const Product = mongoose.model('Product', productSchema);

    // Verificar si ya existen
    const existingUser = await User.findOne({ email: testUser.email });
    const existingProduct = await Product.findOne({ code: testProduct.code });

    if (!existingUser) {
      console.log('👤 Creando usuario de prueba...');
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      const user = new User({ ...testUser, password: hashedPassword });
      await user.save();
      console.log('✅ Usuario creado:', user.email);
    } else {
      console.log('ℹ️ Usuario ya existe:', existingUser.email);
    }

    if (!existingProduct) {
      console.log('🛍️ Creando producto de prueba...');
      const product = new Product(testProduct);
      await product.save();
      console.log('✅ Producto creado:', product.name);
    } else {
      console.log('ℹ️ Producto ya existe:', existingProduct.name);
    }

    // Mostrar resumen
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log('\n📊 Resumen:');
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Productos: ${productCount}`);

    console.log('\n🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

testSeed();
