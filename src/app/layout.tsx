import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:underline">ホーム</Link></li>
              <li><Link href="/about" className="hover:underline">アバウト</Link></li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>フッターコンテンツ</p>
        </footer>
      </body>
    </html>
  );
}
