import '../styles/globals.css';

export const metadata = {
  title: 'Emoz Receipt',
  description: 'Receipt generator for Emoz',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
