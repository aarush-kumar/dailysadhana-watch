'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2 } from 'lucide-react';

export default function VideoPlayer({ videoUrl, onProgress }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setPlaying(true);
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setProgress((current / total) * 100);

        // Auto-mark as complete at 90%
        if (current / total > 0.9) {
            onProgress(Math.floor(current));
        }
    };

    const handleSeek = (e) => {
        const time = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = time;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="video-container"
            onContextMenu={(e) => e.preventDefault()}
            style={{
                position: 'relative',
                backgroundColor: '#000',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                aspectRatio: '9/16',
                maxHeight: '80vh',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                onClick={togglePlay}
                controlsList="nodownload nofullscreen noremoteplayback"
                style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Custom Controls Overlay */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                opacity: 0.9,
                transition: 'opacity 0.3s ease'
            }}>
                {/* Seek Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        accentColor: 'var(--color-maroon)',
                        cursor: 'pointer'
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={togglePlay} style={{ color: '#fff' }}>
                            {playing ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" />}
                        </button>
                        <span style={{ fontSize: '14px', fontFamily: 'var(--font-body)' }}>
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Volume2 size={20} />
                        <button onClick={() => videoRef.current.requestFullscreen()} style={{ color: '#fff' }}>
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Center Play Button Overlay */}
            {!playing && (
                <div
                    onClick={togglePlay}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(107, 36, 33, 0.8)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Play size={40} fill="#fff" color="#fff" style={{ marginLeft: '4px' }} />
                </div>
            )}
        </div>
    );
}
