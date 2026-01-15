// TODO: Implementar logica de servicio para noticias

import type { INoticia } from '../interfaces/noticia.interface.ts';
import NoticiaModel from '../models/noticia.model.ts';

export class NoticiaService {

    async getAllNoticias(): Promise<INoticia[]> {
        return NoticiaModel.find();
    }
};