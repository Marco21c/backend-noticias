import { Router } from 'express';

import { newsletterController } from '../controllers/newsletter.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { USER_ROLES } from '../utils/roles.js';
import {
	subscribeSchema,
	updatePreferencesSchema,
	newsletterIdParamSchema,
	newsletterEmailParamSchema,
	newsletterCategoryParamSchema,
	newsletterLatestNewsQuerySchema,
} from '../validations/newsletter.schemas.js';

const newsletterRouter = Router();

// ============================================
// RUTAS PARA USUARIOS (Requieren autenticación)
// ============================================

/**
 * POST /newsletter/subscribe
 * Suscribir el usuario autenticado al newsletter
 * Roles permitidos: user, editor, admin, superadmin
 */
newsletterRouter.post(
	'/subscribe',
	authenticate,
	requireRole(USER_ROLES.USER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ body: subscribeSchema }),
	asyncHandler(newsletterController.subscribe)
);

/**
 * PUT /newsletter/preferences
 * Actualizar preferencias del usuario autenticado
 * Roles permitidos: user, editor, admin, superadmin
 */
newsletterRouter.put(
	'/preferences',
	authenticate,
	requireRole(USER_ROLES.USER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ body: updatePreferencesSchema }),
	asyncHandler(newsletterController.updatePreferences)
);

/**
 * DELETE /newsletter/unsubscribe
 * Desuscribir al usuario autenticado
 * Roles permitidos: user, editor, admin, superadmin
 */
newsletterRouter.delete(
	'/unsubscribe',
	authenticate,
	requireRole(USER_ROLES.USER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	asyncHandler(newsletterController.unsubscribe)
);

/**
 * GET /newsletter/my-subscription
 * Obtener la suscripción propia del usuario autenticado
 * Roles permitidos: user, editor, admin, superadmin
 */
newsletterRouter.get(
	'/my-subscription',
	authenticate,
	requireRole(USER_ROLES.USER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	asyncHandler(newsletterController.getMySubscription)
);

/**
 * GET /newsletter/my-news
 * Obtener ultimas noticias segun preferencias del usuario autenticado
 * Roles permitidos: user, editor, admin, superadmin
 */
newsletterRouter.get(
	'/my-news',
	authenticate,
	requireRole(USER_ROLES.USER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ query: newsletterLatestNewsQuerySchema }),
	asyncHandler(newsletterController.getMyLatestNews)
);

// ============================================
// RUTAS SOLO PARA ADMIN
// ============================================

/**
 * GET /newsletter/admin/subscribers
 * Obtener todos los suscriptores activos
 * Roles permitidos: admin, superadmin
 */
newsletterRouter.get(
	'/admin/subscribers',
	authenticate,
	requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	asyncHandler(newsletterController.getAllSubscribers)
);

/**
 * GET /newsletter/admin/subscribers/:id
 * Buscar suscriptor por ID
 * Roles permitidos: admin, superadmin
 */
newsletterRouter.get(
	'/admin/subscribers/:id',
	authenticate,
	requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ params: newsletterIdParamSchema }),
	asyncHandler(newsletterController.getSubscriberById)
);

/**
 * GET /newsletter/admin/subscribers/email/:email
 * Buscar suscriptor por email
 * Roles permitidos: admin, superadmin
 */
newsletterRouter.get(
	'/admin/subscribers/email/:email',
	authenticate,
	requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ params: newsletterEmailParamSchema }),
	asyncHandler(newsletterController.getSubscriberByEmail)
);

/**
 * GET /newsletter/admin/subscribers/category/:categoryId
 * Obtener suscriptores por categoría
 * Roles permitidos: admin, superadmin
 */
newsletterRouter.get(
	'/admin/subscribers/category/:categoryId',
	authenticate,
	requireRole(USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
	validateRequest({ params: newsletterCategoryParamSchema }),
	asyncHandler(newsletterController.getSubscribersByCategory)
);

export default newsletterRouter;
