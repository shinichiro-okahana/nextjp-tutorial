'use client';
import { SignupUser } from "@/lib/types";
import { useState } from "react";
import { signup } from "../../../../server/actions/signup";

interface ZodErrorLocal extends Error {
    path: (string | number)[];
}

export default function SignUpPage() {
    const [user, setUser] = useState<SignupUser>({ login_id: "", password: "", confirm_password: "" });
    const [userMsg, setUserMsg] = useState<SignupUser>({ login_id: "", password: "", confirm_password: "", unknown_error: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res: unknown = await signup(user);
        if (res instanceof Error) {
            const result: ZodErrorLocal[] = JSON.parse(res.message);
            result.forEach(x => {
                setUserMsg(p => ({ ...p, [x.path[0]]: x.message }));
            });
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-black">ユーザー登録</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-md shadow-md space-y-4">
                <div className="flex flex-col">
                    <label className="mb-2 text-black">ユーザーID</label>
                    <input
                        type="text"
                        name="login_id"
                        value={user.login_id}
                        onChange={handleChange}
                        placeholder="ユーザーID"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                    {userMsg.login_id && <p className="text-red-600 mt-1">{userMsg.login_id}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 text-black">パスワード</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="パスワード"
                        className="border border-gray-300 p-2 rounded-md"
                    />
                    {userMsg.password && <p className="text-red-600 mt-1">{userMsg.password}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 text-black">パスワード(確認)</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={user.confirm_password}
                        onChange={handleChange}
                        placeholder="パスワード(確認)"
                        required
                        className="border border-gray-300 p-2 rounded-md"
                    />
                    {userMsg.confirm_password && <p className="text-red-600 mt-1">{userMsg.confirm_password}</p>}
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">ユーザー登録</button>
                {userMsg.message && <p className="text-green-600 mt-4">{userMsg.message}</p>}
                {userMsg.unknown_error && <p className="text-red-600 mt-4">{userMsg.unknown_error}</p>}
            </form>
        </div>
    );
}
