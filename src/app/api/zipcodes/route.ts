import { NextRequest, NextResponse } from 'next/server';
import connection from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { verifyToken } from '@/lib/auth';  // トークンの検証関数をインポート

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zip_code = searchParams.get('zip_code');
  
  // クッキーからトークンを取得
  const token = req.cookies.get('token')?.value;

  // トークンの検証
  if (!token || !verifyToken(token)) {
    // トークンが無効の場合、401 Unauthorizedステータスを返す
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!zip_code) {
    return NextResponse.json({ message: 'Invalid zip_code parameter' }, { status: 400 });
  }

  try {
    const query = 'SELECT zip_code, prefecture, city, town FROM zip_codes WHERE zip_code LIKE ?';
    const values = [`${zip_code}%`];

    const [rows]: [RowDataPacket[], unknown] = await connection.execute(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No matching records found' }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching zip codes', error);

    // 型アサーションを使用してエラーオブジェクトにアクセス
    const errorMessage = (error as Error).message || 'An unknown error occurred';
    
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}
