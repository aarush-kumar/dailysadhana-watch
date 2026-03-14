'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import VideoPlayer from '../../../components/VideoPlayer';
import LanguageSelector from '../../../components/LanguageSelector';
import ShlokaText from '../../../components/ShlokaText';
import DayNavigation from '../../../components/DayNavigation';
import shlokasData from '../../../data/shlokas.json';
import { Lock } from 'lucide-react';

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
        // 1. Load shloka data
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

        // 2. Fetch video URL
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
        // Optional: add debounce or throttle
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

    if (isNaN(dayId) || dayId < 1 || dayId > 90) {
        return <div className="container section-padding">Invalid Day</div>;
    }

    return (
        <div style={{ paddingBottom: '60px' }}>
            <Navbar />

            <div className="container section-padding fade-in">
                <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '4px' }}>JOURNEY</div>
                        <h1 className="serif maroon" style={{ fontSize: '1.8rem' }}>Day {dayId} of 90</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{ color: 'var(--color-gold)', fontSize: '14px', fontWeight: '600' }}
                    >
                        DASHBOARD
                    </button>
                </header>

                {isLocked ? (
                    <LockedOverlay />
                ) : (
                    <>
                        {error ? (
                            <div className="card text-center maroon" style={{ padding: '40px' }}>{error}</div>
                        ) : loading ? (
                            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#e0e0e0', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="maroon">Preparing Shloka Video...</div>
                            </div>
                        ) : (
                            <VideoPlayer videoUrl={videoUrl} onProgress={handleProgress} />
                        )}

                        <LanguageSelector activeLanguage={activeLanguage} onSelect={setActiveLanguage} />

                        <div style={{ marginTop: '40px' }}>
                            <ShlokaText shloka={shloka} />
                        </div>

                        <DayNavigation currentDay={dayId} />
                    </>
                )}
            </div>
        </div>
    );
}
