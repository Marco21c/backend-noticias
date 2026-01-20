export interface INews {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  highlights: string[];
  author: string;
  category: 'politic' | 'economy' | 'sports' | 'technology' | 'health' | 'entertainment' | 'science' | 'world' | 'local' | 'education' | 'travel' | 'lifestyle' | 'international';
  mainImage?: string;
  source?: string;
  variant: 'highlighted'| 'featured'| 'default',
  status: 'draft' | 'published';
  publicationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
