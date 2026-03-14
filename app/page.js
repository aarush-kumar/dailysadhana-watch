import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
    return (
        <div>
            <Navbar />

            <section className="section-padding fade-in">
                <div className="container text-center">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-maroon)' }}>
                        Your Daily Sādhanā,<br />Brought to Life
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Watch the shloka for each day of your 90-day journey in your preferred language.
                    </p>
                    <Link href="/dashboard" className="btn-primary">
                        Start Watching
                    </Link>
                </div>
            </section>

            <section style={{ backgroundColor: 'var(--color-light)', padding: '64px 0' }}>
                <div className="container">
                    <h2 className="text-center mb-4" style={{ color: 'var(--color-maroon)' }}>How It Works</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '32px',
                        marginTop: '48px'
                    }}>
                        <div className="card text-center">
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🪷</div>
                            <h3 className="mb-4">Scan QR Code</h3>
                            <p>Each page of your journal features a unique QR code for that day's shloka.</p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📲</div>
                            <h3 className="mb-4">Verify Purchase</h3>
                            <p>Log in with your phone number to verify your 90-day journal purchase.</p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎬</div>
                            <h3 className="mb-4">Watch & Reflect</h3>
                            <p>Experience the shloka in English, Hindi, Tamil, Telugu, or Kannada.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding">
                <div className="container text-center">
                    <h2 className="maroon mb-4">Available in 5 Languages</h2>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '24px'
                    }}>
                        {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(lang => (
                            <span key={lang} style={{
                                padding: '8px 20px',
                                border: '1px solid var(--color-gold)',
                                borderRadius: 'var(--radius-pill)',
                                color: 'var(--color-gold)',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={{
                backgroundColor: 'var(--color-dark)',
                color: 'var(--color-light)',
                padding: '48px 0',
                marginTop: '64px'
            }}>
                <div className="container text-center">
                    <div className="serif" style={{ fontSize: '20px', letterSpacing: '0.1em', marginBottom: '24px' }}>
                        DAILY SĀDHANĀ
                    </div>
                    <p style={{ opacity: 0.6, fontSize: '14px' }}>
                        &copy; {new Date().getFullYear()} The Daily Sadhana. All rights reserved.
                    </p>
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.8, fontSize: '14px' }}>
                        <a href="https://thedailysadhana.com" target="_blank">Shop</a>
                        <a href="#">Support</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
