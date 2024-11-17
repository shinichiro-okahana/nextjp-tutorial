// app/api/users/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connection from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { serialize } from 'cookie';
import { User } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  const { login_id, password } = await req.json();
  console.log(`login_id=${login_id} password=${password}`);

  try {
    const [rows]: [RowDataPacket[], unknown] = await connection.execute('SELECT login_id, password FROM user_info WHERE login_id = ?', [login_id]);
    if (rows.length > 0) {
      const user = rows[0] as User;
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = generateToken({ login_id: user.login_id });

        const serializedCookie = serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600,
          path: '/',
        });

        const response = NextResponse.json({ token });
        response.headers.set('Set-Cookie', serializedCookie);

        return response;
      }
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Error during authentication', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
