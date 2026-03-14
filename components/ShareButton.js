import { Share2 } from 'lucide-react';

export default function ShareButton({ dayId }) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Daily Sādhanā - Day ${dayId}`,
                text: `Watch the shloka for Day ${dayId} on Daily Sadhana.`,
                url: window.location.origin + `/day/${dayId}`,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.origin + `/day/${dayId}`);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <button onClick={handleShare} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-muted)' }}>
            <Share2 size={20} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Share</span>
        </button>
    );
}
