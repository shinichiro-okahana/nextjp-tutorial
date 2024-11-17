// /app/api/users/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserInfoByLoginId } from '@/lib/database'; // ユーザー情報を取得する関数をインポート

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { login_id: string };
    const user = await getUserInfoByLoginId(decoded.login_id);

    if (user && user.login_id === decoded.login_id) {
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
