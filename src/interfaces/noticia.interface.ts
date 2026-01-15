export interface INoticia {
  titulo: string;
  slug: string;
  copete: string;
  contenido: string;
  frasesDestacadas: string[];
  autor: string;
  categoria: string;
  imagenPrincipal?: string;
  fuente?: string;
  estado: 'borrador' | 'publicada';
  fechaPublicacion: Date;
}
