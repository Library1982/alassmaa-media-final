import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Alassmaa Media | العصماء إعلام',description:'Creative production, campaigns, branding and digital experiences in Ajman, UAE.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
