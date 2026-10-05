import { prisma } from '../prisma.ts';
import { leadValidationSchema, LeadInput } from '../validations/lead.ts';
import { sendLeadNotificationEmail, sendCustomerConfirmationEmail } from '../email/index.ts';

export interface LeadCreationResult {
  success: boolean;
  leadId?: string;
  errors?: string[];
  message: string;
}

// Anti-spam memory cache: prevent duplicate submissions within 30 seconds
const recentSubmissions = new Map<string, number>();

export async function createLead(rawInput: unknown): Promise<LeadCreationResult> {
  const parseResult = leadValidationSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    return {
      success: false,
      errors: errorMessages,
      message: 'Please check the required fields.'
    };
  }

  const data: LeadInput = parseResult.data;

  // Anti-spam honeypot check (if a bot filled a hidden field)
  if ((rawInput as any)?.website_url_trap || (rawInput as any)?.fax) {
    console.warn('[Anti-Spam] Bot detected via honeypot trap.');
    return {
      success: true,
      leadId: `spam-${Date.now()}`,
      message: 'Thank you for your inquiry.'
    };
  }

  // Duplicate submission throttle based on phone + location
  const throttleKey = `${data.phone}_${data.location}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  const lastTime = recentSubmissions.get(throttleKey);
  if (lastTime && Date.now() - lastTime < 30000) {
    return {
      success: true,
      leadId: `lead-dup-${Date.now()}`,
      message: 'Your inquiry has already been received. Our team will contact you shortly.'
    };
  }
  if (!prisma) {
    throw new Error('Lead storage is unavailable. Please try again later.');
  }

  let savedLeadId: string;

  try {
    const record = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        projectType: data.projectType.trim(),
        location: data.location.trim(),
        email: data.email ? data.email.trim().toLowerCase() : null,
        whatsapp: data.whatsapp ? data.whatsapp.trim() : data.phone.trim(),
        customerType: data.customerType || 'Homeowner',
        propertyType: data.propertyType || null,
        carpetAreaRange: data.carpetAreaRange || null,
        carpetAreaSqFt: data.carpetAreaSqFt || null,
        budgetRange: data.budgetRange || null,
        requirements: data.requirements || null,
        timeline: data.timeline || null,
        bhk: data.bhk || null,
        projectStatus: data.projectStatus || null,
        message: data.message ? data.message.trim() : null,
        source: data.source || 'website',
        status: 'NEW'
      }
    });
    savedLeadId = record.id;
  } catch (err) {
    console.error('[Leads Repository] DB storage error (sanitized):', err instanceof Error ? err.message : 'Database error');
    throw new Error('Your inquiry could not be saved. Please try again later.');
  }

  recentSubmissions.set(throttleKey, Date.now());

  // Trigger notifications asynchronously so client response is instant
  // Note: Failure of email never prevents successful saving of lead!
  Promise.allSettled([
    sendLeadNotificationEmail(data, savedLeadId),
    sendCustomerConfirmationEmail(data)
  ]).catch(err => {
    console.warn('[Email Trigger] Non-critical email trigger error:', err);
  });

  return {
    success: true,
    leadId: savedLeadId,
    message: 'Your inquiry has been submitted to Kishorilal Sharma’s executive design desk.'
  };
}

export async function getAllLeadsForAdmin(filterStatus?: string, search?: string) {
  try {
    if (prisma) {
      const where: any = {};
      if (filterStatus && filterStatus !== 'ALL') {
        where.status = filterStatus;
      }
      if (search && search.trim() !== '') {
        const s = search.trim();
        where.OR = [
          { name: { contains: s, mode: 'insensitive' } },
          { phone: { contains: s, mode: 'insensitive' } },
          { email: { contains: s, mode: 'insensitive' } },
          { location: { contains: s, mode: 'insensitive' } },
          { projectType: { contains: s, mode: 'insensitive' } }
        ];
      }

      return await prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch (err) {
    console.warn('[Leads Repository] Admin leads fetch skipped/failed:', err);
  }

  return [];
}

export async function updateLeadStatus(
  id: string,
  status: any,
  internalNotes?: string,
  lastContactedAt?: Date,
  nextFollowUpAt?: Date
) {
  try {
    if (prisma) {
      const updateData: any = { status };
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
      if (lastContactedAt !== undefined) updateData.lastContactedAt = lastContactedAt;
      if (nextFollowUpAt !== undefined) updateData.nextFollowUpAt = nextFollowUpAt;

      return await prisma.lead.update({
        where: { id },
        data: updateData
      });
    }
  } catch (err) {
    console.error('[Leads Repository] Failed to update lead status:', err);
    throw err;
  }
  return null;
}
