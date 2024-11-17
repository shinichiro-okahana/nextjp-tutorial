// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header>
          <nav>
            <ul>
              <li><Link href="/">ホーム</Link></li>
              <li><Link href="/about">アバウト</Link></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>フッターコンテンツ</p>
        </footer>
      </body>
    </html>
  );
}
