import { Lock } from 'lucide-react';

export default function LockedOverlay() {
    return (
        <div className="card text-center fade-in" style={{ padding: '60px 20px', border: '2px dashed var(--color-gold)' }}>
            <Lock size={48} color="var(--color-gold)" style={{ marginBottom: '24px' }} />
            <h2 className="serif maroon mb-4">Locked for Journal Owners</h2>
            <p className="mb-4" style={{ color: 'var(--color-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
                This shloka experience is exclusively available for our community members who have purchased the Daily Sādhanā journal.
            </p>
            <a
                href="https://thedailysadhana.com/products/daily-sadhana-find-your-calm-in-just-5-minutes-a-day"
                target="_blank"
                className="btn-primary"
            >
                Get Your Journal
            </a>
        </div>
    );
}
