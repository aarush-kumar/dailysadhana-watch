import Link from 'next/link';

export default function ProgressGrid({ progress = [] }) {
    const totalDays = 90;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            maxWidth: '320px',
            margin: '0 auto'
        }}>
            {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const isWatched = progress.includes(dayNum);

                return (
                    <Link
                        key={dayNum}
                        href={`/day/${dayNum}`}
                        style={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: isWatched ? 'var(--color-maroon)' : 'white',
                            color: isWatched ? 'white' : 'var(--color-muted)',
                            border: isWatched ? 'none' : '1px solid rgba(217, 193, 191, 0.3)',
                            boxShadow: isWatched
                                ? '0 2px 8px rgba(93, 31, 31, 0.15)'
                                : 'none',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                        }}
                    >
                        {isWatched ? '✓' : dayNum}
                    </Link>
                );
            })}
        </div>
    );
}
