import { prisma } from '../prisma.ts';

export async function getPublishedTestimonials() {
  try {
    if (prisma) {
      return await prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { sortOrder: 'asc' }
      });
    }
  } catch (err) {
    console.warn('[Testimonials] Fetch failed:', err);
  }
  return [];
}

export async function getAllTestimonialsForAdmin() {
  try {
    if (prisma) {
      return await prisma.testimonial.findMany({
        orderBy: { sortOrder: 'asc' }
      });
    }
  } catch (err) {
    console.warn('[Testimonials] Admin fetch failed:', err);
  }
  return [];
}

export async function createTestimonial(data: any) {
  if (!prisma) throw new Error('Database not connected.');
  return await prisma.testimonial.create({
    data: {
      clientName: data.clientName,
      projectName: data.projectName || null,
      quote: data.quote,
      role: data.role || null,
      image: data.image || null,
      published: Boolean(data.published),
      sortOrder: data.sortOrder || 0
    }
  });
}

export async function updateTestimonial(id: string, data: any) {
  if (!prisma) throw new Error('Database not connected.');
  return await prisma.testimonial.update({
    where: { id },
    data
  });
}

export async function deleteTestimonial(id: string) {
  if (!prisma) throw new Error('Database not connected.');
  return await prisma.testimonial.delete({
    where: { id }
  });
}
