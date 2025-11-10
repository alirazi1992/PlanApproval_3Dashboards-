import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole, getHomePathForRole } from '../features/auth/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';

const roleOptions: Array<{
  id: UserRole;
  title: string;
  subtitle: string;
  gradient: string;
  highlights: string[];
}> = [{
  id: 'admin',
  title: 'کنترل مدیریتی',
  subtitle: 'سبد پروژه، شاخص‌ها و ممیزی‌ها',
  gradient: 'from-gray-900 via-gray-800 to-gray-700',
  highlights: ['پایش KPI لحظه‌ای', 'گزارش‌های امنیتی آنی']
}, {
  id: 'technician',
  title: 'ایستگاه فنی',
  subtitle: 'پرونده‌ها، برد سفر و برنامه‌ریزی',
  gradient: 'from-blue-900 via-blue-700 to-sky-500',
  highlights: ['گردش کار مرحله‌به‌مرحله', 'تخصیص وظایف بر اساس تقویم']
}, {
  id: 'client',
  title: 'داشبورد مشتری',
  subtitle: 'آپلود، تایید و تحویل فایل',
  gradient: 'from-purple-900 via-purple-700 to-pink-500',
  highlights: ['آپلود ایمن مدارک', 'لینک دانلود پس از پرداخت']
}];

export function Login() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);

  const selectedRole = roleOptions.find(option => option.id === role);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(getHomePathForRole(role));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-[1fr,1fr]">
        <Card variant="glass" className="p-10 shadow-xl text-right">
          <div className="mb-8">
            <p className="text-xs tracking-[0.4em] text-gray-500">دسترسی یکپارچه</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">ورود و انتخاب محیط کاری</h1>
            <p className="text-gray-600 mt-2">
              با یک حساب می‌توانید مستقیماً به داشبورد مخصوص نقش خود متصل شوید.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="ایمیل سازمانی" type="email" placeholder="you@company.com" value={email} onChange={event => setEmail(event.target.value)} required />
            <Input label="رمز عبور" type="password" placeholder="••••••••" value={password} onChange={event => setPassword(event.target.value)} required />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">نقش موردنظر برای ورود</span>
                <span className="text-xs text-gray-500">امکان تغییر بعد از ورود</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {roleOptions.map(option => {
            const isActive = option.id === role;
            return <button key={option.id} type="button" onClick={() => setRole(option.id)} className={`rounded-2xl border px-4 py-3 text-right transition-all ${isActive ? 'border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-300/50' : 'border-gray-200 bg-white/80 text-gray-700 hover:border-gray-300'}`}>
                      <p className="text-sm font-semibold">{option.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{option.subtitle}</p>
                      {isActive && <span className="mt-3 inline-flex items-center text-xs font-medium text-emerald-200 gap-1">
                          انتخاب شد
                          <Icon name="check" size={14} className="text-emerald-200" />
                        </span>}
                    </button>;
          })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                ورود به {selectedRole?.title}
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'در حال ورود به داشبورد...' : 'ورود به فضای کاری'}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {roleOptions.map(option => {
        const isActive = option.id === role;
        return <button key={option.id} type="button" onClick={() => setRole(option.id)} className={`relative block overflow-hidden rounded-[32px] border p-6 text-right transition-all ${isActive ? 'border-gray-900 ring-4 ring-gray-900/10' : 'border-white/40 hover:border-white/60'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-90`} />
              <div className="relative text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm tracking-[0.4em] text-white/70">درگاه</p>
                    <h3 className="text-2xl font-semibold">{option.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs">
                    {isActive ? 'انتخاب شد' : 'نمایش'}
                    <Icon name="arrowUpRight" size={14} />
                  </span>
                </div>
                <p className="text-sm text-white/80">{option.subtitle}</p>
                <ul className="space-y-1 text-sm text-white/80">
                  {option.highlights.map(highlight => <li key={highlight} className="flex items-center gap-2 flex-row-reverse">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                      {highlight}
                    </li>)}
                </ul>
              </div>
            </button>;
      })}
        </div>
      </div>
    </div>;
}
