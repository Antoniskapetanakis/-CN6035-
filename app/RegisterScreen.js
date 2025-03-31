import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    console.log('RegisterScreen component rendered');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = useCallback(async () => {
        console.log('handleRegister called');
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required!");
            setSuccessMessage('');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setSuccessMessage('');
            return;
        }

        if (password.length < 6) { 
            setError("Password must be at least 6 characters long.");
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        console.log('Attempting registration with:', { name, email, password });

        try {
            const response = await fetch("http://192.168.1.11:3000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            console.log('Register Response Status:', response.status);
            const data = await response.json();
            console.log('Register Response Data:', data);

            if (response.ok) {
                console.log('Registration successful:', data);
                setSuccessMessage("Your account has been created successfully!");
                setTimeout(() => {
                    console.log('Navigating to login screen after successful registration');
                    navigation.navigate("login");
                }, 1500);
            } else {
                console.error('Registration failed:', data);
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Could not connect to the server. Please check your internet connection and try again.");
        } finally {
            setLoading(false);
            console.log('Registration process finished, loading set to false');
        }
    }, [name, email, password, confirmPassword, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Welcome to ReservEat!</Text>
            <Text style={styles.title}>Create an Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() => {
                    console.log('Navigating to login screen');
                    navigation.navigate('login');
                }}
                disabled={loading}
            >
                <Text style={styles.linkText}>Already have an account? Login here</Text>
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

export default RegisterScreen;