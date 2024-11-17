// lib/database.ts
import db from '@/lib/db'; // MySQLコネクションをインポート
import { User } from '@/lib/types'; // ユーザー情報の型をインポート

// user_infoテーブルからユーザー情報を取得する関数
export async function getUserInfoByLoginId(login_id: string): Promise<User | null> {
  try {
    const [rows] = await db.execute('SELECT * FROM user_info WHERE login_id = ?', [login_id]);
    const users: User[] = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}
