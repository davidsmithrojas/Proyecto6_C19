const UserService = require('../services/userService');
const ResponseFactory = require('../utils/response');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * Crear un nuevo usuario
 */
exports.createUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await UserService.createUser(userData);
  ResponseFactory.created(res, user, 'Usuario creado exitosamente');
});

/**
 * Autenticar usuario
 */
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await UserService.loginUser(email, password);
  ResponseFactory.success(res, result, 'Login exitoso');
});

/**
 * Verificar usuario autenticado
 */
exports.verifyUser = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user.id);
  ResponseFactory.success(res, { user }, 'Usuario verificado');
});

/**
 * Actualizar usuario
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;
  const user = await UserService.updateUser(userId, updateData);
  ResponseFactory.updated(res, user, 'Usuario actualizado exitosamente');
});

/**
 * Solicitar cambio de rol
 */
exports.requestRole = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { motivation } = req.body;
  const request = await UserService.requestRoleChange(userId, motivation);
  ResponseFactory.created(res, request, 'Solicitud de cambio de rol enviada');
});

/**
 * Obtener solicitudes de rol pendientes (solo admin)
 */
exports.getRoleRequests = asyncHandler(async (req, res) => {
  const requests = await UserService.getPendingRoleRequests();
  ResponseFactory.success(res, requests, 'Solicitudes obtenidas');
});

/**
 * Procesar solicitud de rol (aprobar/rechazar)
 */
exports.handleRoleRequest = asyncHandler(async (req, res) => {
  const { id: requestId } = req.params;
  const { decision } = req.body;
  const adminId = req.user.id;
  const request = await UserService.handleRoleRequest(requestId, decision, adminId);
  
  const message = decision === 'approved' 
    ? 'Solicitud aprobada exitosamente' 
    : 'Solicitud rechazada exitosamente';
    
  ResponseFactory.success(res, request, message);
});

/**
 * Obtener estadísticas de usuarios (solo admin)
 */
exports.getUserStats = asyncHandler(async (req, res) => {
  const stats = await UserService.getUserStats();
  ResponseFactory.success(res, stats, 'Estadísticas obtenidas');
});
