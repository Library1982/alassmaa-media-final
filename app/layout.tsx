import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مجلة أمان | Alassmaa Media',
  description: 'مجلة أمان - مجلة شهرية قانونية وإدارية وأمنية ومجتمعية وثقافية من العصماء الإعلامية.',
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
