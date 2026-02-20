import { NextResponse } from 'next/server';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { validateRegisterRequest, isValidEmail } from '@/lib/validators';
import { apiResponse } from '@/lib/middleware';
import type { RegisterRequest } from '@/lib/types/auth';

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, username } = body;

    // Validation
    const error = validateRegisterRequest(email, password, password);
    if (error) {
      return NextResponse.json(
        apiResponse(null, error, 400),
        { status: 400 }
      );
    }

    // TODO: Check if user already exists in database
    // For now, just create the user
    
    // Hash password
    const passwordHash = hashPassword(password);

    // TODO: Store user in database
    // const user = await db.users.create({
    //   email,
    //   password_hash: passwordHash,
    //   username: username || email.split('@')[0],
    // });

    // Create mock user for now
    const user = {
      id: 1,
      email,
      username: username || email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create JWT token
    const token = createToken({ id: user.id, email: user.email });

    // TODO: Create user portfolio in database
    // await db.portfolios.create({
    //   user_id: user.id,
    //   total_balance: 0,
    // });

    const response = NextResponse.json(
      apiResponse({ user, token }, null, 201),
      { status: 201 }
    );

    // Set auth cookie
    response.headers.set('Set-Cookie', setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('[v0] Register error:', error);
    return NextResponse.json(
      apiResponse(null, 'Registration failed', 500),
      { status: 500 }
    );
  }
}
