import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    console.log('LoginScreen component rendered');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = useCallback(async () => {
        console.log('handleLogin called');
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!email || !password) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        console.log('Attempting login with:', { email, password });

        try {
            const response = await fetch("http://192.168.1.11:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            console.log('Login Response Status:', response.status);
            const data = await response.json();
            console.log('Login Response Data:', data);

            if (response.ok) {
                console.log('Login successful, received data:', data);
                if (data.token && data.username && data.userId) {
                    console.log('Storing token, username, and userId in AsyncStorage');
                    await AsyncStorage.setItem('token', data.token);
                    await AsyncStorage.setItem('username', data.username);
                    await AsyncStorage.setItem('user_id', String(data.userId));
                    console.log('Data stored successfully in AsyncStorage');

                    setSuccessMessage("Login successful! Redirecting to home...");
                    setTimeout(() => {
                        console.log('Navigating to home screen after successful login');
                        navigation.reset({ index: 0, routes: [{ name: "home" }] });
                    }, 1500);
                } else {
                    console.warn("Login successful, but token or user data missing.");
                    setError("Login successful, but token or user data missing. Please try again.");
                }
            } else {
                console.error('Login failed:', data);
                setError(data.error || 'Invalid email or password.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Could not connect to the server. Please check your internet connection and try again.");
        } finally {
            setLoading(false);
            console.log('Login process finished, loading set to false');
        }
    }, [email, password, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Welcome Back to ReservEat!</Text>
            <Text style={styles.title}>Login to Your Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() => navigation.navigate('register')}
                disabled={loading}
            >
                <Text style={styles.linkText}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'black',
    },
    mainTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFD700',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'white',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007BFF',
        fontSize: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    success: {
        color: 'green',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LoginScreen;