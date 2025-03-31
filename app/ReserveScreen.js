import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReserveScreen = ({ route }) => {
    const navigation = useNavigation();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [peopleCount, setPeopleCount] = useState('');
    const [userId, setUserId] = useState('');
    const [fullName, setFullName] = useState('');
    const [restaurantId, setRestaurantId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reservationIdToEdit, setReservationIdToEdit] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isEditing ? 'Edit Reservation' : 'Make Reservation',
            headerStyle: { backgroundColor: 'black' },
            headerTintColor: 'gold',
            headerBackTitleVisible: false,
        });
    }, [navigation, isEditing]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('user_id');
                setUserId(storedUserId || '');
            } catch (error) {
                console.error("Error loading user ID:", error);
            }

            if (route.params?.restaurantId) {
                setRestaurantId(route.params.restaurantId.toString());
            }

            if (route.params?.reservation) {
                const { id, reservation_date, reservation_time, people_count, full_name, restaurant_id } = route.params.reservation;
                setIsEditing(true);
                setReservationIdToEdit(id);
                setDate(reservation_date.split('T')[0]); 
                setTime(reservation_time.slice(0, 5));
                setPeopleCount(people_count.toString());
                setFullName(full_name);
                setRestaurantId(restaurant_id.toString());
            } else {
                setIsEditing(false);
                setReservationIdToEdit(null);
                setDate('');
                setTime('');
                setPeopleCount('');
                setFullName('');
                setRestaurantId(route.params?.restaurantId ? route.params.restaurantId.toString() : '');
            }
        };
        loadUserData();
    }, [route.params]);

    const handleReservation = async () => {
        if (!userId || !fullName || !date || !time || !peopleCount || !restaurantId) {
            setSuccessMessage('❌ Please fill in all fields');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!dateRegex.test(date)) {
            setSuccessMessage('❌ Invalid date format (YYYY-MM-DD)');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }
        if (!timeRegex.test(time)) {
            setSuccessMessage('❌ Invalid time format (HH:MM)');
            setTimeout(() => setSuccessMessage(''), 3000);
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);
		
        const combinedDateTime = `${date}T${time}:00.000Z`;
        const reservationData = {
            restaurantId: parseInt(restaurantId),
            reservation_date: combinedDateTime,
            reservation_time: `${time}:00`, 
            people_count: parseInt(peopleCount),
            full_name: fullName,
        };
        console.log('Reservation Data:', reservationData);

        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error('No JWT token found. Please log in again.');
            }
            const apiUrl = isEditing && reservationIdToEdit
                ? `http://192.168.1.11:3000/api/reservations/${reservationIdToEdit}`
                : 'http://192.168.1.11:3000/api/reservations';
            const method = isEditing && reservationIdToEdit ? 'PUT' : 'POST';

            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reservationData),
            });

            const responseText = await response.text();
            console.log('Raw Backend Response:', responseText);

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed Backend Response:', data);

                if (response.ok) {
                    setSuccessMessage(`✅ Reservation ${isEditing ? 'updated' : 'created'} successfully!`);
                    setFullName('');
                    setDate('');
                    setTime('');
                    setPeopleCount('');
                    setRestaurantId(''); 
                    setIsEditing(false);
                    setReservationIdToEdit(null);

                    setTimeout(() => {
                        setSuccessMessage('');
                        navigation.goBack();
                    }, 3000);
                } else {
                    setSuccessMessage(`❌ Reservation Failed: ${data.message || 'An error occurred.'}`);
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                setSuccessMessage('❌ Error processing server response.');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error.message);
            setSuccessMessage(`❌ ${error.message}`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isEditing ? 'Edit Reservation' : 'Make a Reservation'}:</Text>

            {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#ccc"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />
            <Text style={styles.label}>User ID:</Text>
            <TextInput
                placeholder="Enter your user ID"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={userId}
                onChangeText={setUserId}
                style={styles.input}
                editable={false} 
            />
            <Text style={styles.label}>Restaurant ID:</Text>
            <TextInput
                placeholder="Enter Restaurant ID"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={restaurantId}
                onChangeText={setRestaurantId}
                style={styles.input}
                editable={!route.params?.restaurantId && !route.params?.reservation} 
            />
            <Text style={styles.label}>Date:</Text>
            <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#ccc"
                value={date}
                onChangeText={setDate}
                style={styles.input}
            />
            <Text style={styles.label}>Time:</Text>
            <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#ccc"
                value={time}
                onChangeText={setTime}
                style={styles.input}
            />
            <Text style={styles.label}>Number of People:</Text>
            <TextInput
                placeholder="Number of people"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={peopleCount}
                onChangeText={setPeopleCount}
                style={styles.input}
            />
            <TouchableOpacity
                style={[styles.reserveButton, isProcessing && { backgroundColor: '#666' }]}
                onPress={handleReservation}
                disabled={isProcessing}
            >
                <Text style={styles.reserveButtonText}>{isProcessing ? 'Saving...' : (isEditing ? 'Update Reservation' : 'Reserve')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#000', padding: 20 },
    title: { fontSize: 40, color: 'gold', fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    label: { fontSize: 22, color: 'white', marginBottom: 10, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    reserveButton: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'gold',
        marginTop: 10,
    },
    reserveButtonText: { color: 'gold', fontSize: 22, fontWeight: 'bold' },
    successMessage: {
        color: 'lime',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
});

export default ReserveScreen;