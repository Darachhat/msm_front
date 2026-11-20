import { CircleHelp, Eye, EyeOff, Info, Lock, MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '@/app/LangContext';
import { LANGS } from '@/components/brand/Flags';
import Logo, { Wordmark } from '@/components/brand/Logo';
import { ORG } from '@/config/org';
import { errMsg } from '@/lib/api';
import { safeRedirect } from '@shared/safeRedirect';
import { useAuth } from './AuthContext';

function OutlinedField({ label, icon: Icon, children, trailing }) {
  return (
    <label className="relative block">
      <span className="absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium text-slate-500">
        {label}
        <span className="text-rose-500">*</span>
      </span>
      <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50/50 transition focus-within:border-[#102D71] focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
        <Icon className="ml-3.5 h-4.5 w-4.5 shrink-0 text-slate-500" strokeWidth={2} />
        {children}
        {trailing}
      </div>
    </label>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { tr, lang, setLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate(safeRedirect(location.state?.from), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const nextLang = LANGS.find((l) => l.code !== lang) || LANGS[0];
  const CurrentFlag = (LANGS.find((l) => l.code === lang) || LANGS[0]).Flag;
  const toggle = (p) => setPanel((cur) => (cur === p ? '' : p));

  const panels = {
    forgot: tr(
      'សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ ដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី។',
      'Please ask the system administrator to reset your password.',
    ),
    help: tr(
      'ប្រើឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់ដែលអ្នកគ្រប់គ្រងបានផ្ដល់ឱ្យ។ បើបញ្ចូលពាក្យសម្ងាត់ខុសច្រើនដង គណនីនឹងត្រូវចាក់សោមួយរយៈ។',
      'Sign in with the username and password given by your administrator. Too many wrong passwords will temporarily lock sign-in.',
    ),
    contact: (
      <>
        <div className="font-medium text-slate-700">{ORG.hospital}</div>
        <div>{ORG.department}</div>
        {ORG.phone && <div className="mt-1">☎ {ORG.phone}</div>}
      </>
    ),
    about: tr(
      'MedStock — ប្រព័ន្ធគ្រប់គ្រងស្តុក ការប្រើប្រាស់ និងរបាយការណ៍ឱសថ។',
      'MedStock — medicine stock, dispensing and reporting system.',
    ),
  };

  return (
    <div className="relative flex min-h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#e9eff6] via-[#f4f7fb] to-[#dce6f4] px-4 py-5 sm:px-8">
      {/* Top bar: brand + info icons (mirrors cdcService auth shell) */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-slate-200/80" />
          <div>
            <Wordmark className="text-xl" />
            <div className="hidden text-xs text-slate-500 sm:block">{ORG.hospital}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => toggle('help')} className="btn-icon" title={tr('ត្រូវការជំនួយ?', 'Help')}>
            <CircleHelp className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => toggle('about')} className="btn-icon" title={tr('អំពីកម្មវិធី', 'About')}>
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Centered Split-Card (mirrors cdcService's 2-column rounded-3xl auth card) */}
      <div className="mx-auto my-6 flex w-full max-w-[900px] overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-2.5 shadow-[0_14px_40px_rgba(16,45,113,0.12)] backdrop-blur-xl sm:p-3.5">
        {/* Left Navy Brand Banner */}
        <div className="relative hidden w-[46%] shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#102D71] via-[#173B8F] to-[#0C2154] p-7 text-white md:flex">
          <svg className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 text-white/6" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">
            <circle cx="100" cy="100" r="95" />
          </svg>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-blue-100 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-[#DDAD01]" />
              {ORG.ministry}
            </div>
            <h1 className="mt-5 text-2xl leading-snug font-bold tracking-tight text-white">{ORG.hospital}</h1>
            <p className="mt-1.5 text-sm text-blue-100/85">{ORG.department}</p>
          </div>

          <div className="relative z-10 space-y-2.5 text-xs text-blue-100/90">
            <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-xs ring-1 ring-white/10">
              <div className="font-semibold text-white">{tr('ប្រព័ន្ធគ្រប់គ្រងស្តុក និងរបាយការណ៍ឱសថ', 'Medicine Stock & Reporting System')}</div>
              <p className="mt-1 leading-relaxed text-blue-100/80">
                {tr(
                  'តាមដានស្តុកតាមឡូត៍ ការប្រើប្រាស់ឱសថប្រចាំថ្ងៃ ឱសថញៀន និងរបាយការណ៍ស្វ័យប្រវត្តិ។',
                  'Track FEFO batches, daily patient dispensing, narcotic registers, and automated reports.',
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="relative flex flex-1 flex-col justify-center px-5 py-6 sm:px-9 sm:py-8">
          <button
            type="button"
            onClick={() => setLang(nextLang.code)}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            title={nextLang.label}
            aria-label={tr('ប្ដូរភាសា', 'Change language')}
          >
            <CurrentFlag className="h-4 w-5.5 rounded-[2px] ring-1 ring-slate-200" />
            <span>{lang === 'km' ? 'EN' : 'ខ្មែរ'}</span>
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {tr('ចូលប្រព័ន្ធ', 'Sign in')} <span className="text-[#102D71]">MedStock</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {tr('សូមបញ្ចូលឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់របស់អ្នក', 'Enter your credentials to access the system')}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <Info className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <OutlinedField label={tr('ឈ្មោះអ្នកប្រើ', 'Username')} icon={User}>
              <input
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none"
                autoFocus
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </OutlinedField>

            <OutlinedField
              label={tr('ពាក្យសម្ងាត់', 'Password')}
              icon={Lock}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="mr-2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? tr('លាក់ពាក្យសម្ងាត់', 'Hide password') : tr('បង្ហាញពាក្យសម្ងាត់', 'Show password')}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              }
            >
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </OutlinedField>

            <div className="flex items-center justify-end">
              <button type="button" onClick={() => toggle('forgot')} className="text-xs font-medium text-slate-600 underline underline-offset-4 hover:text-[#102D71]">
                {tr('ភ្លេចពាក្យសម្ងាត់?', 'Forgot password?')}
              </button>
            </div>

            <button
              className="w-full rounded-xl bg-[#102D71] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
            >
              {busy ? tr('កំពុងចូល...', 'Signing in...') : tr('ចូលប្រព័ន្ធ', 'Sign in')}
            </button>
          </form>

          {panel && <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">{panels[panel]}</div>}

          <div className="mt-6 flex items-center justify-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            {[
              ['help', CircleHelp, tr('ជំនួយ', 'Help')],
              ['contact', Phone, tr('ទំនាក់ទំនង', 'Contact')],
              ['about', Info, tr('អំពីកម្មវិធី', 'About')],
            ].map(([key, Icon, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`inline-flex items-center gap-1.5 transition hover:text-[#102D71] ${panel === key ? 'font-semibold text-[#102D71]' : ''}`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer location (mirrors cdcService auth footer) */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-1.5 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5 text-[#102D71]" />
        <span>
          {ORG.hospital} · {ORG.city}
        </span>
      </div>
    </div>
  );
}
