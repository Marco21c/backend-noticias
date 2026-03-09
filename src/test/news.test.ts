import request from 'supertest';
import { describe, it, expect } from 'vitest';

import app from '../../index.js'; // Importamos el server express

// Conectamos a una BD local en memoria o a la URI de QA real.
// Para este entorno, probamos solo la estructura de routing y controlador con la BD de desarollo actual.

describe('News API Integrations', () => {

  describe('GET /api/news', () => {

    it('debería retornar 200 y una estructura paginada válida por defecto', async () => {
      const response = await request(app).get('/api/news');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it('debería responder con error de validación 400 si la página es inválida', async () => {
      const response = await request(app).get('/api/news?page=abc');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
    });

  });
});
