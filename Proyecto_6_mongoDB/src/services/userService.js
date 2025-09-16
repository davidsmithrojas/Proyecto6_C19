const User = require('../models/userModel');
const Cart = require('../models/CartModel');
const RoleRequest = require('../models/roleRequestModel');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const logger = require('../utils/logger');

class UserService {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async createUser(userData) {
    try {
      const { username, email, password, role = 'user' } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new Error('El usuario ya existe con este email o nombre de usuario');
      }

      // Crear usuario
      const user = new User({
        username,
        email,
        password,
        role
      });

      await user.save();

      // Crear carrito para el usuario
      await Cart.createUserCart(user._id);

      logger.info('Usuario creado exitosamente', {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      return user.toPublicJSON();
    } catch (error) {
      logger.error('Error al crear usuario', { error: error.message, userData });
      throw error;
    }
  }

  /**
   * Autenticar usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Token y datos del usuario
   */
  static async loginUser(email, password) {
    try {
      // Buscar usuario incluyendo contraseña
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar si la cuenta está bloqueada
      if (user.isLocked) {
        throw new Error('Cuenta bloqueada por múltiples intentos fallidos');
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        // Incrementar intentos de login
        await user.incLoginAttempts();
        throw new Error('Credenciales inválidas');
      }

      // Resetear intentos de login y actualizar último login
      await user.updateLastLogin();

      // Generar token JWT
      const payload = {
        id: user._id,
        role: user.role,
        username: user.username
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience
      });

      logger.info('Usuario autenticado exitosamente', {
        userId: user._id,
        username: user.username,
        role: user.role
      });

      return {
        token,
        user: user.toPublicJSON()
      };
    } catch (error) {
      logger.error('Error en autenticación', { error: error.message, email });
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user.toPublicJSON();
    } catch (error) {
      logger.error('Error al obtener usuario', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Actualizar usuario
   * @param {string} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async updateUser(userId, updateData) {
    try {
      const { username, email, password } = updateData;

      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el email o username ya existen en otro usuario
      if (email || username) {
        const existingUser = await User.findOne({
          _id: { $ne: userId },
          $or: [
            ...(email ? [{ email }] : []),
            ...(username ? [{ username }] : [])
          ]
        });

        if (existingUser) {
          throw new Error('El email o nombre de usuario ya está en uso');
        }
      }

      // Actualizar usuario
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      logger.info('Usuario actualizado exitosamente', {
        userId,
        updatedFields: Object.keys(updateData)
      });

      return updatedUser.toPublicJSON();
    } catch (error) {
      logger.error('Error al actualizar usuario', { error: error.message, userId, updateData });
      throw error;
    }
  }

  /**
   * Solicitar cambio de rol
   * @param {string} userId - ID del usuario
   * @param {string} motivation - Motivación para el cambio
   * @returns {Promise<Object>} Solicitud creada
   */
  static async requestRoleChange(userId, motivation) {
    try {
      // Verificar que el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que no sea admin (los admin no pueden solicitar cambio)
      if (user.role === 'admin') {
        throw new Error('Los administradores no pueden solicitar cambio de rol');
      }

      // Crear solicitud
      const roleRequest = new RoleRequest({
        user: userId,
        motivation
      });

      await roleRequest.save();

      logger.info('Solicitud de cambio de rol creada', {
        userId,
        requestedRole: roleRequest.requestedRole,
        requestId: roleRequest._id
      });

      return roleRequest;
    } catch (error) {
      logger.error('Error al crear solicitud de rol', { error: error.message, userId, motivation });
      throw error;
    }
  }

  /**
   * Obtener solicitudes de rol pendientes (solo admin)
   * @returns {Promise<Array>} Lista de solicitudes pendientes
   */
  static async getPendingRoleRequests() {
    try {
      const requests = await RoleRequest.getPendingRequests();
      return requests;
    } catch (error) {
      logger.error('Error al obtener solicitudes pendientes', { error: error.message });
      throw error;
    }
  }

  /**
   * Procesar solicitud de rol (aprobar/rechazar)
   * @param {string} requestId - ID de la solicitud
   * @param {string} decision - 'approved' o 'rejected'
   * @param {string} adminId - ID del admin que procesa
   * @param {string} notes - Notas adicionales
   * @returns {Promise<Object>} Solicitud procesada
   */
  static async handleRoleRequest(requestId, decision, adminId, notes = '') {
    try {
      const request = await RoleRequest.findById(requestId);
      if (!request) {
        throw new Error('Solicitud no encontrada');
      }

      if (decision === 'approved') {
        // Actualizar rol del usuario
        await User.findByIdAndUpdate(request.user, { 
          role: request.requestedRole 
        });

        // Aprobar solicitud
        await request.approve(adminId, notes);

        logger.info('Solicitud de rol aprobada', {
          requestId,
          userId: request.user,
          newRole: request.requestedRole,
          adminId
        });
      } else {
        // Rechazar solicitud
        await request.reject(adminId, notes);

        logger.info('Solicitud de rol rechazada', {
          requestId,
          userId: request.user,
          adminId
        });
      }

      return request;
    } catch (error) {
      logger.error('Error al procesar solicitud de rol', { 
        error: error.message, 
        requestId, 
        decision, 
        adminId 
      });
      throw error;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas de usuarios
   */
  static async getUserStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });

      return {
        totalUsers,
        activeUsers,
        byRole: stats
      };
    } catch (error) {
      logger.error('Error al obtener estadísticas de usuarios', { error: error.message });
      throw error;
    }
  }
}

module.exports = UserService;
