'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { auth } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function LoginContent() {
    // null = detecting, 'phone' = India flow, 'email' = US flow
    const [loginMode, setLoginMode] = useState(null);

    // ── Phone login state (unchanged) ──────────────────────────────────────
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('phone');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [resendTimer, setResendTimer] = useState(0);

    // ── Email login state ──────────────────────────────────────────────────
    const [emailAddress, setEmailAddress] = useState('');
    const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
    const [emailStep, setEmailStep] = useState('email'); // 'email' | 'otp'
    const [emailResendTimer, setEmailResendTimer] = useState(0);

    // ── Shared ─────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const otpRefs = useRef([]);
    const emailOtpRefs = useRef([]);

    // Detect login mode: ?country=US override for local testing, else geo API
    useEffect(() => {
        const countryOverride = searchParams.get('country');
        if (countryOverride) {
            setLoginMode(countryOverride.toUpperCase() === 'IN' ? 'phone' : 'email');
            return;
        }
        fetch('/api/auth/geo')
            .then(r => r.json())
            .then(({ country }) => setLoginMode(country === 'IN' ? 'phone' : 'email'))
            .catch(() => setLoginMode('phone'));
    }, []);

    // Phone recaptcha (only init when in phone mode)
    useEffect(() => {
        if (loginMode !== 'phone') return;
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {},
            });
        }
    }, [loginMode]);

    // Phone resend countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setInterval(() => setResendTimer(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [resendTimer]);

    // Email resend countdown
    useEffect(() => {
        if (emailResendTimer <= 0) return;
        const id = setInterval(() => setEmailResendTimer(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [emailResendTimer]);

    // ── Phone handlers (unchanged) ─────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let formattedPhone = phoneNumber.trim();
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(result);
            setStep('otp');
            setResendTimer(59);
        } catch (err) {
            console.error(err);
            setError('Failed to send OTP. Please check the phone number.');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then(widgetId => {
                    window.recaptchaVerifier.reset(widgetId);
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
            setOtp(newOtp);
            otpRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits.');
            setLoading(false);
            return;
        }

        let idToken;
        try {
            const result = await confirmationResult.confirm(otpString);
            idToken = await result.user.getIdToken();
        } catch (err) {
            console.error('OTP verification error:', err);
            setLoading(false);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please check and try again.');
            } else if (err.code === 'auth/code-expired') {
                setError('OTP has expired. Please request a new one.');
            } else {
                setError('Verification failed. Please try again.');
            }
            return;
        }

        try {
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                let errorMsg = 'Failed to create session. Please try again.';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errData.detail || errorMsg;
                } catch (_) {}
                setError(errorMsg);
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error('Session API fetch error:', err);
            setError('Network error. Please try again.');
            setLoading(false);
            return;
        }

        const redirect = searchParams.get('redirect') || '/dashboard';
        window.location.href = redirect;
    };

    // ── Email handlers ─────────────────────────────────────────────────────
    const handleSendEmailOtp = async (e) => {
        e?.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to send OTP.');
                return;
            }
            setEmailStep('otp');
            setEmailResendTimer(59);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;
        const next = [...emailOtp];
        next[index] = value;
        setEmailOtp(next);
        if (value && index < 5) emailOtpRefs.current[index + 1]?.focus();
    };

    const handleEmailOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
            emailOtpRefs.current[index - 1]?.focus();
        }
    };

    const handleEmailOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const next = [...emailOtp];
            for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
            setEmailOtp(next);
            emailOtpRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    const handleVerifyEmailOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const otpString = emailOtp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/verify-email-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailAddress, otp: otpString }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Verification failed.');
                setLoading(false);
                return;
            }
            const redirect = searchParams.get('redirect') || '/dashboard';
            window.location.href = redirect;
        } catch (err) {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    // ── Shared UI helpers ──────────────────────────────────────────────────
    const bgStyle = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
    };

    const cardStyle = {
        backgroundColor: 'var(--surface-container-lowest)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 12px 48px rgba(30, 27, 19, 0.08)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid rgba(217, 193, 191, 0.1)',
    };

    const otpBoxStyle = {
        flex: 1,
        minWidth: 0,
        height: '56px',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        backgroundColor: 'var(--surface-container-low)',
        border: 'none',
        borderRadius: '12px',
        color: 'var(--color-dark)',
        outline: 'none',
        transition: 'box-shadow 0.2s ease',
    };

    const primaryBtnStyle = (active) => ({
        width: '100%',
        height: '50px',
        backgroundColor: 'var(--color-maroon)',
        color: 'white',
        fontFamily: 'var(--font-label)',
        fontWeight: '700',
        fontSize: '14px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: active ? 'wait' : 'pointer',
        opacity: active ? 0.7 : 1,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    });

    const secondaryBtnStyle = (active) => ({
        width: '100%',
        height: '50px',
        backgroundColor: 'var(--color-gold-light)',
        color: 'var(--color-gold)',
        fontFamily: 'var(--font-label)',
        fontWeight: '700',
        fontSize: '14px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: active ? 'wait' : 'pointer',
        opacity: active ? 0.7 : 1,
        transition: 'all 0.3s ease',
    });

    const errorStyle = {
        color: '#ba1a1a',
        fontSize: '13px',
        marginBottom: '16px',
        textAlign: 'center',
        backgroundColor: 'rgba(186, 26, 26, 0.05)',
        padding: '10px 16px',
        borderRadius: '8px',
    };

    // Loading state while detecting country
    if (loginMode === null) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--color-muted)' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={bgStyle}>
            {/* Background glows */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-25%', right: '-25%', width: '600px', height: '600px', background: 'rgba(115, 92, 0, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }} />
                <div style={{ position: 'absolute', bottom: '-25%', left: '-25%', width: '600px', height: '600px', background: 'rgba(93, 31, 31, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }} />
            </div>

            {/* Logo */}
            <header style={{ marginBottom: '40px', textAlign: 'center', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Image src="/logo-white.png" alt="Daily Sādhanā" width={180} height={60} style={{ maxWidth: '100%', height: 'auto' }} priority />
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginTop: '4px' }}>
                        The Modern Temple
                    </p>
                </div>
            </header>

            <main style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
                <div className="fade-in" style={cardStyle}>

                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.875rem', color: 'var(--color-maroon)', textAlign: 'center', marginBottom: '8px' }}>
                        Begin Your Journey
                    </h2>

                    {/* ── EMAIL FLOW ──────────────────────────────────────── */}
                    {loginMode === 'email' && (
                        <>
                            <p style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '40px', lineHeight: '1.6', padding: '0 16px' }}>
                                {emailStep === 'email'
                                    ? 'Enter your email address to receive a login code.'
                                    : `We've sent a 6-digit code to ${emailAddress}.`}
                            </p>

                            {emailStep === 'email' ? (
                                <form onSubmit={handleSendEmailOtp} style={{ width: '100%' }}>
                                    <div style={{ marginBottom: '32px' }}>
                                        <label style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={emailAddress}
                                            onChange={e => setEmailAddress(e.target.value)}
                                            style={{ width: '100%', padding: '16px', backgroundColor: 'var(--surface-container-low)', border: 'none', borderRadius: '12px', fontSize: '15px', color: 'var(--color-dark)', outline: 'none', transition: 'box-shadow 0.2s ease', boxSizing: 'border-box' }}
                                            onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(115, 92, 0, 0.15)'}
                                            onBlur={e => e.target.style.boxShadow = 'none'}
                                            required
                                        />
                                    </div>
                                    {error && <p style={errorStyle}>{error}</p>}
                                    <button type="submit" disabled={loading} style={primaryBtnStyle(loading)}>
                                        {loading ? 'Sending...' : 'Send OTP'}
                                        {!loading && <span style={{ fontSize: '18px' }}>→</span>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyEmailOtp} style={{ width: '100%' }}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'block', marginBottom: '16px', textAlign: 'center' }}>
                                            Verification Code
                                        </label>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                            {emailOtp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={el => emailOtpRefs.current[i] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleEmailOtpChange(i, e.target.value)}
                                                    onKeyDown={e => handleEmailOtpKeyDown(i, e)}
                                                    onPaste={i === 0 ? handleEmailOtpPaste : undefined}
                                                    style={otpBoxStyle}
                                                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(115, 92, 0, 0.2)'}
                                                    onBlur={e => e.target.style.boxShadow = 'none'}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        {emailResendTimer > 0 ? (
                                            <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Resend Code in {String(Math.floor(emailResendTimer / 60)).padStart(2, '0')}:{String(emailResendTimer % 60).padStart(2, '0')}
                                            </span>
                                        ) : (
                                            <button type="button" onClick={() => { setEmailOtp(['', '', '', '', '', '']); setError(''); handleSendEmailOtp({ preventDefault: () => {} }); }} style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                Resend Code
                                            </button>
                                        )}
                                    </div>

                                    {error && <p style={errorStyle}>{error}</p>}

                                    <button type="submit" disabled={loading} style={secondaryBtnStyle(loading)}>
                                        {loading ? 'Verifying...' : 'Verify & Enter'}
                                    </button>

                                    <button type="button" onClick={() => { setEmailStep('email'); setEmailOtp(['', '', '', '', '', '']); setError(''); }} style={{ display: 'block', margin: '16px auto 0', fontSize: '13px', color: 'var(--color-muted-light)', cursor: 'pointer', background: 'none', border: 'none' }}>
                                        Change Email Address
                                    </button>
                                </form>
                            )}
                        </>
                    )}

                    {/* ── PHONE FLOW (unchanged) ──────────────────────────── */}
                    {loginMode === 'phone' && (
                        <>
                            <p style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '40px', lineHeight: '1.6', padding: '0 16px' }}>
                                {step === 'phone'
                                    ? 'Enter your mobile number to enter the sanctuary of presence.'
                                    : `We've sent a 6-digit code to your phone.`}
                            </p>

                            {step === 'phone' ? (
                                <form onSubmit={handleSendOtp} style={{ width: '100%' }}>
                                    <div style={{ marginBottom: '32px' }}>
                                        <label style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>
                                            Mobile Number
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(30, 27, 19, 0.6)', fontWeight: '500', fontSize: '15px', pointerEvents: 'none' }}>+91</span>
                                            <input
                                                type="tel"
                                                placeholder="Enter 10 digits"
                                                value={phoneNumber}
                                                onChange={e => setPhoneNumber(e.target.value)}
                                                maxLength={10}
                                                style={{ width: '100%', padding: '16px 16px 16px 56px', backgroundColor: 'var(--surface-container-low)', border: 'none', borderRadius: '12px', fontSize: '15px', color: 'var(--color-dark)', outline: 'none', transition: 'box-shadow 0.2s ease' }}
                                                onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(115, 92, 0, 0.15)'}
                                                onBlur={e => e.target.style.boxShadow = 'none'}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && <p style={errorStyle}>{error}</p>}
                                    <button type="submit" disabled={loading} style={primaryBtnStyle(loading)}>
                                        {loading ? 'Sending...' : 'Send OTP'}
                                        {!loading && <span style={{ fontSize: '18px' }}>→</span>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} style={{ width: '100%' }}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ fontFamily: 'var(--font-label)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', display: 'block', marginBottom: '16px', textAlign: 'center' }}>
                                            Verification Code
                                        </label>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={el => otpRefs.current[i] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                                    onPaste={i === 0 ? handleOtpPaste : undefined}
                                                    style={otpBoxStyle}
                                                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px rgba(115, 92, 0, 0.2)'}
                                                    onBlur={e => e.target.style.boxShadow = 'none'}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        {resendTimer > 0 ? (
                                            <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Resend Code in {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')}
                                            </span>
                                        ) : (
                                            <button type="button" onClick={() => { setOtp(['', '', '', '', '', '']); setError(''); handleSendOtp({ preventDefault: () => {} }); }} style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                Resend Code
                                            </button>
                                        )}
                                    </div>

                                    {error && <p style={errorStyle}>{error}</p>}

                                    <button type="submit" disabled={loading} style={secondaryBtnStyle(loading)}>
                                        {loading ? 'Verifying...' : 'Verify & Enter'}
                                    </button>

                                    <button type="button" onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }} style={{ display: 'block', margin: '16px auto 0', fontSize: '13px', color: 'var(--color-muted-light)', cursor: 'pointer', background: 'none', border: 'none' }}>
                                        Change Phone Number
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>

                <footer style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(84, 67, 66, 0.6)', fontSize: '12px', lineHeight: '1.6' }}>
                        By continuing, you agree to our<br />
                        <a href="#" style={{ textDecoration: 'underline' }}>Terms of Service</a> & <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
                    </p>
                </footer>
            </main>

            <div id="recaptcha-container"></div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)' }}>
                <div style={{ color: 'var(--color-muted)' }}>Loading...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
