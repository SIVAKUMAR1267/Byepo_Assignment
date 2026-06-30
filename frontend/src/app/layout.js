import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Byepo Feature Flags',
  description: 'Multi-tenant feature flag management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto p-6 font-sans text-blue-950 bg-blue-50 min-h-screen">
        <nav className="mb-8 pb-4 border-b-2 border-blue-200 flex gap-6">
          <Link href="/" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">End User Portal</Link>
          <Link href="/admin" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">Org Admin Portal</Link>
          <Link href="/super" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">Super Admin Portal</Link>
        </nav>
        
        <main className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          {children}
        </main>
      </body>
    </html>
  );
}