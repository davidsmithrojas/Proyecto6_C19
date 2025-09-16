const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/environment');
const logger = require('../utils/logger');

// Importar modelos después de la conexión
let User, Product;

// Datos de usuarios predeterminados
const defaultUsers = [
  {
    username: 'admin',
    email: 'admin@proyecto6.com',
    password: 'Admin123!',
    role: 'admin',
    firstName: 'Administrador',
    lastName: 'Sistema'
  },
  {
    username: 'usertest',
    email: 'usertest@proyecto6.com',
    password: 'User123!',
    role: 'user',
    firstName: 'Usuario',
    lastName: 'Prueba'
  }
];

// Datos de productos de ropa predeterminados
const defaultProducts = [
  // Camisas
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

  // Pantalones
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

  // Zapatos
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

// Función para crear usuarios predeterminados
async function seedUsers() {
  try {
    logger.info('Iniciando creación de usuarios predeterminados...');
    
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (!existingUser) {
        // Hashear la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        const user = new User({
          ...userData,
          password: hashedPassword
        });

        await user.save();
        logger.info(`Usuario creado: ${userData.username} (${userData.email})`);
      } else {
        logger.info(`Usuario ya existe: ${userData.username} (${userData.email})`);
      }
    }
    
    logger.info('Proceso de usuarios completado');
  } catch (error) {
    logger.error('Error creando usuarios predeterminados:', error);
    throw error;
  }
}

// Función para crear productos predeterminados
async function seedProducts() {
  try {
    logger.info('Iniciando creación de productos predeterminados...');
    
    // Obtener el ID del usuario admin para usar como createdBy
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('No se encontró usuario admin para asignar como creador de productos');
    }
    
    for (const productData of defaultProducts) {
      const existingProduct = await Product.findOne({ 
        $or: [
          { code: productData.code },
          { name: productData.name }
        ]
      });

      if (!existingProduct) {
        const product = new Product({
          ...productData,
          createdBy: adminUser._id,
          updatedBy: adminUser._id
        });
        await product.save();
        logger.info(`Producto creado: ${productData.name} (${productData.code})`);
      } else {
        logger.info(`Producto ya existe: ${productData.name} (${productData.code})`);
      }
    }
    
    logger.info('Proceso de productos completado');
  } catch (error) {
    logger.error('Error creando productos predeterminados:', error);
    throw error;
  }
}

// Función principal de inicialización
async function seedDatabase() {
  try {
    logger.info('🌱 Iniciando proceso de inicialización de la base de datos...');
    
    // Conectar a la base de datos si no está conectada
    if (mongoose.connection.readyState !== 1) {
      logger.info('Conectando a la base de datos...');
      await mongoose.connect(config.database.uri, config.database.options);
    }

    // Importar modelos después de la conexión
    User = require('../models/userModel');
    Product = require('../models/productModel');

    // Crear usuarios predeterminados
    await seedUsers();
    
    // Crear productos predeterminados
    await seedProducts();
    
    logger.info('✅ Inicialización de la base de datos completada exitosamente');
    
    // Mostrar resumen
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    logger.info(`📊 Resumen de la base de datos:`);
    logger.info(`   - Usuarios: ${userCount}`);
    logger.info(`   - Productos: ${productCount}`);
    
  } catch (error) {
    logger.error('❌ Error durante la inicialización de la base de datos:', error);
    throw error;
  }
}

// Función para verificar si la base de datos necesita inicialización
async function needsSeeding() {
  try {
    // Conectar a la base de datos si no está conectada
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.database.uri, config.database.options);
    }

    // Importar modelos después de la conexión
    User = require('../models/userModel');
    Product = require('../models/productModel');

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    // Si no hay usuarios o productos, necesita inicialización
    return userCount === 0 || productCount === 0;
  } catch (error) {
    logger.error('Error verificando si necesita inicialización:', error);
    return true; // En caso de error, asumir que necesita inicialización
  }
}

module.exports = {
  seedDatabase,
  needsSeeding,
  defaultUsers,
  defaultProducts
};
