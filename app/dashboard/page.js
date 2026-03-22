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

            {/* Desktop Top Nav - hidden on mobile via media query */}
            <header className="desktop-nav" style={{
                display: 'none',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '24px 48px',
                backgroundColor: 'rgba(255, 248, 239, 0.8)',
                backdropFilter: 'blur(20px)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--color-gold)'
                }}>
                    Daily Sādhanā
                </div>
                <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <Link href="/dashboard" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        borderBottom: '2px solid var(--color-gold)',
                        paddingBottom: '4px'
                    }}>Practice</Link>
                    <Link href="/profile" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'rgba(30, 27, 19, 0.6)'
                    }}>Profile</Link>
                </nav>
            </header>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 0' }}>

                {/* Greeting Section */}
                <section className="fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{
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
                        fontSize: '2.5rem',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        marginBottom: '16px'
                    }}>
                        Namaste
                    </h1>
                    <p style={{
                        color: 'var(--color-muted)',
                        fontWeight: '300',
                        maxWidth: '280px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                        fontSize: '15px'
                    }}>
                        Your journey toward inner peace continues today.
                    </p>
                </section>

                {/* Progress Bar */}
                <section style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.25rem',
                            color: 'var(--color-maroon)'
                        }}>
                            Current Path
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-label)',
                            fontSize: '13px',
                            color: 'var(--color-gold)',
                            fontWeight: '700',
                            letterSpacing: '0.05em'
                        }}>
                            {completedCount} of {totalDays} Days
                        </span>
                    </div>
                    <div style={{
                        height: '16px',
                        width: '100%',
                        backgroundColor: 'var(--surface-container-high)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${percentChange}%`,
                            backgroundColor: 'var(--color-maroon)',
                            borderRadius: '9999px',
                            transition: 'width 1s ease-out',
                            boxShadow: '0 0 12px rgba(93, 31, 31, 0.3)'
                        }} />
                    </div>
                </section>

                {/* Stats Cards */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    marginBottom: '40px'
                }}>
                    {/* Streak Card */}
                    <div style={{
                        backgroundColor: 'var(--surface-container-lowest)',
                        padding: '24px',
                        borderRadius: 'var(--radius-card)',
                        boxShadow: '0 12px 48px rgba(30, 27, 19, 0.04)',
                        border: '1px solid rgba(217, 193, 191, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(254, 214, 91, 0.3)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px'
                        }}>
                            <span style={{ fontSize: '22px' }}>🔥</span>
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: 'var(--color-dark)'
                        }}>
                            {progress.streak}
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-label)',
                            fontSize: '10px',
                            color: 'var(--color-muted)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginTop: '4px'
                        }}>
                            Day Streak
                        </span>
                    </div>

                    {/* Total Time Card */}
                    <div style={{
                        backgroundColor: 'var(--surface-container-lowest)',
                        padding: '24px',
                        borderRadius: 'var(--radius-card)',
                        boxShadow: '0 12px 48px rgba(30, 27, 19, 0.04)',
                        border: '1px solid rgba(217, 193, 191, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(242, 224, 203, 1)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px'
                        }}>
                            <span style={{ fontSize: '20px' }}>🕐</span>
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: 'var(--color-dark)'
                        }}>
                            {progress.totalMinutes > 0
                                ? (progress.totalMinutes >= 60
                                    ? `${Math.floor(progress.totalMinutes / 60)},${String(progress.totalMinutes % 60).padStart(2, '0')}0`
                                    : progress.totalMinutes)
                                : '0'
                            }
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-label)',
                            fontSize: '10px',
                            color: 'var(--color-muted)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginTop: '4px'
                        }}>
                            Minutes
                        </span>
                    </div>
                </section>

                {/* Ritual Calendar / 90-Day Grid */}
                <section style={{
                    backgroundColor: 'var(--surface-container-low)',
                    padding: '32px',
                    borderRadius: 'var(--radius-card)',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '32px'
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.2rem',
                            color: 'var(--color-maroon)',
                            marginBottom: '8px'
                        }}>
                            Ritual Calendar
                        </h3>
                        <div style={{
                            height: '1px',
                            width: '64px',
                            backgroundColor: 'var(--color-gold-accent)'
                        }} />
                    </div>

                    <ProgressGrid progress={progress.completedDays} />

                    <Link href={`/day/${nextDay}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '32px',
                        width: '100%',
                        padding: '16px',
                        backgroundColor: 'var(--color-maroon)',
                        color: 'white',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-label)',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        boxShadow: '0 8px 32px rgba(93, 31, 31, 0.2)',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                    }}>
                        ✦ Continue Today&apos;s Ritual
                    </Link>
                </section>

                {/* Quote Section */}
                <section style={{
                    textAlign: 'center',
                    padding: '0 16px',
                    fontStyle: 'italic'
                }}>
                    <span style={{
                        color: 'var(--color-gold-accent)',
                        fontSize: '2rem',
                        display: 'block',
                        marginBottom: '16px'
                    }}>
                        ❝
                    </span>
                    <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        color: 'rgba(30, 27, 19, 0.8)',
                        lineHeight: '1.6',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        &ldquo;The quieter you become, the more you are able to hear.&rdquo;
                    </p>
                    <cite style={{
                        fontStyle: 'normal',
                        fontFamily: 'var(--font-label)',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        color: 'var(--color-muted)',
                        display: 'block',
                        marginTop: '16px'
                    }}>
                        — RUMI
                    </cite>
                </section>
            </main>

            {/* Bottom Navigation - Mobile */}
            <nav style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '400px',
                backgroundColor: 'rgba(255, 248, 239, 0.9)',
                backdropFilter: 'blur(24px)',
                borderRadius: '9999px',
                boxShadow: '0 12px 48px rgba(30, 27, 19, 0.12)',
                height: '72px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 8px',
                zIndex: 100
            }}>
                {/* Home - Active */}
                <Link href="/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    boxShadow: '0 4px 16px rgba(93, 31, 31, 0.25)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    🏠
                </Link>
                {/* Progress */}
                <Link href="/dashboard" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)',
                    width: '48px',
                    height: '48px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    📊
                </Link>
                {/* Profile */}
                <Link href="/profile" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)',
                    width: '48px',
                    height: '48px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    fontSize: '22px'
                }}>
                    👤
                </Link>
            </nav>

            <style jsx>{`
                @media (min-width: 768px) {
                    .desktop-nav {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
}
