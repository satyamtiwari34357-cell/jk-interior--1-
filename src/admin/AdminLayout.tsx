import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AdminTab } from './types.ts';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  adminUser: { email: string; name: string; role: string };
  onLogout: () => void;
  onViewPublicSite: () => void;
  newLeadsCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  adminUser,
  onLogout,
  onViewPublicSite,
  newLeadsCount = 0,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems: Array<{ id: AdminTab; label: string; icon: any; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'leads', label: 'Enquiries & Leads', icon: Users, badge: newLeadsCount },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Site Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-porcelain flex flex-col lg:flex-row font-sans selection:bg-gold-500 selection:text-black">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-ink border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-white font-semibold">JK Interior</span>
          <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-gold-500">CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo in Sidebar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-serif text-ivory-soft font-semibold tracking-wider">
                JK INTERIOR
              </h1>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold-500 block font-sans mt-0.5">
                Studio CMS · Mumbai
              </span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'projects' && (currentTab === 'project-new' || currentTab === 'project-edit'));
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500 text-dark-900 font-semibold shadow-md'
                      : 'text-stone-500 hover:text-ivory-soft hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-black text-gold-500' : 'bg-gold-500 text-black'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-[10px] text-stone-700 uppercase block">Authenticated As</span>
            <span className="text-xs text-ivory-soft font-medium block truncate mt-0.5">{adminUser.name}</span>
            <span className="text-[10px] text-gold-500 block font-mono">{adminUser.email}</span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <button
              onClick={onViewPublicSite}
              className="w-full py-2 px-3 text-stone-500 hover:text-white hover:bg-white/5 rounded flex items-center justify-between transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded flex items-center justify-between transition-colors"
            >
              <span>Sign Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Topbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-obsidian">
          <div className="flex items-center gap-2 text-xs text-stone-700">
            <span>CMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ivory-soft uppercase tracking-wider font-medium">
              {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onViewPublicSite}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-ivory rounded flex items-center gap-2 transition-colors"
            >
              <span>Preview Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Content Area */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
