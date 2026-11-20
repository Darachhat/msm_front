import {
  Check,
  ChevronDown,
  ClipboardList,
  Crown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pill,
  Settings,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useConfirm } from '@/app/ConfirmContext';
import { useLang } from '@/app/LangContext';
import { LANGS } from '@/components/brand/Flags';
import Logo from '@/components/brand/Logo';
import { Loading } from '@/components/ui';
import { ORG } from '@/config/org';
import { useAuth } from '@/features/auth/AuthContext';

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = [...parts[0]][0] || '';
  const last = parts.length > 1 ? [...parts[parts.length - 1]][0] || '' : '';
  return (first + last).toUpperCase();
}

function LanguageMenu() {
  const { lang, setLang, tr } = useLang();
  const { open, setOpen, ref } = useDropdown();
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
        aria-label={tr('ប្ដូរភាសា', 'Change language')}
        aria-expanded={open}
      >
        <current.Flag className="h-5 w-7 rounded-[3px] shadow-xs ring-1 ring-slate-200" />
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {LANGS.map(({ code, label, Flag }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-slate-50 ${lang === code ? 'font-semibold text-[#102D71]' : 'text-slate-700'}`}
            >
              <Flag className="h-4.5 w-6.5 rounded-[2px] ring-1 ring-slate-200" />
              <span className="flex-1">{label}</span>
              {lang === code && <Check className="h-4 w-4 text-[#102D71]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const { tr } = useLang();
  const confirm = useConfirm();
  const { open, setOpen, ref } = useDropdown();

  const handleLogout = async () => {
    setOpen(false);
    const ok = await confirm({
      title: tr('ចាកចេញពីប្រព័ន្ធ', 'Sign out'),
      message: tr('តើអ្នកពិតជាចង់ចាកចេញពីគណនីរបស់អ្នកមែនទេ?', 'Are you sure you want to sign out of your account?'),
      confirmLabel: tr('ចាកចេញ', 'Sign out'),
      tone: 'warning',
    });
    if (ok) logout();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-0.5 ring-2 ring-[#102D71]/70 transition hover:ring-[#1E40AF] focus:outline-none focus-visible:ring-4"
        aria-label={tr('គណនី', 'Account')}
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102D71] text-xs font-semibold text-white">
          {initials(user?.fullName || user?.username)}
        </span>
        {user?.role?.isSystem && (
          <span className="absolute -right-1 -bottom-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white shadow-xs">
            <Crown className="h-3 w-3 text-[#DDAD01]" fill="#DDAD01" />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#102D71] text-sm font-semibold text-white">
              {initials(user?.fullName || user?.username)}
            </span>
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-900">{user?.fullName}</div>
              <div className="truncate text-xs text-slate-500">
                @{user?.username} · {user?.role?.name}
              </div>
            </div>
          </div>
          <div className="py-1">
            <Link
              to="/settings/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <UserCog className="h-4 w-4 text-slate-500" /> {tr('គណនីរបស់ខ្ញុំ', 'My account')}
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-500" /> {tr('ការកំណត់', 'Settings')}
            </Link>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> {tr('ចាកចេញ', 'Sign out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, can } = useAuth();
  const { tr } = useLang();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: '/', icon: LayoutDashboard, label: tr('ផ្ទាំងគ្រប់គ្រង', 'Dashboard'), show: can('dashboard') },
    { to: '/patients', icon: Users, label: tr('អ្នកជំងឺ', 'Patients'), show: can('patients') },
    { to: '/usage', icon: ClipboardList, label: tr('ប្រើប្រាស់ឱសថ', 'Usage'), show: can('usage') },
    { to: '/stock', icon: Package, label: tr('ស្តុកឱសថ', 'Stock'), show: can('stock') },
    { to: '/medicines', icon: Pill, label: tr('បញ្ជីឱសថ', 'Medicines'), show: can('medicines') },
    { to: '/reports', icon: FileText, label: tr('របាយការណ៍', 'Reports'), show: can('reports') },
    { to: '/settings', icon: Settings, label: tr('ការកំណត់', 'Settings'), show: true },
  ].filter((n) => n.show);

  // Compact icon-on-top left rail (mirrors cdcService's 125px #102D71 compact sidebar)
  const compactSidebar = (
    <aside className="flex h-full w-[116px] shrink-0 flex-col bg-[#102D71] text-blue-100 shadow-lg">
      <div className="flex flex-col items-center justify-center px-2 py-4">
        <Logo className="h-12 w-12 rounded-2xl shadow-md shadow-black/25 ring-2 ring-white/15" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-[12.5px] leading-tight font-medium transition ${
                isActive
                  ? 'bg-white/16 text-white shadow-xs before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-[#DDAD01]'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5.5 w-5.5 shrink-0" />
            <span className="line-clamp-2">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 py-2.5 text-center text-[11px] text-white/50">v1.0.0</div>
    </aside>
  );

  // Full mobile slide-over drawer
  const mobileDrawer = (
    <aside className="flex h-full w-68 flex-col bg-[#102D71] text-blue-100 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 rounded-xl shadow-md" />
          <span className="text-lg font-bold tracking-tight text-white">MedStock</span>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/80 hover:bg-white/10" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/16 text-white before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-[#DDAD01]'
                  : 'text-blue-100/85 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-3 text-xs text-white/50">v1.0.0</div>
    </aside>
  );

  return (
    <div className="flex h-full">
      <div className="no-print hidden lg:block">{compactSidebar}</div>
      {open && (
        <div className="no-print fixed inset-0 z-40 flex lg:hidden">
          <div className="relative">{mobileDrawer}</div>
          <button type="button" className="flex-1 bg-slate-900/50 backdrop-blur-[1px]" onClick={() => setOpen(false)} aria-label="Close menu" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Clean 56px top bar (mirrors cdcService compact header) */}
        <header className="no-print sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 lg:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" className="btn-icon lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-semibold tracking-tight text-[#102D71]">MedStock</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span className="hidden truncate text-sm text-slate-600 sm:inline">{ORG.hospital}</span>
            {user?.role?.name && (
              <span className="hidden rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-[#102D71] md:inline">
                {user.role.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageMenu />
            <UserMenu />
          </div>
        </header>

        <main className="print-area flex-1 overflow-y-auto p-3 lg:p-4">
          <div className="mx-auto min-h-full rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)] lg:p-5">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
