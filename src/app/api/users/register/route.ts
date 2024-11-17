// app/api/users/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connection from '@/lib/db';

export async function POST(req: NextRequest) {
  const { login_id, password } = await req.json();
  console.log(`login_id=${login_id} password=${password}`);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`hashedPassword=${hashedPassword}`);
    await connection.execute(
      'INSERT INTO user_info (login_id, password) VALUES (?, ?)',
      [login_id, hashedPassword]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during user registration', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
