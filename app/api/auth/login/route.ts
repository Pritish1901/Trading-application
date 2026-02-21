import { NextResponse } from 'next/server';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { validateRegisterRequest, isValidEmail } from '@/lib/validators';
import { apiResponse } from '@/lib/middleware';
import type { LoginRequest } from '@/lib/types/auth';

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!isValidEmail(email) || !password) {
      return NextResponse.json(
        apiResponse(null, 'Invalid email or password', 400),
        { status: 400 }
      );
    }

    // TODO: Fetch user from database
    // const user = await db.users.findUnique({ where: { email } });
    // if (!user || !verifyPassword(password, user.password_hash)) {
    //   return NextResponse.json(
    //     apiResponse(null, 'Invalid credentials', 401),
    //     { status: 401 }
    //   );
    // }

    // Mock user for now
    const user = {
      id: 1,
      email,
      username: 'testuser',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create JWT token
    const token = createToken({ id: user.id, email: user.email });

    const response = NextResponse.json(
      apiResponse({ user, token }, null, 200),
      { status: 200 }
    );

    // Set auth cookie
    response.headers.set('Set-Cookie', setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      apiResponse(null, 'Login failed', 500),
      { status: 500 }
    );
  }
}
