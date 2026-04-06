'use client';

import { useState, useEffect } from 'react';

function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatPhone(phone) {
    if (!phone) return '—';
    return phone;
}

export default function AdminPage() {
    const [secret, setSecret] = useState('');
    const [authed, setAuthed] = useState(false);
    const [authError, setAuthError] = useState('');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [selected, setSelected] = useState(new Set());
    const [templateName, setTemplateName] = useState('');
    const [bodyValues, setBodyValues] = useState('');
    const [languageCode, setLanguageCode] = useState('en');

    const [sending, setSending] = useState(false);
    const [sendResults, setSendResults] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        setAuthError('');
        const res = await fetch('/api/admin/trial-watchers', {
            headers: { 'x-admin-secret': secret }
        });
        if (res.status === 401) {
            setAuthError('Wrong password.');
            return;
        }
        const data = await res.json();
        if (data.error) {
            setAuthError(data.error);
            return;
        }
        setAuthed(true);
        setUsers(data.users);
    }

    async function fetchUsers() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/trial-watchers', {
                headers: { 'x-admin-secret': secret }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleSelect(phone) {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(phone)) next.delete(phone);
            else next.add(phone);
            return next;
        });
    }

    function toggleAll() {
        if (selected.size === users.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(users.map(u => u.phone)));
        }
    }

    async function handleSend(phonesToSend) {
        if (!templateName.trim()) {
            alert('Enter a template name first.');
            return;
        }
        setSending(true);
        setSendResults(null);
        try {
            const parsedBodyValues = bodyValues.trim()
                ? bodyValues.split(',').map(v => v.trim())
                : [];

            const res = await fetch('/api/admin/send-whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': secret
                },
                body: JSON.stringify({
                    phones: phonesToSend,
                    templateName: templateName.trim(),
                    bodyValues: parsedBodyValues,
                    languageCode,
                })
            });
            const data = await res.json();
            setSendResults(data);
        } catch (err) {
            alert('Send failed: ' + err.message);
        } finally {
            setSending(false);
        }
    }

    if (!authed) {
        return (
            <div style={styles.loginWrap}>
                <div style={styles.loginCard}>
                    <h2 style={styles.loginTitle}>Admin Panel</h2>
                    <p style={styles.loginSub}>Daily Sādhanā — Trial User Outreach</p>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="password"
                            placeholder="Admin password"
                            value={secret}
                            onChange={e => setSecret(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />
                        {authError && <p style={styles.errorText}>{authError}</p>}
                        <button type="submit" style={styles.btnPrimary}>Enter</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrap}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Trial Watchers</h1>
                    <p style={styles.subtitle}>Users who watched free videos but haven&apos;t purchased</p>
                </div>
                <button onClick={fetchUsers} style={styles.btnSecondary} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            {/* Template Config */}
            <div style={styles.templateBox}>
                <h3 style={styles.sectionTitle}>WhatsApp Template</h3>
                <div style={styles.templateRow}>
                    <div style={{ flex: 2 }}>
                        <label style={styles.label}>Template Name</label>
                        <input
                            style={styles.input}
                            placeholder="e.g. trial_followup_v1"
                            value={templateName}
                            onChange={e => setTemplateName(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={styles.label}>Language Code</label>
                        <input
                            style={styles.input}
                            placeholder="en"
                            value={languageCode}
                            onChange={e => setLanguageCode(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 3 }}>
                        <label style={styles.label}>Body Values (comma-separated, for {`{{1}}`}, {`{{2}}`}…)</label>
                        <input
                            style={styles.input}
                            placeholder="e.g. Aarush, Day 3"
                            value={bodyValues}
                            onChange={e => setBodyValues(e.target.value)}
                        />
                    </div>
                </div>

                {selected.size > 0 && (
                    <div style={styles.bulkBar}>
                        <span style={styles.bulkCount}>{selected.size} selected</span>
                        <button
                            style={styles.btnPrimary}
                            onClick={() => handleSend([...selected])}
                            disabled={sending}
                        >
                            {sending ? 'Sending...' : `Send to ${selected.size} user${selected.size > 1 ? 's' : ''}`}
                        </button>
                        <button style={styles.btnSecondary} onClick={() => setSelected(new Set())}>
                            Clear selection
                        </button>
                    </div>
                )}
            </div>

            {/* Send Results */}
            {sendResults && (
                <div style={styles.resultsBox}>
                    <strong>{sendResults.successCount} / {sendResults.total} sent successfully</strong>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {sendResults.results.map(r => (
                            <span key={r.phone} style={{ color: r.success ? '#16a34a' : '#dc2626', fontSize: '13px' }}>
                                {r.phone} — {r.success ? 'Sent' : `Failed: ${r.response?.message || r.error || 'Unknown error'}`}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div style={styles.tableWrap}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={{ ...styles.th, width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selected.size === users.length && users.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th style={styles.th}>Phone</th>
                            <th style={styles.th}>Days Watched</th>
                            <th style={styles.th}>Last Watched</th>
                            <th style={styles.th}>Last Login</th>
                            <th style={styles.th}>Purchased</th>
                            <th style={styles.th}>Source</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                                    {loading ? 'Loading...' : 'No trial watchers found.'}
                                </td>
                            </tr>
                        )}
                        {users.map(user => (
                            <tr key={user.uid} style={styles.tr}>
                                <td style={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={selected.has(user.phone)}
                                        onChange={() => toggleSelect(user.phone)}
                                    />
                                </td>
                                <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: '600' }}>
                                    {formatPhone(user.phone)}
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {user.daysWatched.sort((a, b) => a - b).map(d => (
                                            <span key={d} style={styles.dayBadge}>Day {d}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ ...styles.td, color: '#6b7280', fontSize: '13px' }}>
                                    {formatDate(user.lastWatchedAt)}
                                </td>
                                <td style={{ ...styles.td, color: '#6b7280', fontSize: '13px' }}>
                                    {formatDate(user.lastLoginAt)}
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        borderRadius: '9999px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: user.purchased ? '#dcfce7' : '#fef2f2',
                                        color: user.purchased ? '#16a34a' : '#dc2626',
                                    }}>
                                        {user.purchased ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    {user.purchased ? (
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 10px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: user.source === 'trial_first' ? '#eff6ff' : '#faf5ff',
                                            color: user.source === 'trial_first' ? '#1d4ed8' : '#7c3aed',
                                        }}>
                                            {user.source === 'trial_first' ? 'Free trial → Bought' : 'Bought → Scanned'}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.btnSend}
                                        onClick={() => handleSend([user.phone])}
                                        disabled={sending}
                                    >
                                        Send
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: '16px', color: '#9ca3af', fontSize: '12px' }}>
                Total: {users.length} user{users.length !== 1 ? 's' : ''}
            </p>
        </div>
    );
}

const styles = {
    loginWrap: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
    },
    loginCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '360px',
    },
    loginTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '4px',
        color: '#111827',
    },
    loginSub: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '24px',
    },
    wrap: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#111827',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '700',
        marginBottom: '4px',
    },
    subtitle: {
        color: '#6b7280',
        fontSize: '14px',
    },
    templateBox: {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#6b7280',
        marginBottom: '16px',
    },
    templateRow: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#f9fafb',
    },
    bulkBar: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    bulkCount: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginRight: '4px',
    },
    btnPrimary: {
        padding: '10px 20px',
        backgroundColor: '#1d4ed8',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnSecondary: {
        padding: '10px 20px',
        backgroundColor: '#fff',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnSend: {
        padding: '6px 16px',
        backgroundColor: '#059669',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    resultsBox: {
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '24px',
        fontSize: '14px',
    },
    errorText: {
        color: '#dc2626',
        fontSize: '13px',
        marginTop: '4px',
    },
    tableWrap: {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    thead: {
        backgroundColor: '#f9fafb',
    },
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#6b7280',
        borderBottom: '1px solid #e5e7eb',
    },
    tr: {
        borderBottom: '1px solid #f3f4f6',
    },
    td: {
        padding: '14px 16px',
        fontSize: '14px',
        verticalAlign: 'middle',
    },
    dayBadge: {
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
    },
};
