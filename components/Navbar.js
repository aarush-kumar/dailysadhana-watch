import Link from 'next/link';

export default function Navbar() {
    return (
        <nav style={{
            padding: '20px 0',
            borderBottom: '1px solid rgba(107, 36, 33, 0.1)',
            backgroundColor: 'var(--color-cream)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Link href="/" style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--color-gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginBottom: '4px'
                    }}>Daily</div>
                    <div className="serif" style={{
                        fontSize: '24px',
                        color: 'var(--color-maroon)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>Sādhanā</div>
                </Link>
            </div>
        </nav>
    );
}
