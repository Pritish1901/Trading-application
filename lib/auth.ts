import * as crypto from 'crypto';
import type { JWTPayload } from './types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + JWT_SECRET)
    .digest('hex');
}

// Verify password against hash
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Create JWT token
export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn = '7d'): string {
  const now = Math.floor(Date.now() / 1000);
  const expiryTime = now + (7 * 24 * 60 * 60); // 7 days default

  const token = {
    ...payload,
    iat: now,
    exp: expiryTime,
  };

  // Simple JWT encoding (in production, use jsonwebtoken library)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(token)).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${signature}`;
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, body, signature] = token.split('.');
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64').toString());

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from request headers
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Set JWT in HTTP-only cookie (server-side)
export function setAuthCookie(token: string, res?: any): string {
  const cookie = `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;
  return cookie;
}

// Clear auth cookie
export function clearAuthCookie(): string {
  return 'auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
}
