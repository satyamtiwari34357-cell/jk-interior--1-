import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "./prisma.ts";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET?.trim() || "";
const SESSIONS = new Map<
  string,
  { email: string; name: string; role: string; expiresAt: number }
>();

export interface AdminUserSession {
  email: string;
  name: string;
  role: string;
}

export function createSessionToken(user: AdminUserSession): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  SESSIONS.set(token, {
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  });
  return token;
}

export function verifySessionToken(
  token: string | undefined,
): AdminUserSession | null {
  if (!token) return null;
  const session = SESSIONS.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return null;
  }
  return {
    email: session.email,
    name: session.name,
    role: session.role,
  };
}

export function invalidateSessionToken(token: string | undefined): void {
  if (token) {
    SESSIONS.delete(token);
  }
}

// Express authentication middleware for /api/admin/* and /api/sign-cloudinary-params
export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Check auth header or cookie
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if ((req as any).cookies && (req as any).cookies.jk_admin_token) {
    token = (req as any).cookies.jk_admin_token;
  }

  const user = verifySessionToken(token);
  if (!user) {
    return res.status(401).json({
      error:
        "Unauthorized. Admin credentials required to access this endpoint.",
    });
  }

  (req as any).adminUser = user;
  next();
}

/**
 * Validates admin credentials against Prisma User table.
 * No hardcoded studio credentials are allowed in source code.
 */
export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminUserSession | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    if (prisma) {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (user) {
        const hashed = SESSION_SECRET
          ? crypto
              .createHash("sha256")
              .update(password + SESSION_SECRET)
              .digest("hex")
          : null;

        if (
          user.passwordHash === password ||
          (hashed && user.passwordHash === hashed)
        ) {
          return {
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    }
  } catch (err) {
    console.warn("[Auth] Database lookup skipped/failed:", err);
  }

  return null;
}
