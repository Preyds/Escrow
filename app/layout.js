import './globals.css';
import Footer from './components/Footer'; // 1. IMPORT ADDED HERE

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Your main page content renders here */}
        {children}

        {/* 2. FOOTER PLACED HERE RIGHT BEFORE </body> */}
        <Footer />
      </body>
    </html>
  );
}

