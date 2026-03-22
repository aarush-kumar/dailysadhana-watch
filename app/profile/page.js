'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Profile() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/progress');
                if (res.ok) {
                    setSession({ phone: 'Verified User', verified: true });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const handleLogout = () => {
        window.location.href = '/api/auth/logout';
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--surface)',
                color: 'var(--color-muted)'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingBottom: '120px' }}>

            {/* Desktop Top Nav */}
            <nav className="profile-desktop-nav">
                <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--color-gold)',
                    letterSpacing: '-0.02em'
                }}>
                    Daily Sādhanā
                </div>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <Link href="/dashboard" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'rgba(30, 27, 19, 0.6)',
                        transition: 'all 0.3s ease'
                    }}>Practice</Link>
                    <Link href="/profile" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'rgba(30, 27, 19, 0.6)',
                        transition: 'all 0.3s ease'
                    }}>Profile</Link>
                </div>
                <Link href="/profile" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    border: '2px solid rgba(254, 214, 91, 0.3)'
                }}>
                    👤
                </Link>
            </nav>

            {/* Main Content */}
            <main className="profile-main">
                <div className="profile-card fade-in">

                    {/* Decorative Top Banner */}
                    <div style={{
                        height: '128px',
                        backgroundColor: '#f2e0cb',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-48px',
                            width: '96px',
                            height: '96px',
                            borderRadius: '50%',
                            border: '6px solid white',
                            backgroundColor: 'var(--surface-container-high)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            boxShadow: '0 4px 16px rgba(30, 27, 19, 0.08)',
                            overflow: 'hidden'
                        }}>
                            👤
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{
                        paddingTop: '64px',
                        paddingBottom: '40px',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        {/* Name */}
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: 'var(--color-dark)',
                            marginBottom: '8px'
                        }}>
                            Journal Seeker
                        </h1>

                        {/* Phone + Verified Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: 'var(--color-muted)',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontFamily: 'var(--font-body)' }}>Phone OTP Login</span>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 12px',
                                backgroundColor: 'rgba(34, 197, 94, 0.05)',
                                color: '#15803d',
                                fontSize: '11px',
                                fontWeight: '700',
                                borderRadius: '9999px',
                                border: '1px solid rgba(34, 197, 94, 0.15)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                Verified
                            </span>
                        </div>

                        {/* Quick Actions */}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {/* Visit Shop */}
                            <a
                                href="https://thedailysadhana.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '20px 24px',
                                    backgroundColor: 'var(--surface-container-low)',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(30, 27, 19, 0.04)',
                                        fontSize: '20px'
                                    }}>
                                        🛍️
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={{
                                            display: 'block',
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'var(--color-dark)'
                                        }}>Visit Shop</span>
                                        <span style={{
                                            display: 'block',
                                            fontFamily: 'var(--font-label)',
                                            fontSize: '10px',
                                            color: 'var(--color-muted)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        }}>Sacred tools for your practice</span>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--color-muted)', fontSize: '18px' }}>›</span>
                            </a>
                        </div>

                        {/* Account Settings */}
                        <div style={{ width: '100%', marginBottom: '32px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 8px',
                                marginBottom: '12px'
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-label)',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: 'var(--color-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>Account Settings</h3>
                            </div>
                            <div style={{
                                backgroundColor: 'var(--surface-container-low)',
                                borderRadius: '16px',
                                overflow: 'hidden'
                            }}>
                                <Link href="/dashboard" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    textDecoration: 'none',
                                    color: 'var(--color-dark)',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>📊</span>
                                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: '500' }}>Sādhanā History</span>
                                    </span>
                                    <span style={{ color: 'var(--color-muted)', fontSize: '16px' }}>›</span>
                                </Link>
                            </div>
                        </div>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                height: '50px',
                                borderRadius: '9999px',
                                backgroundColor: 'var(--color-maroon)',
                                color: 'white',
                                fontFamily: 'var(--font-label)',
                                fontWeight: '700',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(93, 31, 31, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🚪 Sign Out
                        </button>

                        <p style={{
                            marginTop: '32px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            color: 'rgba(30, 27, 19, 0.3)'
                        }}>
                            Daily Sādhanā • Built for Devotion
                        </p>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="profile-bottom-nav">
                <Link href="/dashboard" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>🏠</Link>
                <Link href="/dashboard" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>📊</Link>
                <Link href="/profile" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--color-maroon)', color: 'white',
                    borderRadius: '50%', width: '56px', height: '56px',
                    boxShadow: '0 4px 16px rgba(93, 31, 31, 0.25)',
                    textDecoration: 'none', fontSize: '22px'
                }}>👤</Link>
            </nav>

            <style jsx>{`
                .profile-desktop-nav {
                    display: none;
                }
                .profile-main {
                    padding: 24px 16px 0;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: calc(100vh - 120px);
                }
                .profile-card {
                    width: 100%;
                    max-width: 500px;
                    background-color: var(--surface-container-lowest);
                    border-radius: var(--radius-card);
                    box-shadow: 0 12px 48px rgba(30, 27, 19, 0.06);
                    overflow: hidden;
                    transition: box-shadow 0.5s ease;
                }
                .profile-bottom-nav {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 400px;
                    background-color: rgba(255, 248, 239, 0.9);
                    backdrop-filter: blur(24px);
                    border-radius: 9999px;
                    box-shadow: 0 12px 48px rgba(30, 27, 19, 0.12);
                    height: 72px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 8px;
                    z-index: 100;
                }

                @media (min-width: 768px) {
                    .profile-desktop-nav {
                        display: flex !important;
                        justify-content: space-between;
                        align-items: center;
                        max-width: 1440px;
                        margin: 0 auto;
                        padding: 24px 48px;
                        background-color: rgba(255, 248, 239, 0.8);
                        backdrop-filter: blur(20px);
                        position: sticky;
                        top: 0;
                        z-index: 50;
                        box-shadow: 0 8px 32px rgba(30, 27, 19, 0.06);
                    }
                    .profile-main {
                        padding: 48px 24px 0;
                        align-items: center;
                    }
                    .profile-card:hover {
                        box-shadow: 0 20px 64px rgba(30, 27, 19, 0.1);
                    }
                    .profile-bottom-nav {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
