import React, { useState } from 'react';
import API from '../api';

function Login() {
    // state for the form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            // OAuth2 expects form data not JSON
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await API.post('/users/login', formData);

            // save token to localStorage
            localStorage.setItem('token', response.data.access_token);

            // redirect to dashboard
            window.location.href = '/dashboard';
        } catch(err) {
            setError('Invalid username or password');
        }
    };
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>LiftedUp</h1>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Log In</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    style={styles.input}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={styles.button} onClick={handleLogin}>
                    Log In
                </button>
                <p style={styles.link}>
                    Don't have an account?{' '}
                    <span style={styles.linkText} onClick={() => window.location.href = '/signup'}>
                        Sign up
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

export default Login;