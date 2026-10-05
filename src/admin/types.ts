export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'project-new'
  | 'project-edit'
  | 'services'
  | 'leads'
  | 'testimonials'
  | 'media'
  | 'settings';

export interface AdminStats {
  projects: {
    total: number;
    published: number;
    draft: number;
  };
  leads: {
    total: number;
    newEnquiries: number;
  };
  services: number;
  testimonials: number;
}
