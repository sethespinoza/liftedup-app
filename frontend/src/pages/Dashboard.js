import React, { useState, useEffect } from 'react';
import API from '../api';

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [prs, setPrs] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // fetch workouts and PRs when page loads
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const workoutsRes = await API.get('/workouts/');
            const prsRes = await API.get('/prs/');
            setWorkouts(workoutsRes.data.slice(-5).reverse()); // last 5 workouts
            setPrs(prsRes.data);
            // get username from token
            const token = localStorage.getItem('token');
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsername(payload.sub);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'
    };

    return (
        <div style={styles.container}>
            {/* header */}
            <div style={styles.header}>
                <h1 style={styles.logo}>LiftedUp</h1>
                <div style={styles.nav}>
                    <span style={styles.navLink} onClick={() => window.location.href = '/log'}>
                        Log Workout
                    </span>
                    <span style={styles.navLink} onClick={() => window.location.href = '/leaderboard'}>
                        Leaderboard
                    </span>
                    <span style={styles.navLink} onClick={handleLogout}>
                        Logout
                    </span>
                </div>
            </div>

            {/* welcome */}
            <div style={styles.content}>
                <h2 style={styles.welcome}>Welcome back, {username} 💪</h2>

                {/* personal records */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Your PRs</h3>
                    {prs.length === 0 ? (
                        <p style={styles.empty}>No PRs yet — log a workout to get started</p>
                    ) : (
                        <div style={styles.grid}>
                            {prs.map((pr) => (
                                <div key={pr.id} style={styles.prCard}>
                                    <p style={styles.prExercise}>{pr.exercise}</p>
                                    <p style={styles.prWeight}>{pr.weight} lbs</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* recent workouts */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Recent Workouts</h3>
                    {workouts.length === 0 ? (
                        <p style={styles.empty}>No workouts logged yet</p>
                    ) : (
                        <div style={styles.workoutList}>
                            {workouts.map((w) => (
                                <div key={w.id} style={styles.workoutCard}>
                                    <p style={styles.workoutExercise}>{w.exercise}</p>
                                    <p style={styles.workoutDetails}>
                                        {w.sets} sets × {w.reps} reps @ {w.weight} lbs
                                    </p>
                                    <p style={styles.workoutDate}>
                                        {new Date(w.logged_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
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
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
    },
    welcome: {
        color: 'white',
        marginBottom: '2rem',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        color: '#e8ff47',
        marginBottom: '1rem',
    },
    empty: {
        color: '#666',
        fontStyle: 'italic',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
    },
    prCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '1rem',
        border: '1px solid #333',
    },
    prExercise: {
        color: '#888',
        fontSize: '0.8rem',
        margin: '0 0 0.5rem 0',
        textTransform: 'capitalize',
    },
    prWeight: {
        color: '#e8ff47',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: 0,
    },
    workoutList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    workoutCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '1rem',
        border: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    workoutExercise: {
        color: 'white',
        margin: 0,
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    workoutDetails: {
        color: '#888',
        margin: 0,
        fontSize: '0.9rem',
    },
    workoutDate: {
        color: '#555',
        margin: 0,
        fontSize: '0.8rem',
    },
};

export default Dashboard;