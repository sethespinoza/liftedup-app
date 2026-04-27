import React, { useState } from 'react';
import API from '../api';

function Rankings() {
    const [exercise, setExercise] = useState('');
    const [percentile, setPercentile] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!exercise) return;
        setError('');
        setPercentile(null);

        try {
            // fetch percentile ranking from backend
            const pRes = await API.get(`/leaderboard/percentile/${exercise.toLowerCase()}`);
            setPercentile(pRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'No data found for this exercise');
        }
    };

    return (
        <div style={styles.container}>
            {/* header */}
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
                <h2 style={styles.title}>How Do You Stack Up?</h2>
                <p style={styles.subtitle}>Compare your lifts against strength standards</p>

                {/* search bar */}
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

                {/* currently supported exercises */}
                <p style={styles.supported}>Supported: bench press</p>

                {error && <p style={styles.error}>{error}</p>}

                {/* percentile result card */}
                {percentile && (
                    <div style={styles.percentileCard}>
                        <p style={styles.percentileLabel}>Your {percentile.exercise} PR</p>
                        <p style={styles.percentileWeight}>{percentile.your_pr} lbs</p>
                        <p style={styles.percentileRank}>
                            Stronger than <span style={styles.percentileHighlight}>{percentile.percentile}%</span> of lifters
                        </p>
                        <p style={styles.percentileLevel}>Level: {percentile.level}</p>

                        {/* standards breakdown at your bodyweight */}
                        <div style={styles.standards}>
                            <p style={styles.standardsTitle}>Standards at your bodyweight</p>
                            <div style={styles.standardsGrid}>
                                {Object.entries(percentile.standards).map(([level, weight]) => (
                                    <div key={level} style={styles.standardItem}>
                                        <p style={styles.standardLevel}>{level}</p>
                                        <p style={styles.standardWeight}>{weight} lbs</p>
                                    </div>
                                ))}
                            </div>
                        </div>
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
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#888',
        marginBottom: '1.5rem',
    },
    searchRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '0.5rem',
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
    supported: {
        color: '#555',
        fontSize: '0.8rem',
        marginBottom: '1.5rem',
    },
    error: {
        color: '#ff4d4d',
    },
    percentileCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '1.5rem',
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
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
    },
    percentileRank: {
        color: 'white',
        margin: '0 0 0.25rem 0',
        fontSize: '1.1rem',
    },
    percentileHighlight: {
        color: '#e8ff47',
        fontWeight: 'bold',
        fontSize: '1.4rem',
    },
    percentileLevel: {
        color: '#888',
        margin: '0 0 1.5rem 0',
        textTransform: 'capitalize',
    },
    standards: {
        borderTop: '1px solid #333',
        paddingTop: '1rem',
    },
    standardsTitle: {
        color: '#888',
        fontSize: '0.8rem',
        marginBottom: '0.75rem',
    },
    standardsGrid: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    standardItem: {
        textAlign: 'center',
    },
    standardLevel: {
        color: '#555',
        fontSize: '0.7rem',
        margin: '0 0 0.25rem 0',
        textTransform: 'capitalize',
    },
    standardWeight: {
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        margin: 0,
    },
};

export default Rankings;