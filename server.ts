import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

import { fetchInspirationVisuals } from "./src/lib/data/inspirationService.ts";
import {
  getPublishedProjects,
  getProjectBySlug,
  getAllProjectsForAdmin,
  createProject,
  updateProject,
  deleteProject,
  REAL_PUBLISHED_PROJECTS,
} from "./src/lib/data/projectsRepository.ts";
import {
  getPublishedServices,
  getServiceBySlug,
} from "./src/lib/data/servicesRepository.ts";
import {
  createLead,
  getAllLeadsForAdmin,
  updateLeadStatus,
} from "./src/lib/data/leadsRepository.ts";
import {
  getPublishedTestimonials,
  getAllTestimonialsForAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./src/lib/data/testimonialsRepository.ts";
import {
  getSiteSettings,
  updateSiteSettings,
} from "./src/lib/data/settingsRepository.ts";
import {
  getAllMediaForAdmin,
  createMediaRecord,
  deleteMediaRecord,
} from "./src/lib/data/mediaRepository.ts";
import {
  authenticateAdmin,
  createSessionToken,
  invalidateSessionToken,
  requireAdminAuth,
} from "./src/lib/auth.ts";
import {
  generateUploadSignature,
  deleteCloudinaryAsset,
  isCloudinaryConfigured,
} from "./src/lib/cloudinary.ts";
import { prisma } from "./src/lib/prisma.ts";
import { InspirationFilter } from "./src/types/visuals.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- PUBLIC API ROUTES ---

  // 1. Inspiration / Concept Visuals API (Cached & Paginated, Pexels server-side integration)
  app.get("/api/inspiration", async (req, res) => {
    try {
      const filter = (req.query.filter as InspirationFilter) || "All";
      const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
      const limit = Math.min(
        50,
        Math.max(1, parseInt((req.query.limit as string) || "12", 10)),
      );

      const response = await fetchInspirationVisuals(filter, page, limit);
      res.json(response);
    } catch (error) {
      console.error("[API /api/inspiration] Error:", error);
      res.status(500).json({
        error:
          "Unable to retrieve design inspiration visuals. Please try again later.",
      });
    }
  });

  // 2. Real JK Interior Projects API (Strictly enforces: status = PUBLISHED and isConcept = false)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await getPublishedProjects();
      res.json({
        projects,
        message:
          projects.length === 0
            ? "JK Interior project portfolio is being prepared."
            : undefined,
      });
    } catch (error) {
      console.error("[API /api/projects] Error:", error);
      res.status(500).json({ error: "Unable to load projects." });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const project = await getProjectBySlug(req.params.slug);
      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or not published." });
      }
      res.json({ project });
    } catch (error) {
      console.error("[API /api/projects/:slug] Error:", error);
      res.status(500).json({ error: "Unable to load project." });
    }
  });

  // 3. Confirmed Services API
  app.get("/api/services", async (req, res) => {
    try {
      const services = await getPublishedServices();
      res.json({ services });
    } catch (error) {
      console.error("[API /api/services] Error:", error);
      res.status(500).json({ error: "Unable to load services." });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await getServiceBySlug(req.params.slug);
      if (!service) {
        return res.status(404).json({ error: "Service not found." });
      }
      res.json({ service });
    } catch (error) {
      console.error("[API /api/services/:slug] Error:", error);
      res.status(500).json({ error: "Unable to load service." });
    }
  });

  // 4. Testimonials Public API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await getPublishedTestimonials();
      res.json({ testimonials });
    } catch (error) {
      res.status(500).json({ error: "Unable to load testimonials." });
    }
  });

  // 5. Site Settings Public API
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await getSiteSettings();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ error: "Unable to load site settings." });
    }
  });

  // 6. Consultation Leads Submission API (Server-side Zod validation + anti-spam + email notify)
  app.post("/api/leads", async (req, res) => {
    try {
      const result = await createLead(req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error("[API /api/leads] Error:", error);
      res.status(500).json({
        success: false,
        message:
          "Something went wrong while submitting your request. Please try again or contact us directly.",
      });
    }
  });

  // 7. Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      database: Boolean(process.env.DATABASE_URL),
      pexelsConfigured: Boolean(process.env.PEXELS_API_KEY),
      cloudinaryConfigured: isCloudinaryConfigured(),
      emailConfigured: Boolean(process.env.EMAIL_API_KEY),
    });
  });

  // 8. Dynamic Production SEO Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        `${req.protocol}://${req.get("host")}`;
      const [projects, services] = await Promise.all([
        getPublishedProjects(),
        getPublishedServices(),
      ]);

      const publicPages = [
        "",
        "projects",
        "services",
        "studio",
        "process",
        "contact",
        "inspiration",
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const page of publicPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/${page}</loc>\n`;
        xml += `    <changefreq>${page === "" ? "weekly" : "monthly"}</changefreq>\n`;
        xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const proj of projects) {
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/projects/${proj.slug}</loc>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const srv of services) {
        if (srv.published) {
          xml += `  <url>\n`;
          xml += `    <loc>${siteUrl}/services/${srv.slug}</loc>\n`;
          xml += `    <changefreq>monthly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600, s-maxage=86400");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap Error]:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // 9. Robots.txt
  app.get("/robots.txt", (req, res) => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${req.protocol}://${req.get("host")}`;
    const robots = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /admin/",
      "Disallow: /api/admin/",
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "public, max-age=86400");
    res.send(robots);
  });

  // --- ADMIN AUTHENTICATION API ---

  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await authenticateAdmin(email, password);
    if (!user) {
      return res
        .status(401)
        .json({
          error: "Invalid credentials. Please verify your email and password.",
        });
    }

    const token = createSessionToken(user);
    res.cookie("jk_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user,
    });
  });

  app.post("/api/admin/logout", (req, res) => {
    const token =
      req.cookies?.jk_admin_token ||
      req.headers.authorization?.replace("Bearer ", "");
    invalidateSessionToken(token);
    res.clearCookie("jk_admin_token");
    res.json({ success: true, message: "Logged out successfully." });
  });

  app.get("/api/admin/me", requireAdminAuth, (req, res) => {
    res.json({ user: (req as any).adminUser });
  });

  // --- CLOUDINARY SIGNED UPLOADS (Admin Only) ---
  app.post("/api/sign-cloudinary-params", requireAdminAuth, (req, res) => {
    try {
      const folder = req.body?.folder || "jk-interior/projects";
      const signatureData = generateUploadSignature(folder);

      if (!signatureData) {
        // Return simulated development signature configuration
        return res.json({
          configured: false,
          message:
            "Cloudinary credentials not yet configured. The system will use direct media registration mode.",
        });
      }

      res.json({
        configured: true,
        ...signatureData,
      });
    } catch (err) {
      console.error("[Cloudinary Signature Error]:", err);
      res.status(500).json({ error: "Failed to generate upload signature." });
    }
  });

  // --- ADMIN CMS DATA APIS (Protected) ---

  // Admin Dashboard Statistics
  app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
      let projectCount = 0;
      let publishedCount = 0;
      let draftCount = 0;
      let leadCount = 0;
      let newLeadCount = 0;
      let serviceCount = 6;
      let testimonialCount = 0;

      if (prisma) {
        projectCount = await prisma.project.count();
        publishedCount = await prisma.project.count({
          where: { status: "PUBLISHED", isConcept: false },
        });
        draftCount = await prisma.project.count({ where: { status: "DRAFT" } });
        leadCount = await prisma.lead.count();
        newLeadCount = await prisma.lead.count({ where: { status: "NEW" } });
        serviceCount = await prisma.service.count();
        testimonialCount = await prisma.testimonial.count();
      }

      if (projectCount === 0) {
        projectCount = REAL_PUBLISHED_PROJECTS.length;
        publishedCount = REAL_PUBLISHED_PROJECTS.length;
      }
      if (serviceCount === 0) {
        serviceCount = 6;
      }

      res.json({
        projects: {
          total: projectCount,
          published: publishedCount,
          draft: draftCount,
        },
        leads: {
          total: leadCount,
          newEnquiries: newLeadCount,
        },
        services: serviceCount,
        testimonials: testimonialCount,
      });
    } catch (err) {
      console.error("[Admin Stats Error]:", err);
      res.status(500).json({ error: "Failed to calculate stats." });
    }
  });

  // Projects CRUD
  app.get("/api/admin/projects", requireAdminAuth, async (req, res) => {
    try {
      const { search, category, status } = req.query;
      const projects = await getAllProjectsForAdmin(
        search as string | undefined,
        category as string | undefined,
        status as string | undefined,
      );
      res.json({ projects });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch projects." });
    }
  });

  app.post("/api/admin/projects", requireAdminAuth, async (req, res) => {
    try {
      const project = await createProject(req.body);
      res.status(201).json({ success: true, project });
    } catch (err: any) {
      console.error("[Admin Create Project Error]:", err);
      res
        .status(400)
        .json({ error: err.message || "Unable to create project." });
    }
  });

  app.put("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const project = await updateProject(req.params.id, req.body);
      res.json({ success: true, project });
    } catch (err: any) {
      console.error("[Admin Update Project Error]:", err);
      res
        .status(400)
        .json({ error: err.message || "Unable to update project." });
    }
  });

  app.delete("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      await deleteProject(req.params.id);
      res.json({ success: true, message: "Project deleted successfully." });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: err.message || "Unable to delete project." });
    }
  });

  // Leads Management
  app.get("/api/admin/leads", requireAdminAuth, async (req, res) => {
    try {
      const { status, search } = req.query;
      const leads = await getAllLeadsForAdmin(
        status as string,
        search as string,
      );
      res.json({ leads });
    } catch (err) {
      res.status(500).json({ error: "Unable to load enquiries." });
    }
  });

  app.put("/api/admin/leads/:id", requireAdminAuth, async (req, res) => {
    try {
      const { status, internalNotes, lastContactedAt, nextFollowUpAt } =
        req.body;
      const updated = await updateLeadStatus(
        req.params.id,
        status,
        internalNotes,
        lastContactedAt ? new Date(lastContactedAt) : undefined,
        nextFollowUpAt ? new Date(nextFollowUpAt) : undefined,
      );
      res.json({ success: true, lead: updated });
    } catch (err) {
      res.status(400).json({ error: "Unable to update lead." });
    }
  });

  // Services Admin Management
  app.get("/api/admin/services", requireAdminAuth, async (req, res) => {
    try {
      const services = await getPublishedServices();
      res.json({ services });
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch services." });
    }
  });

  app.put("/api/admin/services/:id", requireAdminAuth, async (req, res) => {
    try {
      if (prisma) {
        const updated = await prisma.service.update({
          where: { id: req.params.id },
          data: req.body,
        });
        return res.json({ success: true, service: updated });
      }
      res.json({ success: true, service: req.body });
    } catch (err) {
      res.status(400).json({ error: "Unable to update service." });
    }
  });

  // Testimonials Admin Management
  app.get("/api/admin/testimonials", requireAdminAuth, async (req, res) => {
    try {
      const testimonials = await getAllTestimonialsForAdmin();
      res.json({ testimonials });
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch testimonials." });
    }
  });

  app.post("/api/admin/testimonials", requireAdminAuth, async (req, res) => {
    try {
      const t = await createTestimonial(req.body);
      res.status(201).json({ success: true, testimonial: t });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: err.message || "Unable to save testimonial." });
    }
  });

  app.put("/api/admin/testimonials/:id", requireAdminAuth, async (req, res) => {
    try {
      const t = await updateTestimonial(req.params.id, req.body);
      res.json({ success: true, testimonial: t });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: err.message || "Unable to update testimonial." });
    }
  });

  app.delete(
    "/api/admin/testimonials/:id",
    requireAdminAuth,
    async (req, res) => {
      try {
        await deleteTestimonial(req.params.id);
        res.json({ success: true });
      } catch (err: any) {
        res
          .status(400)
          .json({ error: err.message || "Unable to delete testimonial." });
      }
    },
  );

  // Media Library Management
  app.get("/api/admin/media", requireAdminAuth, async (req, res) => {
    try {
      const { search, source } = req.query;
      const media = await getAllMediaForAdmin(
        search as string,
        source as string,
      );
      res.json({ media });
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch media library." });
    }
  });

  app.post("/api/admin/media", requireAdminAuth, async (req, res) => {
    try {
      const media = await createMediaRecord(req.body);
      res.status(201).json({ success: true, media });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: err.message || "Unable to save media record." });
    }
  });

  app.delete("/api/admin/media/:id", requireAdminAuth, async (req, res) => {
    try {
      if (req.body?.publicId) {
        await deleteCloudinaryAsset(req.body.publicId);
      }
      await deleteMediaRecord(req.params.id);
      res.json({ success: true, message: "Media deleted." });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Unable to delete media." });
    }
  });

  // Site Settings Admin Management
  app.get("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await getSiteSettings();
      res.json({ settings });
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch site settings." });
    }
  });

  app.put("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const updated = await updateSiteSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res
        .status(400)
        .json({ error: err.message || "Unable to update site settings." });
    }
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JK Interior Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[JK Interior Server] Failed to start:", err);
  process.exit(1);
});
