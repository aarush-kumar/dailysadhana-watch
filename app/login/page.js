'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { auth } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Navbar from '../../components/Navbar';

function LoginContent() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const recaptchaRef = useRef(null);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Normalize phone number if it doesn't have +91
        let formattedPhone = phoneNumber.trim();
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(result);
            setStep('otp');
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

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();

            // Call session API to set cookie
            const response = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            if (response.ok) {
                const redirect = searchParams.get('redirect') || '/dashboard';
                router.push(redirect);
            } else {
                setError('Failed to create session. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', padding: '80px 20px' }}>
            <div className="card text-center fade-in">
                <div style={{ marginBottom: '32px' }}>
                    <Image
                        src="/logo-dark.png"
                        alt="Daily Sādhanā"
                        width={180}
                        height={120}
                        style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }}
                        priority
                    />
                </div>

                <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)', margin: '0 auto 32px' }}></div>

                {step === 'phone' ? (
                    <form onSubmit={handleSendOtp}>
                        <h2 className="mb-4">Welcome Back</h2>
                        <p className="mb-4" style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                            Enter your phone number to verify your journal purchase.
                        </p>

                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '8px' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-input)',
                                    border: '1px solid rgba(17, 17, 17, 0.1)',
                                    fontSize: '16px',
                                    backgroundColor: 'var(--color-cream)'
                                }}
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <h2 className="mb-4">Enter OTP</h2>
                        <p className="mb-4" style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                            We've sent a 6-digit code to your phone.
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-input)',
                                    border: '1px solid rgba(17, 17, 17, 0.1)',
                                    fontSize: '24px',
                                    letterSpacing: '0.5em',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--color-cream)'
                                }}
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-maroon)' }}
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
}

export default function Login() {
    return (
        <div>
            <Navbar />
            <Suspense fallback={<div className="container text-center" style={{ padding: '80px 20px' }}>Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
