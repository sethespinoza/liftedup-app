import React, { useState } from 'react';
import API from '../api';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            await API.post('/users/signup', { username, email, password });
            // after signup, log them in automatically
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await API.post('/users/login', formData);
            localStorage.setItem('token', response.data.access_token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>LiftedUp</h1>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Create Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={styles.button} onClick={handleSignup}>
                    Create Account
                </button>
                <p style={styles.link}>
                    Already have an account?{' '}
                    <span style={styles.linkText} onClick={() => window.location.href = '/login'}>
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0f0f0f',
    },
    title: {
        color: '#e8ff47',
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontFamily: 'sans-serif',
    },
    card: {
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    subtitle: {
        color: 'white',
        margin: 0,
        fontFamily: 'sans-serif',
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
    error: {
        color: '#ff4d4d',
        margin: 0,
        fontSize: '0.875rem',
    },
    link: {
        color: '#888',
        textAlign: 'center',
        fontSize: '0.875rem',
    },
    linkText: {
        color: '#e8ff47',
        cursor: 'pointer',
    }
};

export default Signup;