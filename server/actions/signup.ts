"use server"
import { SignupUser } from "@/lib/types";
import bcrypt from 'bcryptjs';
import connection from '@/lib/db';
import {z} from 'zod'

interface MySqlError {
    code: string,
    message: string
}

const userSchema = z.object({
    login_id: z.string().min(1, "ユーザーIDを入力してください。"),
    password: z.string().min(8, "パスワードは8桁以上入力してください。"),
    confirm_password: z.string()
}).superRefine((data, context) => {
    if (data.password !== data.confirm_password) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "パスワードが一致しません。",
            path: ["confirm_password"]
        });
    }
});

export async function signup(user: SignupUser): Promise<string | z.ZodError>{
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    try {
        const result = await userSchema.safeParseAsync(user)
        console.log(`result.success=${result.success}`)
        if (!result.success) {
            console.log(`result.error=${result.error}`)
            return result.error;
        }
        await connection.execute(
            'INSERT INTO user_info (login_id, password) VALUES (?, ?)',
            [user.login_id, hashedPassword]
        );

        return new z.ZodError([{
            code: z.ZodIssueCode.custom,
            message: "ユーザーを登録しました。",
            path: ["message"]
        }]);

    } catch (err: unknown) {
        console.log(`signup(): err=${err}`)
        const e: MySqlError = err as MySqlError;
        if (e?.code === "ER_DUP_ENTRY") {
            return new z.ZodError([{
                code: z.ZodIssueCode.custom,
                message: "ユーザーは既に存在します。",
                path: ["login_id"]
            }]);
        }
        return new z.ZodError([{
            code: z.ZodIssueCode.custom,
            message: e.message,
            path: ["unknown_error"]
        }]);
    }
}