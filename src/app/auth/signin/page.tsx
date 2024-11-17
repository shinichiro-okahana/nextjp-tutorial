'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { login_id: loginId, password: password });
      if (response.status === 200) {
        alert('Login successful!');
        router.push('/');  // ホームページに遷移
      }
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>サインイン</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Login ID:
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">サインイン</button>
      </form>
    </div>
  );
}
