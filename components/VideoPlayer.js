'use client';

import { useState, useRef } from 'react';

export default function VideoPlayer({ videoUrl, onProgress }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef(null);
    const controlsTimeout = useRef(null);
    const progressReported = useRef(false);

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

        // Report progress once at 90% — debounced
        if (current / total > 0.9 && !progressReported.current) {
            progressReported.current = true;
            onProgress(Math.floor(current));
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        videoRef.current.currentTime = percent * videoRef.current.duration;
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        videoRef.current.muted = !videoRef.current.muted;
        setMuted(!muted);
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        videoRef.current.requestFullscreen?.() || videoRef.current.webkitRequestFullscreen?.();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleInteraction = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout.current);
        if (playing) {
            controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    return (
        <div
            className="video-container"
            onContextMenu={(e) => e.preventDefault()}
            onMouseMove={handleInteraction}
            onTouchStart={handleInteraction}
            style={{
                position: 'relative',
                backgroundColor: 'var(--color-dark)',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '9/16',
                maxHeight: '65vh',
                margin: '0 auto',
                boxShadow: '0 12px 48px rgba(30, 27, 19, 0.12)',
                cursor: 'pointer'
            }}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                onClick={togglePlay}
                controlsList="nodownload nofullscreen noremoteplayback"
                playsInline
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />

            {/* Bottom gradient + controls */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '80px 24px 24px',
                background: 'linear-gradient(to top, rgba(30, 27, 19, 0.8) 0%, rgba(30, 27, 19, 0) 100%)',
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: showControls ? 'auto' : 'none'
            }}>
                {/* Seek Bar */}
                <div
                    onClick={handleSeek}
                    role="slider"
                    aria-label="Video progress"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    tabIndex={0}
                    style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '9999px',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: 'var(--color-gold-light)',
                        borderRadius: '9999px'
                    }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </span>
                        <button
                            onClick={toggleMute}
                            aria-label={muted ? 'Unmute' : 'Mute'}
                            style={{ color: 'rgba(255,255,255,0.9)', cursor: 'pointer', fontSize: '20px', background: 'none', border: 'none' }}
                        >
                            {muted ? '🔇' : '🔊'}
                        </button>
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        aria-label="Toggle fullscreen"
                        style={{ color: 'rgba(255,255,255,0.9)', cursor: 'pointer', fontSize: '20px', background: 'none', border: 'none' }}
                    >
                        ⛶
                    </button>
                </div>
            </div>

            {/* Center Play Button */}
            {!playing && (
                <button
                    onClick={togglePlay}
                    aria-label="Play video"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--color-maroon)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s ease',
                        border: 'none',
                        color: 'white',
                        fontSize: '32px',
                        paddingLeft: '4px'
                    }}
                >
                    ▶
                </button>
            )}
        </div>
    );
}
