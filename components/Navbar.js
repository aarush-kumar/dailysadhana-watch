import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav style={{
            padding: '16px 0',
            borderBottom: '1px solid rgba(107, 36, 33, 0.1)',
            backgroundColor: 'var(--color-cream)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Link href="/" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Image
                        src="/logo-gold.png"
                        alt="Daily Sādhanā"
                        width={240}
                        height={80}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        priority
                    />
                </Link>
            </div>
        </nav>
    );
}
