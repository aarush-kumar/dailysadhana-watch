import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ShareButton from './ShareButton';

export default function DayNavigation({ currentDay }) {
    const prevDay = currentDay > 1 ? currentDay - 1 : null;
    const nextDay = currentDay < 90 ? currentDay + 1 : null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            padding: '20px 0',
            borderTop: '1px solid rgba(107, 36, 33, 0.1)'
        }}>
            <div style={{ flex: 1 }}>
                {prevDay && (
                    <Link href={`/day/${prevDay}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-maroon)', fontWeight: '600' }}>
                        <ChevronLeft size={20} />
                        <span>Day {prevDay}</span>
                    </Link>
                )}
            </div>

            <ShareButton dayId={currentDay} />

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {nextDay && (
                    <Link href={`/day/${nextDay}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-maroon)', fontWeight: '600' }}>
                        <span>Day {nextDay}</span>
                        <ChevronRight size={20} />
                    </Link>
                )}
            </div>
        </div>
    );
}
