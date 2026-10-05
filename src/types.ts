export interface Project {
  id: string;
  title: string;
  tagline: string;
  location: string;
  category: 'Penthouse' | 'Seafront Villa' | 'Bespoke Residence' | 'Commercial Atelier';
  year: string;
  area: string;
  duration: string;
  heroImage: string;
  gallery: string[];
  architecturalConcept: string;
  clientBrief: string;
  materials: string[];
  craftHighlights: string[];
  testimonial?: {
    quote: string;
    author: string;
    designation: string;
  };
}

export interface MaterialSwatch {
  id: string;
  name: string;
  category: 'Stone & Marble' | 'Wood & Veneer' | 'Metals' | 'Textiles' | 'Plasters & Glass';
  origin: string;
  finish: string;
  description: string;
  tactileNote: string;
  imageUrl: string;
  idealApplication: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  residence: string;
  location: string;
  year: string;
  avatarUrl: string;
}

export interface ConsultationRequest {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  carpetArea: string;
  possessionTimeline: string;
  estimatedBudget: string;
  specialRequirements: string;
  selectedMaterials?: string[];
}
