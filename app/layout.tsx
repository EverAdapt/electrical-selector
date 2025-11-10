import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Electrical Floorplan Overlay',
  description: 'Drag & drop electrical symbols on floorplans - fast and builder-friendly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
