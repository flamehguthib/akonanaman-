import { Search, User } from 'lucide-react';

export function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        
        {/* Logo - Sized down slightly for professional look */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Part<span className="text-blue-600">Time</span>
          </h1>
        </div>
        
        {/* Search Bar - Flex-1 makes it take up the middle space */}
        <div className="hidden flex-1 max-w-2xl md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search users, companies, jobs..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>

      </div>
    </nav>
  );
}