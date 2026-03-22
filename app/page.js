import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', paddingBottom: '120px' }}>

            {/* Desktop Top Nav */}
            <nav className="home-desktop-nav">
                <Link href="/">
                    <Image
                        src="/logo-gold.png"
                        alt="Daily Sādhanā"
                        width={140}
                        height={42}
                        style={{ height: 'auto' }}
                    />
                </Link>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <Link href="/" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        borderBottom: '2px solid var(--color-gold)',
                        paddingBottom: '4px'
                    }}>Practice</Link>
                    <Link href="/login" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: 'rgba(30, 27, 19, 0.6)',
                        transition: 'all 0.3s ease'
                    }}>Sign In</Link>
                </div>
                <Link href="/login" style={{
                    padding: '10px 24px',
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-label)',
                    fontSize: '14px',
                    fontWeight: '700',
                    textDecoration: 'none'
                }}>
                    Start Watching
                </Link>
            </nav>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

                {/* Hero Section */}
                <section className="home-hero fade-in" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        backgroundColor: '#f2e0cb',
                        color: '#504535',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: '700',
                        fontFamily: 'var(--font-label)',
                        marginBottom: '32px'
                    }}>
                        ✦ The Modern Temple
                    </div>

                    {/* Logo */}
                    <div style={{ marginBottom: '24px' }}>
                        <Image
                            src="/logo-gold.png"
                            alt="Daily Sādhanā"
                            width={200}
                            height={60}
                            style={{ maxWidth: '100%', height: 'auto' }}
                            priority
                        />
                    </div>

                    <h1 className="home-hero-title" style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-maroon)',
                        fontWeight: '700',
                        lineHeight: '1.1',
                        letterSpacing: '-0.02em',
                        marginBottom: '24px'
                    }}>
                        Your Daily Sādhanā,<br />Brought to Life
                    </h1>

                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.1rem',
                        color: 'var(--color-muted)',
                        maxWidth: '500px',
                        margin: '0 auto 40px',
                        lineHeight: '1.7'
                    }}>
                        Elevate your spiritual journey through a curated devotional experience designed for modern seekers.
                    </p>

                    <Link href="/login" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '18px 40px',
                        backgroundColor: 'var(--color-maroon)',
                        color: 'white',
                        borderRadius: '16px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        boxShadow: '0 12px 40px rgba(93, 31, 31, 0.2)',
                        transition: 'all 0.3s ease'
                    }}>
                        Start Watching ▶
                    </Link>
                </section>

                {/* How It Works */}
                <section style={{ padding: '80px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <span style={{
                            fontFamily: 'var(--font-label)',
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            color: 'var(--color-gold)',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                        }}>The Path</span>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2rem',
                            color: 'var(--color-maroon)',
                            marginTop: '12px'
                        }}>
                            A Sacred Journey in Three Steps
                        </h2>
                    </div>

                    <div className="how-it-works-grid">
                        {/* Step 1 */}
                        <div className="how-card">
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(254, 214, 91, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                fontSize: '28px'
                            }}>📱</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem',
                                marginBottom: '12px',
                                color: 'var(--color-dark)'
                            }}>1. Scan QR</h3>
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                color: 'var(--color-muted)',
                                lineHeight: '1.7'
                            }}>Simply scan the code from your ritual kit to unlock the portal.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="how-card">
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(254, 214, 91, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                fontSize: '28px'
                            }}>✅</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem',
                                marginBottom: '12px',
                                color: 'var(--color-dark)'
                            }}>2. Verify Purchase</h3>
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                color: 'var(--color-muted)',
                                lineHeight: '1.7'
                            }}>Seamless verification to secure your personalized devotional path.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="how-card">
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(254, 214, 91, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                fontSize: '28px'
                            }}>👁️</div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem',
                                marginBottom: '12px',
                                color: 'var(--color-dark)'
                            }}>3. Watch & Reflect</h3>
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                color: 'var(--color-muted)',
                                lineHeight: '1.7'
                            }}>Immerse yourself in high-definition guided spiritual practices.</p>
                        </div>
                    </div>
                </section>

                {/* Languages Section */}
                <section style={{ padding: '80px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span style={{
                            fontFamily: 'var(--font-label)',
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            color: 'var(--color-gold)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '8px'
                        }}>Global Wisdom</span>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.75rem',
                            color: 'var(--color-dark)'
                        }}>
                            Available in 5 Languages
                        </h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'].map(lang => (
                            <div key={lang} style={{
                                padding: '12px 32px',
                                borderRadius: '9999px',
                                backgroundColor: 'white',
                                border: '1px solid rgba(217, 193, 191, 0.1)',
                                boxShadow: '0 2px 8px rgba(30, 27, 19, 0.03)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px',
                                fontWeight: '500',
                                color: 'var(--color-muted)',
                                transition: 'all 0.3s ease'
                            }}>
                                {lang}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quote Section */}
                <section style={{
                    padding: '80px 0',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', color: 'var(--color-gold)', marginBottom: '24px' }}>❝</div>
                    <blockquote style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.75rem',
                        fontStyle: 'italic',
                        color: 'var(--color-maroon)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.4'
                    }}>
                        &ldquo;Realizing the divinity within is the ultimate sādhanā.&rdquo;
                    </blockquote>
                    <div style={{
                        marginTop: '24px',
                        fontFamily: 'var(--font-label)',
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)'
                    }}>Ancient Wisdom</div>
                </section>

                {/* CTA Banner */}
                <section style={{
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    borderRadius: 'var(--radius-card)',
                    padding: '48px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '48px'
                }}>
                    {/* Decorative glow */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '256px',
                        height: '256px',
                        backgroundColor: 'var(--color-gold)',
                        opacity: 0.15,
                        filter: 'blur(80px)',
                        borderRadius: '50%',
                        transform: 'translate(50%, -50%)'
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 className="cta-title" style={{
                            fontFamily: 'var(--font-heading)',
                            marginBottom: '16px',
                            lineHeight: '1.2'
                        }}>
                            Ready to begin your daily ritual?
                        </h2>
                        <p style={{
                            opacity: 0.8,
                            marginBottom: '32px',
                            fontSize: '1rem',
                            maxWidth: '400px',
                            margin: '0 auto 32px',
                            lineHeight: '1.6'
                        }}>
                            Join thousands of practitioners in the modern temple. Accessible anywhere, anytime.
                        </p>
                        <Link href="/login" style={{
                            display: 'inline-block',
                            padding: '16px 48px',
                            backgroundColor: 'rgba(254, 214, 91, 0.9)',
                            color: 'var(--color-dark)',
                            borderRadius: '9999px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            textDecoration: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            Begin Ritual
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{
                backgroundColor: 'var(--surface-container-high)',
                padding: '64px 24px',
                marginTop: '48px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontStyle: 'italic',
                        fontSize: '1.25rem',
                        color: 'var(--color-gold)',
                        marginBottom: '24px'
                    }}>
                        Daily Sādhanā
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        marginBottom: '24px'
                    }}>
                        <a href="https://thedailysadhana.com" target="_blank" rel="noopener noreferrer"
                           style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Shop</a>
                        <a href="#" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Privacy</a>
                        <a href="#" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Terms</a>
                        <a href="#" style={{ color: 'var(--color-muted)', fontSize: '14px', textDecoration: 'none' }}>Support</a>
                    </div>
                    <p style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(30, 27, 19, 0.3)'
                    }}>
                        &copy; {new Date().getFullYear()} Daily Sādhanā. The Modern Temple.
                    </p>
                </div>
            </footer>

            {/* Bottom Navigation - Mobile Only */}
            <nav className="home-bottom-nav" aria-label="Main navigation">
                <Link href="/" aria-label="Home" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--color-maroon)', color: 'white',
                    borderRadius: '50%', width: '56px', height: '56px',
                    boxShadow: '0 4px 16px rgba(93, 31, 31, 0.25)',
                    textDecoration: 'none', fontSize: '22px'
                }}>🏠</Link>
                <Link href="/dashboard" aria-label="Progress" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>📊</Link>
                <Link href="/profile" aria-label="Profile" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(30, 27, 19, 0.4)', width: '48px', height: '48px',
                    textDecoration: 'none', fontSize: '22px'
                }}>👤</Link>
            </nav>

            <style jsx>{`
                .home-hero {
                    padding: 64px 0 48px;
                }
                .home-hero-title {
                    font-size: 2.5rem;
                }
                .how-it-works-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                .how-card {
                    background-color: var(--surface-container-low);
                    padding: 40px;
                    border-radius: var(--radius-card);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    transition: all 0.5s ease;
                }
                .cta-title {
                    font-size: 1.75rem;
                }
                .home-desktop-nav {
                    display: none;
                }
                .home-bottom-nav {
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
                    .home-hero {
                        padding: 96px 0 64px;
                    }
                    .home-hero-title {
                        font-size: 3.5rem;
                    }
                    .how-it-works-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 32px;
                    }
                    .how-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 16px 48px rgba(30, 27, 19, 0.06);
                    }
                    .cta-title {
                        font-size: 2.5rem;
                    }
                    .home-desktop-nav {
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
                    .home-bottom-nav {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
