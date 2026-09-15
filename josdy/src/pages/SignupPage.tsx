import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { JHODSY_ASSETS } from '../data/assets';
import { PhoneInput } from '../components/PhoneInput';

function StepBar({ step }: { step: string }) {
  const steps = ['Details', 'Verify', 'Password'];
  const activeIdx = { form: 0, otp: 1, password: 2, done: 3 }[step] ?? 0;
  
  return (
    <div className="flex items-center justify-between w-full mb-10 max-w-[280px] mx-auto relative">
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />
      
      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-[1px] bg-white transition-all duration-500" 
           style={{ width: `${(Math.min(activeIdx, 2) / 2) * 100}%`, left: '16px', maxWidth: 'calc(100% - 32px)' }} />

      {steps.map((label, i) => {
        const isActive = i === activeIdx;
        const isPassed = i < activeIdx;
        
        return (
          <div key={i} className="flex flex-col items-center gap-2 relative z-10">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors duration-300 ${
                isPassed || isActive 
                  ? 'bg-white border-white text-[#071426]' 
                  : 'bg-[#0B192D] border-white/20 text-[#AEB6C2]'
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-4 h-4 text-[#071426]" /> : 
               <span>{i + 1}</span>}
            </div>
            <span className={`absolute top-10 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${
              isActive ? 'text-white' : 'text-[#8994A3]'
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const inputVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendSignupOtp, verifySignupOtp, signup, googleLogin, loading, error, clearError } = useAuthStore();
  const [step, setStep] = useState('form');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { return () => clearError(); }, [clearError]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSendOtp = async (e: any) => {
    e.preventDefault(); setLocalError('');
    if (!form.name || !form.email || !form.phone) { setLocalError('Please fill in all details.'); return; }
    const res = await sendSignupOtp(form.email);
    if (res.success) { setOtp(['', '', '', '', '', '']); setStep('otp'); }
    else setLocalError(res.error || 'Failed to send OTP');
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault(); setLocalError('');
    const code = otp.join('');
    if (code.length < 6) { setLocalError('Please enter all 6 digits.'); return; }
    const res = await verifySignupOtp(form.email, code);
    if (res.success) { setStep('password'); }
    else setLocalError(res.error || 'Invalid OTP');
  };

  const handleCreatePassword = async (e: any) => {
    e.preventDefault(); setLocalError('');
    if (form.password !== form.confirmPassword) { setLocalError('Passwords do not match'); return; }
    if (!hasMinLength || !hasUpperCase || !hasNumber) { setLocalError('Password does not meet requirements'); return; }

    const res = await signup(form.name, form.email, form.phone, form.password, '', 'customer');
    if (res.success) { setStep('done'); setTimeout(() => navigate('/'), 2000); }
    else setLocalError(res.error || 'Signup failed');
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLocalError('');
      const res = await googleLogin(tokenResponse.access_token);
      if (res.success) navigate(res.role === 'admin' ? '/admin' : '/');
      else setLocalError(res.error || 'Google Login failed');
    },
    onError: () => setLocalError('Google Signup Failed'),
  });

  const displayError = localError || error;
  
  const hasMinLength = form.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);

  const inputGroupCls = "relative";
  const inputIconCls = "w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8994A3]";
  const inputBaseCls = "w-full bg-[#071426] border border-white/10 rounded-xl px-4 pl-11 py-3 text-sm text-white placeholder-[#8994A3] focus:outline-none focus:border-white/30 transition-colors";
  const labelBaseCls = "text-[11px] font-bold text-[#AEB6C2] uppercase tracking-wider block mb-1.5 ml-1";
  const btnBaseCls = "w-full bg-white text-[#071426] font-bold py-3.5 rounded-full text-sm hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]";

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
          {step !== 'done' && <StepBar step={step} />}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              
              {step === 'form' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-white">Create Account</h2>
                    <p className="text-[#AEB6C2] text-xs mt-1">Enter your details to register</p>
                  </div>
                  
                  <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                    <label className={labelBaseCls}>Full Name</label>
                    <div className={inputGroupCls}>
                      <User className={inputIconCls} />
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className={inputBaseCls} />
                    </div>
                  </motion.div>
                  
                  <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
                    <label className={labelBaseCls}>Email Address</label>
                    <div className={inputGroupCls}>
                      <Mail className={inputIconCls} />
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputBaseCls} />
                    </div>
                  </motion.div>
                  
                  <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
                    <label className={labelBaseCls}>Phone Number</label>
                    <PhoneInput allowedCountries={[]} value={form.phone} onChange={(v: string) => setForm(f => ({ ...f, phone: v }))} placeholder="Phone number" />
                  </motion.div>
                  
                  {displayError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 text-center">{displayError}</div>}
                  
                  <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible" className="pt-2">
                    <button type="submit" disabled={loading} className={btnBaseCls}>
                      {loading ? 'Sending...' : <>Continue <ArrowRight className="w-4 h-4"/></>}
                    </button>
                  </motion.div>

                  <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
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
                      Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Sign In</Link>
                    </p>
                  </motion.div>
                </form>
              )}

              {step === 'otp' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white">Verify Email</h2>
                    <p className="text-[#AEB6C2] text-xs mt-2">
                      Enter the code sent to <br/><span className="text-white font-medium">{form.email}</span>
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input key={idx} ref={el => otpRefs.current[idx] = el}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => {
                          const val = e.target.value;
                          if (!/^\d?$/.test(val)) return;
                          const next = [...otp]; next[idx] = val; setOtp(next);
                          if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                        }}
                        onKeyDown={e => { if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus(); }}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-white/10 bg-[#071426] text-white focus:outline-none focus:border-white transition-colors"
                      />
                    ))}
                  </div>
                  
                  {displayError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 text-center">{displayError}</div>}
                  
                  <div className="space-y-3 pt-2">
                    <button type="button" onClick={handleVerifyOtp} disabled={loading} className={btnBaseCls}>
                      {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button type="button" onClick={() => setStep('form')} className="w-full text-xs font-medium text-[#AEB6C2] hover:text-white transition-colors">
                      Use a different email
                    </button>
                  </div>
                </div>
              )}

              {step === 'password' && (
                <form onSubmit={handleCreatePassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-white">Secure Account</h2>
                    <p className="text-[#AEB6C2] text-xs mt-1">Create a strong password</p>
                  </div>
                  
                  <div>
                    <label className={labelBaseCls}>Password</label>
                    <div className={inputGroupCls}>
                      <Lock className={inputIconCls} />
                      <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required minLength={8} placeholder="Your password" className={`${inputBaseCls} pr-10`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8994A3] hover:text-white p-1">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelBaseCls}>Confirm Password</label>
                    <div className={inputGroupCls}>
                      <Lock className={inputIconCls} />
                      <input name="confirmPassword" type={showConfirmPass ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} required minLength={8} placeholder="Confirm password" className={`${inputBaseCls} pr-10`} />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8994A3] hover:text-white p-1">
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#071426] border border-white/5 rounded-xl p-4 mt-2">
                    <ul className="space-y-2">
                      {[
                        { label: 'At least 8 characters', valid: hasMinLength },
                        { label: 'Uppercase letter', valid: hasUpperCase },
                        { label: 'Contains a number', valid: hasNumber },
                        { label: 'Passwords match', valid: form.password === form.confirmPassword && form.password.length > 0 }
                      ].map((req, i) => (
                        <li key={i} className={`text-[11px] flex items-center gap-2 ${req.valid ? 'text-white' : 'text-[#8994A3]'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${req.valid ? 'text-white' : 'text-[#8994A3]'}`} />
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {displayError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 text-center">{displayError}</div>}
                  
                  <div className="pt-2">
                    <button type="submit" disabled={loading || !hasMinLength || !hasUpperCase || !hasNumber || form.password !== form.confirmPassword} className={btnBaseCls}>
                      {loading ? 'Finalizing...' : 'Complete Setup'}
                    </button>
                  </div>
                </form>
              )}

              {step === 'done' && (
                <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-[#071426]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Welcome aboard</h2>
                    <p className="text-[#AEB6C2] text-sm mt-2">Account secured.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
