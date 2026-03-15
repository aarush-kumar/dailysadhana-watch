'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProgressGrid from '../../components/ProgressGrid';
import { Flame, Clock } from 'lucide-react';

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

    if (loading) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading your journey...</div>;
    }

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Navbar />
            <div className="container section-padding fade-in">
                <header style={{ marginBottom: '32px' }}>
                    <h1 className="serif maroon" style={{ fontSize: '2rem' }}>Namaste</h1>
                    <p style={{ color: 'var(--color-muted)' }}>Your Daily Sādhanā journey continues.</p>
                </header>

                <section className="card mb-4" style={{ backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-end' }}>
                        <span style={{ fontWeight: '600', fontSize: '18px' }}>Your Journey</span>
                        <span className="maroon" style={{ fontWeight: '700' }}>{completedCount} of {totalDays} days</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'rgba(107, 36, 33, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentChange}%`, height: '100%', backgroundColor: 'var(--color-maroon)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Flame color="var(--color-maroon)" size={24} />
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Streak</div>
                            <div style={{ fontWeight: '700', fontSize: '18px' }}>{progress.streak} Days</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock color="var(--color-gold)" size={24} />
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Watched</div>
                            <div style={{ fontWeight: '700', fontSize: '18px' }}>{Math.floor(progress.totalMinutes / 60)}h {progress.totalMinutes % 60}m</div>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="serif mb-4">The 90-Day Grid</h2>
                    <ProgressGrid progress={progress.completedDays} />
                </section>
            </div>

            {/* Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-light)',
                borderTop: '1px solid rgba(17, 17, 17, 0.1)',
                padding: '12px 0',
                display: 'flex',
                justifyContent: 'space-around',
                zIndex: 100
            }}>
                <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '11px' }}>
                    <Link href="/"> Home </Link>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--color-maroon)', fontSize: '11px', fontWeight: '700' }}>
                    Progress
                </div>
                <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '11px' }}>
                    <Link href="/profile"> Profile </Link>
                </div>
            </div>
        </div>
    );
}
