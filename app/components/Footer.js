import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-gray-600 mt-10">
      <div className="space-x-4">
        <Link href="/dispute-policy" className="hover:underline">
          Dispute Policy
        </Link>
        <span>•</span>
        <Link href="/terms-of-service" className="hover:underline">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
    }
