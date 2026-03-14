import Link from 'next/link';

export default function ProgressGrid({ progress = [] }) {
    const totalDays = 90;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
            marginTop: '24px'
        }}>
            {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const isWatched = progress.includes(dayNum);

                return (
                    <Link
                        key={dayNum}
                        href={`/day/${dayNum}`}
                        style={{
                            width: '100%',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: isWatched ? 'var(--color-maroon)' : 'transparent',
                            color: isWatched ? 'var(--color-light)' : 'var(--color-gold)',
                            border: isWatched ? 'none' : '1px solid var(--color-gold)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {dayNum}
                    </Link>
                );
            })}
        </div>
    );
}
