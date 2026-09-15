import React, { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { JHODSY_ASSETS } from '../data/assets';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

const inputVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
};

function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputGroupCls = "relative";
  const inputIconCls = "w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8994A3]";
  const inputBaseCls = "w-full bg-[#071426] border border-white/10 rounded-xl px-4 pl-11 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30 transition-colors";
  const labelBaseCls = "text-[11px] font-bold text-[#AEB6C2] uppercase tracking-wider block mb-1.5 ml-1";
  const btnBaseCls = "w-full bg-white text-[#071426] font-bold py-3.5 rounded-full text-sm hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]";
  const errCls = "bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 text-center";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) setStep('otp');
      else setError(data.error || 'Failed to send OTP');
    } catch (err) { setError('Network error'); } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter complete OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-reset-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      if (res.ok) setStep('password');
      else setError(data.error || 'Invalid OTP');
    } catch (err) { setError('Network error'); } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, newPassword, otp: otp.join('') })
      });
      const data = await res.json();
      if (res.ok) { setSuccess('Password reset successfully!'); setTimeout(() => onBack(), 2000); }
      else { setError(data.error || 'Failed to reset password'); }
    } catch (err) { setError('Network error'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 mb-6">
        <h2 className="text-2xl font-serif font-bold text-white">Reset Access</h2>
        <p className="text-[#AEB6C2] text-xs">Recover your account</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                <label className={labelBaseCls}>Email Address</label>
                <div className={inputGroupCls}>
                  <Mail className={inputIconCls} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter registered email" className={inputBaseCls} />
                </div>
              </motion.div>
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={errCls}>{error}</motion.div>}
              <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible" className="pt-2">
                <button type="submit" disabled={loading} className={btnBaseCls}>
                  {loading ? 'Sending...' : 'Send Recovery Code'}
                </button>
              </motion.div>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Enter Code</h3>
                <p className="text-[#AEB6C2] text-xs mt-1">Sent to {email}</p>
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input key={idx} ref={(el) => (otpRefs.current[idx] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d?$/.test(val)) return;
                      const next = [...otp]; next[idx] = val; setOtp(next);
                      if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                    }}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus(); }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-white/10 bg-[#071426] text-white focus:outline-none focus:border-white transition-all"
                  />
                ))}
              </div>
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={errCls}>{error}</motion.div>}
              <div className="pt-2">
                <button onClick={handleVerifyOtp} disabled={loading} className={btnBaseCls}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </div>
          )}

          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                <label className={labelBaseCls}>New Password</label>
                <div className={inputGroupCls}>
                  <Lock className={inputIconCls} />
                  <input type={showPass ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} placeholder="Min 8 characters" className={`${inputBaseCls} pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8994A3] hover:text-white p-1">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
              {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={errCls}>{error}</motion.div>}
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-emerald-400 text-center flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {success}
                </motion.div>
              )}
              {!success && (
                <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible" className="pt-2">
                  <button type="submit" disabled={loading} className={btnBaseCls}>
                    Update Password
                  </button>
                </motion.div>
              )}
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <button type="button" onClick={onBack} className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#AEB6C2] hover:text-white transition-colors py-2 mt-4">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>
    </div>
  );
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const { login, googleLogin, loading, error, clearError } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    clearError();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) navigate(res.role === 'admin' ? '/admin' : returnUrl);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await googleLogin(tokenResponse.access_token);
      if (res.success) navigate(res.role === 'admin' ? '/admin' : returnUrl);
    },
    onError: () => console.error('Google Login Failed'),
  });

  const inputGroupCls = "relative";
  const inputIconCls = "w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8994A3]";
  const inputBaseCls = "w-full bg-[#071426] border border-white/10 rounded-xl px-4 pl-11 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30 transition-colors";
  const labelBaseCls = "text-[11px] font-bold text-[#AEB6C2] uppercase tracking-wider block mb-1.5 ml-1";
  const btnBaseCls = "w-full bg-white text-[#071426] font-bold py-3.5 rounded-full text-sm hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]";
  const errCls = "bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 text-center";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#071426] via-[#0B1E38] to-[#05080D] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3">
            <img src={JHODSY_ASSETS.logoSymbol} alt="JHODSY" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-[0.2em] text-white uppercase mt-0.5">JHODSY</span>
          </Link>
        </div>

        <div className="bg-[#0B192D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {!isForgotMode ? (
                <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center space-y-1 mb-6">
                      <h2 className="text-2xl font-serif font-bold text-white">Welcome back</h2>
                      <p className="text-[#AEB6C2] text-xs">Enter your credentials</p>
                    </div>

                    <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                      <label className={labelBaseCls}>Email Address</label>
                      <div className={inputGroupCls}>
                        <Mail className={inputIconCls} />
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputBaseCls} />
                      </div>
                    </motion.div>

                    <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
                      <div className="flex justify-between items-center mb-1">
                        <label className={labelBaseCls.replace('mb-1.5', 'mb-0')}>Password</label>
                        <button type="button" onClick={() => { setIsForgotMode(true); clearError(); }} className="text-[10px] font-bold text-white hover:underline uppercase tracking-wider">
                          Recovery
                        </button>
                      </div>
                      <div className={inputGroupCls}>
                        <Lock className={inputIconCls} />
                        <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required placeholder="Enter password" className={`${inputBaseCls} pr-10`} />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8994A3] hover:text-white p-1">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={errCls}>{error}</motion.div>}

                    <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible" className="pt-2">
                      <button type="submit" disabled={loading} className={btnBaseCls}>
                        {loading ? 'Authenticating...' : <>Login <ArrowRight className="w-4 h-4"/></>}
                      </button>
                    </motion.div>

                    <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
                      <div className="flex items-center gap-4 w-full py-2">
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                        <span className="text-[#8994A3] text-[9px] font-bold tracking-widest uppercase">Or</span>
                        <div className="h-[1px] bg-white/10 flex-1"></div>
                      </div>
                      
                      <button type="button" onClick={() => loginWithGoogle()} className="w-full bg-[#071426] border border-white/10 text-white font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-colors">
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                        Continue with Google
                      </button>

                      <p className="text-center text-xs text-[#AEB6C2] pt-4">
                        Don't have an account? <Link to="/signup" className="text-white font-bold hover:underline">Create Account</Link>
                      </p>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <ForgotPassword onBack={() => setIsForgotMode(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
