'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '../../../components/VideoPlayer';
import LanguageSelector from '../../../components/LanguageSelector';
import ShlokaText from '../../../components/ShlokaText';
import shlokasData from '../../../data/shlokas.json';
import LockedOverlay from '../../../components/LockedOverlay';

export default function DayPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const dayId = parseInt(params.id);
    const router = useRouter();

    const [shloka, setShloka] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('en');
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const found = shlokasData.find(s => s.day === dayId);
        if (!found) {
            setShloka({
                day: dayId,
                sanskrit: 'Shloka text coming soon...',
                transliteration: '',
                meaning: 'We are currently preparing the content for this day.'
            });
        } else {
            setShloka(found);
        }
        fetchVideoUrl(dayId, activeLanguage);
    }, [dayId, activeLanguage]);

    const fetchVideoUrl = async (day, lang) => {
        setLoading(true);
        setIsLocked(false);
        setError('');
        try {
            const res = await fetch('/api/video-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ day, language: lang })
            });
            if (res.ok) {
                const data = await res.json();
                setVideoUrl(data.url);
            } else if (res.status === 403) {
                setIsLocked(true);
            } else {
                setError('Unable to load video. Please try again later.');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    const handleProgress = async (duration) => {
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ day: dayId, watchDurationSeconds: duration })
            });
        } catch (err) {
            console.error('Failed to save progress', err);
        }
    };

    const prevDay = dayId > 1 ? dayId - 1 : null;
    const nextDay = dayId < 90 ? dayId + 1 : null;

    if (isNaN(dayId) || dayId < 1 || dayId > 90) {
        return <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--color-muted)' }}>Invalid Day</div>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingBottom: '120px' }}>

            {/* Desktop Top Nav */}
            <nav className="desktop-nav-day">
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
                    border: '1px solid rgba(217, 193, 191, 0.15)'
                }}>
                    👤
                </Link>
            </nav>

            <main className="day-main">
                <div className="day-layout">

                    {/* Left Column: Video */}
                    <div className="day-video-col">
                        {/* Mobile Header */}
                        <header className="day-header-mobile">
                            <div>
                                <span style={{
                                    fontFamily: 'var(--font-label)',
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--color-muted)',
                                    fontWeight: '700'
                                }}>Ritual Sequence</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                    {prevDay && (
                                        <Link href={`/day/${prevDay}`} style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--surface-container-low)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--color-muted)', fontSize: '16px',
                                            textDecoration: 'none'
                                        }}>‹</Link>
                                    )}
                                    <h1 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: 'var(--color-maroon)'
                                    }}>Day {dayId} of 90</h1>
                                    {nextDay && (
                                        <Link href={`/day/${nextDay}`} style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--surface-container-low)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--color-muted)', fontSize: '16px',
                                            textDecoration: 'none'
                                        }}>›</Link>
                                    )}
                                </div>
                            </div>
                            <Link href="/dashboard" style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px',
                                backgroundColor: 'var(--surface-container-low)',
                                borderRadius: '9999px',
                                textDecoration: 'none'
                            }}>
                                <span style={{ fontSize: '12px' }}>📊</span>
                                <span style={{
                                    fontFamily: 'var(--font-label)',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: 'var(--color-dark)'
                                }}>DASHBOARD</span>
                            </Link>
                        </header>

                        {/* Video Player */}
                        {isLocked ? (
                            <LockedOverlay />
                        ) : error ? (
                            <div style={{
                                aspectRatio: '9/16', maxHeight: '65vh', margin: '0 auto',
                                backgroundColor: 'var(--surface-container-low)',
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-maroon)', textAlign: 'center', padding: '40px'
                            }}>{error}</div>
                        ) : loading ? (
                            <div style={{
                                aspectRatio: '9/16', maxHeight: '65vh', margin: '0 auto',
                                backgroundColor: 'var(--surface-container-high)',
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ color: 'var(--color-muted)' }}>Preparing Shloka Video...</div>
                            </div>
                        ) : (
                            <VideoPlayer videoUrl={videoUrl} onProgress={handleProgress} />
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <div className="day-content-col">

                        {/* Desktop Header */}
                        <div className="day-header-desktop" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderBottom: '1px solid rgba(217, 193, 191, 0.1)',
                            paddingBottom: '32px', marginBottom: '32px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: '700',
                                    color: 'var(--color-maroon)',
                                    fontSize: '1.5rem'
                                }}>Day {dayId} of 90</h2>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    borderLeft: '1px solid rgba(217, 193, 191, 0.2)',
                                    marginLeft: '8px', paddingLeft: '16px'
                                }}>
                                    {prevDay && (
                                        <Link href={`/day/${prevDay}`} style={{
                                            width: '36px', height: '36px',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--color-muted)', fontSize: '18px',
                                            textDecoration: 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}>‹</Link>
                                    )}
                                    {nextDay && (
                                        <Link href={`/day/${nextDay}`} style={{
                                            width: '36px', height: '36px',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--color-muted)', fontSize: '18px',
                                            textDecoration: 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}>›</Link>
                                    )}
                                </div>
                            </div>
                            <Link href="/dashboard" style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: 'var(--color-gold)',
                                fontFamily: 'var(--font-label)',
                                fontSize: '13px',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}>
                                <span>📊</span>
                                VIEW FULL PATHWAY
                            </Link>
                        </div>

                        {/* Language Selector */}
                        {!isLocked && (
                            <LanguageSelector activeLanguage={activeLanguage} onSelect={setActiveLanguage} />
                        )}

                        {/* Shloka Text */}
                        {!isLocked && (
                            <div style={{ marginTop: '16px' }}>
                                <ShlokaText shloka={shloka} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="mobile-bottom-nav-day">
                <Link href="/dashboard" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--color-maroon)', color: 'white',
                    borderRadius: '50%', width: '56px', height: '56px',
                    boxShadow: '0 4px 16px rgba(93, 31, 31, 0.25)',
                    textDecoration: 'none', fontSize: '22px'
                }}>🏠</Link>
                <Link href="/dashboard" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>📊</Link>
                <Link href="/profile" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>👤</Link>
            </nav>

            <style jsx>{`
                .desktop-nav-day {
                    display: none;
                }
                .day-main {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 24px 16px 0;
                }
                .day-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .day-video-col {
                    width: 100%;
                }
                .day-content-col {
                    width: 100%;
                }
                .day-header-mobile {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 24px;
                }
                .day-header-desktop {
                    display: none !important;
                }
                .mobile-bottom-nav-day {
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

                @media (min-width: 1024px) {
                    .desktop-nav-day {
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
                    .day-main {
                        padding: 48px 24px 0;
                    }
                    .day-layout {
                        max-width: 1100px;
                        margin: 0 auto;
                        display: grid;
                        grid-template-columns: 5fr 7fr;
                        gap: 64px;
                        align-items: start;
                    }
                    .day-header-mobile {
                        display: none !important;
                    }
                    .day-header-desktop {
                        display: flex !important;
                    }
                    .mobile-bottom-nav-day {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
