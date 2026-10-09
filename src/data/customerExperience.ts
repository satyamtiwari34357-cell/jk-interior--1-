export const QUICK_PATHS = [
  { label: "My Home", service: "residential-interior-design" },
  { label: "My Office", service: "office-design" },
  { label: "My Commercial Space", service: "commercial-interior-design" },
  { label: "Luxury Home", service: "luxury-home-design" },
  { label: "Custom Furniture", service: "furniture-custom-furniture" },
] as const;

export const SERVICE_DATA = [
  { slug: "residential-interior-design", name: "Residential Interior Design", shortDescription: "Design for apartments, homes and villas.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
  { slug: "commercial-interior-design", name: "Commercial Interior Design", shortDescription: "Interiors for shops, restaurants and shared spaces.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", sortOrder: 2 },
  { slug: "office-design", name: "Office Design", shortDescription: "Workspaces planned for your people and daily work.", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80", sortOrder: 3 },
  { slug: "luxury-home-design", name: "Luxury Home Design", shortDescription: "A considered design for a home with individual needs.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", sortOrder: 4 },
  { slug: "turnkey-interior", name: "Turnkey Interior", shortDescription: "One team to manage design, work and finishing.", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80", sortOrder: 5 },
  { slug: "furniture-custom-furniture", name: "Furniture / Custom Furniture", shortDescription: "Furniture designed to fit your space.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", sortOrder: 6 },
] as const;

export const SERVICE_HELP: Record<string, string> = Object.fromEntries(
  SERVICE_DATA.map(({ slug, shortDescription }) => [slug, shortDescription]),
);

export const STYLE_QUIZ_OPTIONS = {
  look: ["Modern", "Luxury", "Minimal", "Warm", "Elegant", "Bold"],
  space: ["Apartment", "Villa", "Office", "Commercial", "Other"],
  priority: ["Looks", "Comfort", "Storage", "Function", "Materials", "Complete Execution"],
} as const;

export const PROJECT_CATEGORIES = [
  "Residential",
  "Commercial",
  "Office",
  "Luxury Home",
  "Turnkey",
  "Custom Furniture",
] as const;

export const PROCESS_STEPS = [
  { number: "01", title: "Discover", description: "We understand your space and requirements." },
  { number: "02", title: "Plan", description: "We plan the layout, scope and direction." },
  { number: "03", title: "Design", description: "We develop the interior design and details." },
  { number: "04", title: "Execute", description: "We bring the approved design to life." },
  { number: "05", title: "Deliver", description: "We complete the final details." },
] as const;

export const CONSULTATION_OPTIONS = {
  customerTypes: ["Homeowner", "Business Owner", "Architect / Developer", "Corporate Representative", "Other"],
  projectTypes: ["Residential Interior", "Commercial Interior", "Office", "Luxury Home", "Turnkey Interior", "Custom Furniture", "Other"],
  propertyTypes: ["Apartment", "Villa", "Bungalow", "Office", "Retail", "Restaurant", "Other"],
  locations: ["Mumbai", "Other"],
  carpetAreas: ["Below 500 sq. ft.", "500–1,000 sq. ft.", "1,000–1,500 sq. ft.", "1,500–2,500 sq. ft.", "2,500–4,000 sq. ft.", "4,000+ sq. ft.", "Not sure"],
  requirements: ["Interior Design", "Space Planning", "Turnkey Execution", "Furniture", "Custom Furniture", "Renovation", "Lighting", "Other"],
  budgets: ["Under ₹10 Lakhs", "₹10–20 Lakhs", "₹20–40 Lakhs", "₹40–75 Lakhs", "₹75 Lakhs–₹1 Crore", "₹1 Crore+", "Not decided yet"],
  timelines: ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "6+ months", "Just exploring"],
  bhk: ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Not applicable"],
  projectStatuses: ["Ready Property", "Under Construction", "Renovation", "Commercial Property", "Not Sure"],
  contactMethods: ["Phone Call", "WhatsApp", "Email"],
} as const;
