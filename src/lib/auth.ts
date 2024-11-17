// lib/auth.ts

import jwt from 'jsonwebtoken';
import { getUserInfoByLoginId } from '@/lib/database'; // ユーザー情報を取得する関数をインポート

const secret = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(payload: object) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, secret) as { login_id: string };
    console.log(`verifyToken(): login_id=${decoded.login_id}`);

    // トークンから抽出したログインIDを使用してユーザー情報を取得
    const user = await getUserInfoByLoginId(decoded.login_id);

    // ユーザー情報が存在し、ログインIDが一致するかを確認
    if (user && user.login_id === decoded.login_id) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('トークン検証エラー:', error);
    return null;
  }
}
