'use client';

import { useState } from 'react';
import axios from 'axios';
import { ZipCodeRecord } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ZipCodeSearch() {
  const [zipCode, setZipCode] = useState('');
  const [results, setResults] = useState<ZipCodeRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/zipcodes?zip_code=${zipCode}`);
      setResults(response.data);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // 認証エラーの場合、サインインページにリダイレクト
          router.push('/auth/signin');
        } else {
          setError(error.response?.data?.message || 'An unexpected error occurred');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setResults([]);
    }
  };

  return (
    <div>
      <h1>郵便番号検索</h1>
      <input
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="郵便番号を入力"
      />
      <button onClick={handleSearch}>検索</button>
      {error && <p>{error}</p>}
      <div>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index}>
              <p>郵便番号: {result.zip_code}</p>
              <p>都道府県: {result.prefecture}</p>
              <p>市区町村: {result.city}</p>
              <p>町域: {result.town}</p>
            </div>
          ))
        ) : (
          !error && <p>検索結果がありません</p>
        )}
      </div>
    </div>
  );
}
