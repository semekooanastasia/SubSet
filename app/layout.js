import './globals.css';

export const metadata = {
  title: 'SubSet',
  description: 'Abonementu pārvaldības lietotne',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="lv">
      <body>{children}</body>
    </html>
  );
}
