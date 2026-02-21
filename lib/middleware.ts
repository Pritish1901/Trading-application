import { verifyToken, getTokenFromRequest } from './auth';
import type { JWTPayload } from './types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Middleware to verify JWT token
export async function withAuth(
  request: Request
): Promise<{ user: JWTPayload | null; error?: string }> {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return {
        user: null,
        error: 'No token provided',
      };
    }

    const user = verifyToken(token);
    
    if (!user) {
      return {
        user: null,
        error: 'Invalid or expired token',
      };
    }

    return { user };
  } catch (error) {
    return {
      user: null,
      error: 'Authentication failed',
    };
  }
}

// Create standard API response format
export function apiResponse<T = any>(
  data: T | null = null,
  error: string | null = null,
  status = 200
) {
  return {
    status,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}

// Rate limiting helper (simple in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count < maxRequests) {
    record.count++;
    return true;
  }

  return false;
}
