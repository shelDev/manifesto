import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">Voice Journal</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/record" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Record
            </Link>
            <Link href="/browse" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Browse
            </Link>
            <Link href="/ask" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Ask Journal
            </Link>
            <Link href="/insights" className="text-text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Insights
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
