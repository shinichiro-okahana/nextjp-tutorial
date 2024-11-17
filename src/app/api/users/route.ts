// app/api/users/route.ts

import { NextResponse } from 'next/server';

// ユーザーデータの型定義
interface User {
  id: number;
  name: string;
  email: string;
}

// ダミーデータ
const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];

export async function GET() {
  return NextResponse.json(users);
}
