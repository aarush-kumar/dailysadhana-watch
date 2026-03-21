'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { User, LogOut, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Profile() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Simple way to check session client-side
        // For a real app, you'd have an /api/profile endpoint
        // We'll just parse the cookie or rely on a simple fetch
        async function checkAuth() {
            try {
                const res = await fetch('/api/progress'); // Reusing progress to check auth
                if (res.ok) {
                    // Success
                    setSession({ phone: 'Verified User', verified: true }); // Simplified
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

    if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="container section-padding fade-in" style={{ maxWidth: '500px' }}>
                <h1 className="serif maroon mb-4" style={{ textAlign: 'center' }}>Your Profile</h1>

                <div className="card text-center mb-4">
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(107, 36, 33, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <User size={40} color="var(--color-maroon)" />
                    </div>

                    <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Journal Seeker</h2>
                    <p style={{ color: 'var(--color-muted)', marginBottom: '24px' }}>Welcome to your sanctuary.</p>

                    <div style={{ textAlign: 'left', marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <span style={{ color: 'var(--color-muted)', fontWeight: '500' }}>Status</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'green' }}>
                                <ShieldCheck size={16} /> Verified
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
                            <span style={{ color: 'var(--color-muted)', fontWeight: '500' }}>Auth Type</span>
                            <span style={{ fontWeight: '600' }}>Phone OTP</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a
                        href="https://thedailysadhana.com"
                        target="_blank"
                        className="card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ExternalLink size={20} color="var(--color-gold)" />
                            <span style={{ fontWeight: '600' }}>Visit Shop</span>
                        </div>
                        <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>thedailysadhana.com</span>
                    </a>

                    <button
                        onClick={handleLogout}
                        className="card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 20px',
                            width: '100%',
                            color: 'var(--color-maroon)'
                        }}
                    >
                        <LogOut size={20} />
                        <span style={{ fontWeight: '600' }}>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
