import type { Request, Response } from 'express';
import { newsletterService } from '../services/newsletter.service.js';
import { AppError } from '../errors/AppError.js';
import type {
	SubscribeRequestDto,
	UpdatePreferencesRequestDto,
	NewsletterIdRequestDto,
	NewsletterEmailRequestDto,
	NewsletterCategoryRequestDto,
} from '../dtos/newsletter.dto.js';
import {
	toNewsletterResponseDto,
	toNewsletterSubscriberDto,
} from '../dtos/newsletter.dto.js';
import { successResponse } from '../dtos/response.dto.js';
import type { IUser } from '../interfaces/user.interface.js';

export class NewsletterController {
	private service = newsletterService;

	constructor() {
		this.subscribe = this.subscribe.bind(this);
		this.updatePreferences = this.updatePreferences.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.getMySubscription = this.getMySubscription.bind(this);
		this.getAllSubscribers = this.getAllSubscribers.bind(this);
		this.getSubscriberById = this.getSubscriberById.bind(this);
		this.getSubscriberByEmail = this.getSubscriberByEmail.bind(this);
		this.getSubscribersByCategory = this.getSubscribersByCategory.bind(this);
	}

	// ============================================
	// ENDPOINTS PARA USUARIOS (PROPIOS)
	// ============================================

	/**
	 * POST /newsletter/subscribe
	 * Suscribir el usuario autenticado al newsletter
	 */
	async subscribe(req: Request, res: Response): Promise<Response> {
		const user = (req as any).user as IUser;
		const data = res.locals.validated?.body as SubscribeRequestDto;

		if (!user || !user._id) {
			throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
		}

		const newsletter = await this.service.subscribe(
			user,
			data.preferredCategories
		);

		return res.status(201).json(
			successResponse(
				toNewsletterResponseDto(newsletter),
				'Suscripción exitosa al newsletter'
			)
		);
	}

	/**
	 * PUT /newsletter/preferences
	 * Actualizar preferencias del usuario autenticado
	 */
	async updatePreferences(req: Request, res: Response): Promise<Response> {
		const user = (req as any).user as IUser;
		const data = res.locals.validated?.body as UpdatePreferencesRequestDto;

		if (!user || !user._id) {
			throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
		}

		const newsletter = await this.service.updatePreferences(
			user._id as string,
			data.preferredCategories
		);

		return res.status(200).json(
			successResponse(
				toNewsletterResponseDto(newsletter),
				'Preferencias actualizadas exitosamente'
			)
		);
	}

	/**
	 * DELETE /newsletter/unsubscribe
	 * Desuscribir al usuario autenticado
	 */
	async unsubscribe(req: Request, res: Response): Promise<Response> {
		const user = (req as any).user as IUser;

		if (!user || !user._id) {
			throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
		}

		const newsletter = await this.service.unsubscribe(user._id as string);

		return res.status(200).json(
			successResponse(
				toNewsletterResponseDto(newsletter),
				'Te has desuscrito exitosamente del newsletter'
			)
		);
	}

	/**
	 * GET /newsletter/my-subscription
	 * Obtener la suscripción propia del usuario autenticado
	 */
	async getMySubscription(req: Request, res: Response): Promise<Response> {
		const user = (req as any).user as IUser;

		if (!user || !user._id) {
			throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
		}

		const newsletter = await this.service.getMySubscription(user._id as string);

		if (!newsletter) {
			throw new AppError(
				'No estás suscrito al newsletter',
				404,
				'NEWSLETTER_NOT_SUBSCRIBED'
			);
		}

		return res.status(200).json(
			successResponse(toNewsletterResponseDto(newsletter))
		);
	}

	// ============================================
	// ENDPOINTS SOLO PARA ADMIN
	// ============================================

	/**
	 * GET /newsletter/admin/subscribers
	 * Obtener todos los suscriptores activos (solo admin)
	 */
	async getAllSubscribers(_req: Request, res: Response): Promise<Response> {
		const subscribers = await this.service.getAllActiveSubscribers();

		return res.status(200).json(
			successResponse(subscribers.map(toNewsletterSubscriberDto))
		);
	}

	/**
	 * GET /newsletter/admin/subscribers/:id
	 * Buscar suscriptor por ID (solo admin)
	 */
	async getSubscriberById(req: Request, res: Response): Promise<Response> {
		const { id } = res.locals.validated?.params as NewsletterIdRequestDto;

		const subscriber = await this.service.getSubscriberById(id);

		if (!subscriber) {
			throw new AppError('Suscriptor no encontrado', 404, 'SUBSCRIBER_NOT_FOUND');
		}

		return res.status(200).json(
			successResponse(toNewsletterSubscriberDto(subscriber))
		);
	}

	/**
	 * GET /newsletter/admin/subscribers/email/:email
	 * Buscar suscriptor por email (solo admin)
	 */
	async getSubscriberByEmail(req: Request, res: Response): Promise<Response> {
		const { email } = res.locals.validated?.params as NewsletterEmailRequestDto;

		const subscriber = await this.service.getSubscriberByEmail(email);

		if (!subscriber) {
			throw new AppError(
				'Suscriptor no encontrado',
				404,
				'SUBSCRIBER_NOT_FOUND'
			);
		}

		return res.status(200).json(
			successResponse(toNewsletterSubscriberDto(subscriber))
		);
	}

	/**
	 * GET /newsletter/admin/subscribers/category/:categoryId
	 * Obtener suscriptores por categoría (solo admin)
	 */
	async getSubscribersByCategory(req: Request, res: Response): Promise<Response> {
		const { categoryId } = res.locals.validated
			?.params as NewsletterCategoryRequestDto;

		const subscribers = await this.service.getSubscribersByCategory(categoryId);

		return res.status(200).json(
			successResponse(subscribers.map(toNewsletterSubscriberDto))
		);
	}
}

export const newsletterController = new NewsletterController();
