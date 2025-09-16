
const express = require('express');
const { auth } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/authRol');
const { authLimiter, generalLimiter } = require('../middlewares/rateLimiter');
const validation = require('../middlewares/validation');
const userRouter = express.Router();

// Importar controladores
const {
  createUser,
  loginUser,
  verifyUser,
  updateUser,
  getUserStats
} = require('../controllers/user.Controller');

const {
  requestRole,
  getRoleRequests,
  handleRoleRequest
} = require('../controllers/role.controller');

// Rutas públicas
userRouter.post('/register', 
  generalLimiter,
  validation.user.register,
  createUser
);

userRouter.post('/login',
  authLimiter,
  validation.user.login,
  loginUser
);

// Rutas protegidas
userRouter.get('/verify-user',
  auth,
  verifyUser
);

userRouter.put('/update',
  auth,
  generalLimiter,
  validation.user.update,
  updateUser
);

userRouter.post('/request-role',
  auth,
  generalLimiter,
  validation.roleRequest.create,
  requestRole
);

// Rutas de administración
userRouter.get('/role-requests',
  auth,
  requireAdmin,
  getRoleRequests
);

userRouter.put('/role-requests/:id',
  auth,
  requireAdmin,
  generalLimiter,
  validation.roleRequest.handle,
  handleRoleRequest
);

userRouter.get('/stats',
  auth,
  requireAdmin,
  getUserStats
);

module.exports = userRouter;