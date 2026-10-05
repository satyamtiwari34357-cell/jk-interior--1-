export type InspirationFilter =
  | 'All'
  | 'Living'
  | 'Bedroom'
  | 'Kitchen'
  | 'Dining'
  | 'Office'
  | 'Commercial'
  | 'Furniture'
  | 'Lighting'
  | 'Materials'
  | 'Architecture';

export interface OnlineVisual {
  id: string;
  source: 'Pexels' | 'Licensed Architecture Archive';
  sourceUrl: string;
  photographer: string;
  photographerUrl: string;
  imageUrl: string;
  thumbnailUrl: string;
  alt: string;
  category: 'Residential' | 'Commercial' | 'Design Details';
  subcategory: string;
  filterTag: InspirationFilter;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square' | 'panoramic';
  tags: string[];
  isConcept: boolean; // Strictly true for all online concept images
  createdAt: string;
}

export interface InspirationApiResponse {
  items: OnlineVisual[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  filter: InspirationFilter;
  source: 'pexels-live' | 'curated-cache';
}
