'use client';

import { useState, useRef } from 'react';

// Clean SVG icons
const PlayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5.14v14.72a1 1 0 001.5.86l11.5-7.36a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
);

const VolumeOnIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <path d="M15.54 8.46a5 5 0 010 7.07" />
        <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
);

const VolumeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
);

const FullscreenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 00-2 2v3" />
        <path d="M21 8V5a2 2 0 00-2-2h-3" />
        <path d="M3 16v3a2 2 0 002 2h3" />
        <path d="M16 21h3a2 2 0 002-2v-3" />
    </svg>
);

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
        const video = videoRef.current;

        // iOS Safari — use native fullscreen (gives skip 10s, AirPlay, PiP etc.)
        if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
            return;
        }

        // Desktop browsers — use Fullscreen API on the video element
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
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
                controlsList="nodownload noremoteplayback"
                playsInline
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />

            {/* Tap overlay for play/pause while playing */}
            {playing && showControls && (
                <button
                    onClick={togglePlay}
                    aria-label="Pause video"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'opacity 0.3s ease',
                        opacity: 0.8
                    }}
                >
                    <PauseIcon />
                </button>
            )}

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
                            style={{
                                color: 'rgba(255,255,255,0.9)',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                        </button>
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        aria-label="Enter fullscreen"
                        style={{
                            color: 'rgba(255,255,255,0.9)',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FullscreenIcon />
                    </button>
                </div>
            </div>

            {/* Center Play Button (when paused) */}
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
                        border: 'none'
                    }}
                >
                    <PlayIcon />
                </button>
            )}
        </div>
    );
}
