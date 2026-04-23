import React, { useState} from 'react';
import API from '../api';

function LogWorkout() {
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            await API.post('/workouts/', {
                exercise: exercise.toLowerCase(),
                sets: parseInt(sets),
                reps: parseInt(reps),
                weight: parseFloat(weight)
            });
            setSuccess(`${exercise} logged successfully!`);
            setExercise('');
            setSets('');
            setReps('');
            setWeight('');
        } catch (err) {
            setError('Failed to log workout');
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
                    <span style={styles.navLink} onClick={() => window.location.href = '/leaderboard'}>
                        Leaderboard
                    </span>
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.title}>Log a Workout</h2>
                {success && <p style={styles.success}>{success}</p>}
                {error && <p style={styles.error}>{error}</p>}
                <div style={styles.card}>
                    <input
                        style={styles.input}
                        placeholder="Exercise (e.g. bench press)"
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        placeholder="Sets"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        placeholder="Reps"
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        placeholder="Weight (lbs)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                    <button style={styles.button} onClick={handleSubmit}>
                        Log Workout
                    </button>
                </div>
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
        maxWidth: '500px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        color: 'white',
        marginBottom: '1.5rem',
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid #333',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#262626',
        color: 'white',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        borderRadius: '8px',
        backgroundColor: '#e8ff47',
        color: '#0f0f0f',
        fontWeight: 'bold',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
    },
    success: {
        color: '#47ff6e',
        marginBottom: '1rem',
    },
    error: {
        color: '#ff4d4d',
        marginBottom: '1rem',
    },
};

export default LogWorkout;