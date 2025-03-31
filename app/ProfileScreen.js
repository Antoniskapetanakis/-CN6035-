
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ route, navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [profileSuccessMessage, setProfileSuccessMessage] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('user_id');
            if (!token || !storedUserId) {
                setErrorMessage('Authentication error. Please log in again.');
                return;
            }

            const response = await fetch(`http://192.168.1.11:3000/api/users/profile/${storedUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setEmail(data.email);
                setUserId(data.id.toString());
                setEditUsername(data.username);
                setEditEmail(data.email);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to load profile data from server.');
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setErrorMessage('Could not connect to the server to load profile data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfileData();
            return () => {
            };
        }, [fetchProfileData])
    );

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleCancelEditProfile = () => {
        setIsEditingProfile(false);
        setEditUsername(username);
        setEditEmail(email);
        setProfileSuccessMessage('');
        setErrorMessage('');
    };
    const handleSaveProfile = async () => {
        setLoading(true);
        setErrorMessage('');
        setProfileSuccessMessage('');
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setErrorMessage('Authentication error. Please log in again.');
                setLoading(false);
                return;
            }
            const response = await fetch('http://192.168.1.11:3000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: editUsername, email: editEmail }),
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(editUsername);
                setEmail(editEmail);
                setIsEditingProfile(false);
                setProfileSuccessMessage(data.message || 'Profile updated successfully!');
                await AsyncStorage.setItem('username', editUsername);
                await AsyncStorage.setItem('email', editEmail);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMessage('Could not connect to the server to update profile.');
        } finally {
            setLoading(false);
        }
    };
    const handleOpenChangePassword = () => {
        setIsChangingPassword(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordErrorMessage('');
        setPasswordSuccessMessage('');
    };
    const handleCancelChangePassword = () => {
        setIsChangingPassword(false);
    };
    const handleChangePassword = async () => {
        setPasswordLoading(true);
        setPasswordErrorMessage('');
        setPasswordSuccessMessage('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordErrorMessage('All password fields are required.');
            setPasswordLoading(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordErrorMessage('New passwords do not match.');
            setPasswordLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setPasswordErrorMessage('New password must be at least 6 characters long.');
            setPasswordLoading(false);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setPasswordErrorMessage('Authentication error. Please log in again.');
                setPasswordLoading(false);
                return;
            }
            const response = await fetch('http://192.168.1.11:3000/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            if (response.ok) {
                const data = await response.json();
                setPasswordSuccessMessage(data.message || 'Password changed successfully!');
                setIsChangingPassword(false);
            } else {
                const errorData = await response.json();
                setPasswordErrorMessage(errorData.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setPasswordErrorMessage('Could not connect to the server to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="gold" /></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            {profileSuccessMessage ? <Text style={styles.success}>{profileSuccessMessage}</Text> : null}

            {isEditingProfile ? (
                <View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput
                            style={styles.input}
                            value={editUsername}
                            onChangeText={setEditUsername}
                            placeholder="New Username"
                            placeholderTextColor="#ccc"
                        />
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            value={editEmail}
                            onChangeText={setEditEmail}
                            placeholder="New Email"
                            placeholderTextColor="#ccc"
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.editButtons}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
                            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEditProfile} disabled={loading}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.label}>Username:</Text>
                        <Text style={styles.value}>{username}</Text>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{email}</Text>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.label}>User ID:</Text>
                        <Text style={styles.value}>{userId}</Text>
                    </View>
                    <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile} disabled={loading
}>
                            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                )}

            <View style={styles.changePasswordSection}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                {passwordErrorMessage ? <Text style={styles.error}>{passwordErrorMessage}</Text> : null}
                {passwordSuccessMessage ? <Text style={styles.success}>{passwordSuccessMessage}</Text> : null}
                {!isChangingPassword ? (
                    <TouchableOpacity style={styles.changePasswordButton} onPress={handleOpenChangePassword} disabled={passwordLoading}>
                        <Text style={styles.changePasswordButtonText}>Change Password</Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Current Password"
                            secureTextEntry={true}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholderTextColor="#ccc"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="New Password (min 6 characters)"
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholderTextColor="#ccc"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm New Password"
                            secureTextEntry={true}
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            placeholderTextColor="#ccc"
                        />
                        <View style={styles.editButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleChangePassword}
                                disabled={passwordLoading}
                            >
                                <Text style={styles.saveButtonText}>{passwordLoading ? 'Changing...' : 'Save'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancelChangePassword}
                                disabled={passwordLoading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'gold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileDetails: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#ddd',
    },
    input: {
        backgroundColor: '#333',
        color: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 18,
        marginBottom: 10,
    },
    editProfileButton: {
        backgroundColor: 'gold',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    editProfileButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: 'green',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    changePasswordSection: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#222',
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'gold',
        marginBottom: 15,
        textAlign: 'center',
    },
    changePasswordButton: {
        backgroundColor: 'gold',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    changePasswordButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    reservationsSection: {
        marginBottom: 20,
    },
    reservationItem: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    reservationItemText: {
        color: 'white',
        fontSize: 16,
    },
    pastReservationItem: {
        backgroundColor: '#555',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    pastReservationItemText: {
        color: '#ddd',
        fontSize: 16,
    },
    emptyMessage: {
        color: '#777',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: 'orange',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 10,
    },
    editButtonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;