import { z } from 'zod';

export const leadValidationSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().trim().min(7, 'Please provide a valid contact number'),
  projectType: z.string().trim().min(2, 'Project type is required'),
  location: z.string().trim().min(2, 'Location is required'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  whatsapp: z.string().trim().optional(),
  customerType: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  carpetAreaRange: z.string().trim().optional(),
  carpetAreaSqFt: z.number().int().positive().optional().nullable(),
  budgetRange: z.string().trim().optional(),
  requirements: z.string().trim().optional(),
  timeline: z.string().trim().optional(),
  bhk: z.string().trim().optional(),
  projectStatus: z.string().trim().optional(),
  message: z.string().trim().optional(),
  source: z.string().trim().default('website')
});

export type LeadInput = z.infer<typeof leadValidationSchema>;
