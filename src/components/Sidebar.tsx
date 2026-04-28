import { User, TrendingUp, Briefcase, Bookmark, Building2, FileText, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-80 space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Profile Section */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-2xl shadow-inner">
            <User className="text-white" size={32} />
          </div>
          <div className="overflow-hidden">
            <h3 className="truncate font-bold text-gray-900 text-lg tracking-tight">
              Dom
            </h3>
            <p className="text-sm font-medium text-gray-500">Student Developer</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-5">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">24</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Applied</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-lg font-bold text-gray-900">156</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Saved</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">892</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Views</p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="space-y-1 border-t border-gray-100 pt-4">
          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-50">
            <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">My Applications</span>
          </button>
          
          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-blue-50">
            <Bookmark className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Saved Jobs</span>
          </button>

          <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-gray-50">
            <Settings className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
          </button>
        </div>
      </div>
      
      {/* Helpful Hint / Upsell Card */}
      <div className="rounded-xl bg-blue-600 p-5 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Pro Tip</p>
        <p className="mt-2 text-sm leading-relaxed">
          Complete your profile to stand out to employers!
        </p>
        <button className="mt-4 w-full rounded-lg bg-white py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">
          Edit Profile
        </button>
      </div>
    </aside>
    );
}