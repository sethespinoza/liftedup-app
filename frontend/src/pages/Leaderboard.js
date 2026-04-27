import React, { useState } from 'react';
import API from '../api';

function Leaderboard() {
    const [exercise, setExercise] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const [percentile, setPercentile] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!exercise) return;
        setError('');
        setLeaderboard([]);
        setPercentile(null);

        try {
            // get global leaderboard
            const lbRes = await API.get(`/leaderboard/global/${exercise.toLowerCase()}`);
            setLeaderboard(lbRes.data.leaderboard);
        } catch (err) {
            setError('No lifts found for this exercise yet');
        }

        try {
            // get percentile ranking
            const pRes = await API.get(`/leaderboard/percentile/${exercise.toLowerCase()}`);
            setPercentile(pRes.data);
        } catch (err) {
            // percentile may not be available for all exercises
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.logo}>LiftedUp</h1>
                <div style={styles.nav}>
                    <span style={styles.navLink} onClick={() => window.location.href = '/dashboard'}>
                        Dashboard
                    </span>
                    <span style={styles.navLink} onClick={() => window.location.href = '/log'}>
                        Log Workout
                    </span>
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.title}>Leaderboard</h2>

                {/* search */}
                <div style={styles.searchRow}>
                    <input
                        style={styles.input}
                        placeholder="Enter exercise (e.g. bench press)"
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button style={styles.button} onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {/* percentile card */}
                {percentile && (
                    <div style={styles.percentileCard}>
                        <p style={styles.percentileLabel}>Your {percentile.exercise} PR</p>
                        <p style={styles.percentileWeight}>{percentile.your_pr} lbs</p>
                        <p style={styles.percentileRank}>
                            Stronger than <span style={styles.percentileHighlight}>{percentile.percentile}%</span> of lifters
                        </p>
                        <p style={styles.percentileLevel}>Level: {percentile.level}</p>
                    </div>
                )}

                {/* global leaderboard */}
                {leaderboard.length > 0 && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Top Lifters — {exercise}</h3>
                        {leaderboard.map((entry) => (
                            <div key={entry.rank} style={styles.row}>
                                <span style={entry.rank === 1 ? styles.goldRank : styles.rank}>
                                    #{entry.rank}
                                </span>
                                <span style={styles.username}>{entry.username}</span>
                                <span style={styles.weight}>{entry.weight} lbs</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        fontFamily: 'sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
    },
    logo: {
        color: '#e8ff47',
        margin: 0,
        fontSize: '1.5rem',
    },
    nav: {
        display: 'flex',
        gap: '1.5rem',
    },
    navLink: {
        color: '#888',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    content: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        color: 'white',
        marginBottom: '1.5rem',
    },
    searchRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    input: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#262626',
        color: 'white',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: '#e8ff47',
        color: '#0f0f0f',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
    },
    error: {
        color: '#ff4d4d',
    },
    percentileCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #e8ff47',
        textAlign: 'center',
    },
    percentileLabel: {
        color: '#888',
        margin: '0 0 0.5rem 0',
        textTransform: 'capitalize',
    },
    percentileWeight: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
    },
    percentileRank: {
        color: 'white',
        margin: '0 0 0.25rem 0',
    },
    percentileHighlight: {
        color: '#e8ff47',
        fontWeight: 'bold',
        fontSize: '1.2rem',
    },
    percentileLevel: {
        color: '#888',
        margin: 0,
        textTransform: 'capitalize',
    },
    section: {
        marginTop: '1rem',
    },
    sectionTitle: {
        color: '#e8ff47',
        marginBottom: '1rem',
        textTransform: 'capitalize',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.5rem',
        border: '1px solid #333',
    },
    rank: {
        color: '#888',
        fontWeight: 'bold',
        width: '2rem',
    },
    goldRank: {
        color: '#e8ff47',
        fontWeight: 'bold',
        width: '2rem',
    },
    username: {
        color: 'white',
        flex: 1,
    },
    weight: {
        color: '#e8ff47',
        fontWeight: 'bold',
    },
};

export default Leaderboard;