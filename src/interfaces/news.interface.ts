import{Types } from "mongoose";
export interface INews {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  highlights: string[];
  author: Types.ObjectId | string;
  category: 'politic' | 'economy' | 'sports' | 'technology' | 'health' | 'entertainment' | 'science' | 'world' | 'local' | 'education' | 'travel' | 'lifestyle' | 'international';
  mainImage?: string;
  source?: string;
  variant: 'highlighted'| 'featured'| 'default',
  status: 'draft' | 'in_review' |'approved' | 'published' | 'rejected';
  publicationDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
