'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressGrid from '../../components/ProgressGrid';

export default function Dashboard() {
    const [progress, setProgress] = useState({ completedDays: [], streak: 0, totalMinutes: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProgress() {
            try {
                const res = await fetch('/api/progress');
                if (res.ok) {
                    const data = await res.json();
                    setProgress(data);
                }
            } catch (err) {
                console.error('Failed to fetch progress', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProgress();
    }, []);

    const totalDays = 90;
    const completedCount = progress.completedDays.length;
    const percentChange = Math.round((completedCount / totalDays) * 100);
    const nextDay = completedCount + 1 > 90 ? 90 : completedCount + 1;
    const totalHours = Math.floor(progress.totalMinutes / 60);
    const totalMins = progress.totalMinutes % 60;

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
                Loading your journey...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingBottom: '120px' }}>

            {/* Desktop Top Nav */}
            <nav className="desktop-nav">
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <Image
                        src="/logo-gold.png"
                        alt="Daily Sādhanā"
                        width={140}
                        height={42}
                        style={{ height: 'auto' }}
                    />
                </Link>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <Link href="/dashboard" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        borderBottom: '2px solid var(--color-gold)',
                        paddingBottom: '4px',
                        transition: 'all 0.3s ease'
                    }}>Practice</Link>
                    <Link href="/profile" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'rgba(30, 27, 19, 0.6)',
                        transition: 'all 0.3s ease'
                    }}>Profile</Link>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Link href="/profile" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-container-high)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        border: '1px solid rgba(217, 193, 191, 0.15)'
                    }}>
                        👤
                    </Link>
                </div>
            </nav>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 0' }}>

                {/* Greeting Section */}
                <section className="fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p className="mobile-only" style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: 'var(--color-gold)',
                        marginBottom: '8px'
                    }}>
                        Welcome Back
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        marginBottom: '16px'
                    }} className="greeting-title">
                        Namaste
                    </h1>
                    <p style={{
                        color: 'var(--color-muted)',
                        fontWeight: '300',
                        maxWidth: '360px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }} className="greeting-subtitle">
                        Your journey toward inner peace continues today.
                    </p>
                </section>

                {/* Stats Cards */}
                <section className="stats-grid" style={{ marginBottom: '48px' }}>
                    {/* Streak Card */}
                    <div className="stat-card">
                        <div style={{
                            backgroundColor: 'rgba(254, 214, 91, 0.3)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }} className="stat-icon">
                            <span style={{ fontSize: '22px' }}>🔥</span>
                        </div>
                        <div className="stat-text">
                            <p style={{
                                fontFamily: 'var(--font-label)',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: '700',
                                color: 'var(--color-muted)',
                                marginBottom: '4px'
                            }}>
                                Current Streak
                            </p>
                            <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '700',
                                color: 'var(--color-dark)'
                            }} className="stat-value">
                                {progress.streak} Days
                            </span>
                        </div>
                    </div>

                    {/* Total Time Card */}
                    <div className="stat-card">
                        <div style={{
                            backgroundColor: 'rgba(242, 224, 203, 1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }} className="stat-icon">
                            <span style={{ fontSize: '20px' }}>🕐</span>
                        </div>
                        <div className="stat-text">
                            <p style={{
                                fontFamily: 'var(--font-label)',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: '700',
                                color: 'var(--color-muted)',
                                marginBottom: '4px'
                            }}>
                                Total Practice Time
                            </p>
                            <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontWeight: '700',
                                color: 'var(--color-dark)'
                            }} className="stat-value">
                                {totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${progress.totalMinutes}m`}
                            </span>
                        </div>
                    </div>
                </section>

                {/* 90-Day Path Section */}
                <section style={{ marginBottom: '48px' }}>
                    <div className="path-header" style={{ marginBottom: '24px' }}>
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--color-maroon)',
                                marginBottom: '4px'
                            }} className="path-title">
                                The 90-Day Path
                            </h2>
                            <p className="path-desc" style={{
                                color: 'var(--color-muted)',
                                fontSize: '14px'
                            }}>
                                Deepening your inner silence, one breath at a time.
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '2rem',
                                color: 'var(--color-gold)'
                            }}>
                                {completedCount}
                            </span>
                            <span style={{
                                color: 'var(--color-muted)',
                                fontWeight: '300',
                                fontSize: '1.1rem',
                                marginLeft: '4px'
                            }}>
                                / {totalDays} Days
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        height: '12px',
                        width: '100%',
                        backgroundColor: 'var(--surface-container-high)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${percentChange}%`,
                            backgroundColor: 'var(--color-maroon)',
                            borderRadius: '9999px',
                            transition: 'width 1s ease-out',
                            boxShadow: '0 0 12px rgba(93, 31, 31, 0.2)'
                        }} />
                    </div>

                    {/* Grid */}
                    <div style={{
                        backgroundColor: 'var(--surface-container-low)',
                        borderRadius: 'var(--radius-card)',
                        padding: '32px'
                    }} className="grid-container">
                        <ProgressGrid progress={progress.completedDays} />
                    </div>
                </section>

                {/* CTA + Quote */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px 0'
                }}>
                    <Link href={`/day/${nextDay}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '18px 48px',
                        backgroundColor: 'var(--color-maroon)',
                        color: 'white',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-label)',
                        fontSize: '13px',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        boxShadow: '0 12px 40px rgba(93, 31, 31, 0.2)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                    }}>
                        <span>✦</span>
                        Begin Today&apos;s Ritual
                    </Link>
                    <p style={{
                        marginTop: '24px',
                        color: 'var(--color-muted)',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        fontFamily: 'var(--font-heading)',
                        opacity: 0.7
                    }}>
                        &ldquo;The journey of a thousand miles begins with a single breath.&rdquo;
                    </p>
                </section>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="mobile-bottom-nav" aria-label="Main navigation">
                <Link href="/" aria-label="Home" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)',
                    width: '48px',
                    height: '48px',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    🏠
                </Link>
                <Link href="/dashboard" aria-label="Progress" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    boxShadow: '0 4px 16px rgba(93, 31, 31, 0.25)',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    📊
                </Link>
                <Link href="/profile" aria-label="Profile" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)',
                    width: '48px',
                    height: '48px',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    👤
                </Link>
            </nav>

            <style jsx>{`
                /* Mobile defaults */
                .greeting-title {
                    font-size: 2.5rem;
                    font-style: italic;
                }
                .greeting-subtitle {
                    font-size: 15px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                .stat-card {
                    background-color: var(--surface-container-lowest);
                    padding: 24px;
                    border-radius: var(--radius-card);
                    box-shadow: 0 12px 48px rgba(30, 27, 19, 0.04);
                    border: 1px solid rgba(217, 193, 191, 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 12px;
                    transition: all 0.5s ease;
                }
                .stat-icon {
                    width: 48px;
                    height: 48px;
                }
                .stat-value {
                    font-size: 1.75rem;
                }
                .path-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .path-title {
                    font-size: 1.25rem;
                }
                .path-desc {
                    display: none;
                }
                .grid-container {
                    padding: 24px;
                }
                .desktop-nav {
                    display: none;
                }
                .mobile-bottom-nav {
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
                .mobile-only {
                    display: block;
                }

                /* Desktop overrides */
                @media (min-width: 768px) {
                    .greeting-title {
                        font-size: 3.5rem;
                    }
                    .greeting-subtitle {
                        font-size: 1.1rem;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                        font-family: var(--font-label);
                    }
                    .stats-grid {
                        gap: 32px;
                    }
                    .stat-card {
                        flex-direction: row;
                        text-align: left;
                        padding: 32px;
                        gap: 24px;
                    }
                    .stat-card:hover {
                        box-shadow: 0 16px 64px rgba(30, 27, 19, 0.08);
                    }
                    .stat-icon {
                        width: 64px;
                        height: 64px;
                    }
                    .stat-value {
                        font-size: 2rem;
                    }
                    .path-title {
                        font-size: 1.875rem;
                    }
                    .path-desc {
                        display: block;
                    }
                    .grid-container {
                        padding: 40px;
                    }
                    .desktop-nav {
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
                    .mobile-bottom-nav {
                        display: none !important;
                    }
                    .mobile-only {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
