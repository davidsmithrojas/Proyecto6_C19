const express = require("express");
const { auth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/authRol');
const { generalLimiter, writeLimiter } = require('../middlewares/rateLimiter');
const validation = require('../middlewares/validation');
const productRouter = express.Router();

// Importar controladores
const {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  searchProducts,
  getProductsByCategory,
  getLowStockProducts,
  getProductStats
} = require('../controllers/product.Controller');

// Rutas públicas
productRouter.get('/', 
  generalLimiter,
  getProducts
);

productRouter.get('/search',
  generalLimiter,
  searchProducts
);

productRouter.get('/category/:category',
  generalLimiter,
  getProductsByCategory
);

productRouter.get('/low-stock',
  generalLimiter,
  getLowStockProducts
);

productRouter.get('/:id',
  generalLimiter,
  getProductById
);

// Rutas protegidas (solo admin)
productRouter.post('/',
  auth,
  requireAdmin,
  writeLimiter,
  validation.product.create,
  createProduct
);

productRouter.put('/:id',
  auth,
  requireAdmin,
  writeLimiter,
  validation.product.update,
  updateProductById
);

productRouter.delete('/:id',
  auth,
  requireAdmin,
  writeLimiter,
  deleteProductById
);

productRouter.get('/admin/stats',
  auth,
  requireAdmin,
  getProductStats
);

module.exports = productRouter;