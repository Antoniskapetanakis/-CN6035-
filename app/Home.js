import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
ActivityIndicator, Image, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 

const HomeScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [reservations, setReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flatListWidth, setFlatListWidth] = useState(0);
    const [fetchError, setFetchError] = useState(null); 

    const loadUserData = useCallback(async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedUserId = await AsyncStorage.getItem('user_id');
            setUsername(storedUsername || '');
            setEmail(storedEmail || '');
            setUserId(storedUserId || '');
        } catch (error) {
            console.error("Error loading user data:", error);
            Alert.alert('Error', 'Could not load user data.');
        }
    }, []);
    const fetchUserReservations = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const currentUserId = await AsyncStorage.getItem('user_id');
            if (!currentUserId || !token) {
                return; 
            }
            const res = await fetch(`http://192.168.1.11:3000/api/reservations/user/${currentUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error fetching reservations:", errorData);
                setFetchError('Failed to fetch reservations.');
                return;
            }
            const data = await res.json();
            const current = data.current.map(r => ({ ...r, date: r.reservation_date }));
            const past = data.past.map(r => ({ ...r, date: r.reservation_date }));

            setReservations(current);
            setPastReservations(past);
            setFetchError(null);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            setFetchError('Could not connect to the server to fetch reservations.');
        }
    }, []);

    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const response = await fetch('http://192.168.1.11:3000/api/restaurants');
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching restaurants:', errorData);
                setFetchError('Failed to fetch restaurants.');
                setLoading(false);
                return;
            }
            const data = await response.json();
            setRestaurants(data);
            setLoading(false);
            setFetchError(null);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setFetchError('Could not connect to the server to fetch restaurants.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserData();
        fetchUserReservations();
        fetchRestaurants();
    }, [loadUserData, fetchUserReservations, fetchRestaurants]);

    useFocusEffect(
        useCallback(() => {
            loadUserData();
            fetchUserReservations();
            fetchRestaurants();
        }, [loadUserData, fetchUserReservations, fetchRestaurants])
    );

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.replace('login');
        } catch (error) {
            console.error("Logout error:", error);
            Alert.alert('Error', 'Could not log out.');
        }
    };
    const renderItem = ({ item }) => (
        <View style={styles.restaurantCard} width={flatListWidth}>
            {item.photographs ? (
                <Image
                    source={{ uri: `http://192.168.1.11:3000/images/${item.photographs}` }}
                    style={styles.image}
                />
            ) : (
                <Text style={{ color: 'white', textAlign: 'center', padding: 20 }}>No Image Available</Text>
            )}
            <Text style={styles.restaurantCardName}>{item.name}</Text>
            <Text style={styles.restaurantCardDetails}>Location: {item.location}</Text>
            <Text style={styles.restaurantCardDetails}>Description: {item.description}</Text>
            <Text style={styles.cardId}>ID: {item.restaurant_id}</Text>
            <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => navigation.navigate('reservation', { restaurantId: item.restaurant_id })}
            >
                <Text style={styles.reserveButtonText}>Reserve</Text>
            </TouchableOpacity>
        </View>
    );
    const handleProfileNavigation = () => {
        navigation.navigate('profile', { username, email, userId });
    };

    const handleAboutNavigation = () => {
        navigation.navigate('about');
    };

    const handleContactNavigation = () => {
        navigation.navigate('contact');
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToOffset({
                offset: (currentIndex - 1) * flatListWidth,
                animated: true,
            });
            setCurrentIndex(currentIndex - 1);
        }
    };
    const goToNext = () => {
        if (currentIndex < filteredRestaurants.length - 1) {
            flatListRef.current?.scrollToOffset({
                offset: (currentIndex + 1) * flatListWidth,
                animated: true,
            });
            setCurrentIndex(currentIndex + 1);
        }
    };

const handleDeleteReservation = async (reservationId, reservation) => {
        Alert.alert(
            'Delete Reservation',
            'Are you sure you want to delete this reservation?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (!token) {
                                Alert.alert('Error', 'Authentication token not found.');
                                return;
                            }

                            const res = await fetch(`http://192.168.1.11:3000/api/reservations/${reservationId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });

                            if (res.ok) {
                                Alert.alert('Success', 'Reservation deleted successfully.');
                           
                                setReservations(prevReservations =>
                                    prevReservations.filter(r => r.id !== reservationId)
                                );
                
                                setPastReservations(prevPastReservations => [reservation, ...prevPastReservations]);
                            } else {
                                const errorData = await res.json();
                                console.error('Error deleting reservation:', errorData);
                                Alert.alert('Error', errorData.message || 'Failed to delete reservation.');

                                fetchUserReservations();
                        }
                    } catch (error) {
                        console.error('Error deleting reservation:', error);
                        Alert.alert('Error', 'Could not connect to the server to delete reservation.');

                        fetchUserReservations();
                    }
                    },
                },
            ]
        );
    };
    const handleEditReservation = (reservation) => {
        navigation.navigate('reservation', { reservation });
    };

    const renderReservationItem = ({ item }) => (
        <View style={styles.reservationItem}>
            <Text style={styles.reservationItemText}>{item.restaurant_name || 'Restaurant ID:' + item.restaurant_id}</Text>
            <Text style={styles.reservationItemText}>Date: {item.date}</Text>
            <Text style={styles.reservationItemText}>Time: {item.reservation_time}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => handleEditReservation(item)}
                >
                    <Icon name="edit" size={20} color="gold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteReservation(item.id, item)}>
                    <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.mainTitle}>Reserveat!</Text>

            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, {username}!</Text>
                <View style={styles.menuButtons}>
                    <TouchableOpacity onPress={handleAboutNavigation} style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleContactNavigation} style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleProfileNavigation} style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search restaurants..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {fetchError ? <Text style={styles.error}>{fetchError}</Text> : null}

            {loading ? (
                <ActivityIndicator size="large" color="gold" />
            ) : (
                <FlatList
                    data={filteredRestaurants}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.restaurant_id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    ref={flatListRef}
                    onLayout={(event) => setFlatListWidth(event.nativeEvent.layout.width)}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.floor(event.nativeEvent.contentOffset.x / flatListWidth);
                        setCurrentIndex(newIndex);
                    }}
                />
            )}

           {filteredRestaurants.length > 0 && (
    <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={goToPrevious} disabled={currentIndex === 0} style={styles.arrowButton}>
            <Icon name="chevron-left" size={20} color={currentIndex === 0 ? '#555' : 'gold'} />
        </TouchableOpacity>
        <View style={styles.paginationDots}>
            {Array.from({ length: Math.min(3, filteredRestaurants.length) }).map((_, index) => {
                const startIndex = Math.max(0, currentIndex - 1);
                const dotIndex = startIndex + index;
                return (
                    dotIndex < filteredRestaurants.length && (
                        <View
                            key={dotIndex}
                            style={[
                                styles.paginationDot,
                                dotIndex === currentIndex ? styles.paginationDotActive : {},
                            ]}
                        />
                    )
                );
            })}
        </View>
        <TouchableOpacity
            onPress={goToNext}
            disabled={currentIndex === filteredRestaurants.length - 1}
            style={styles.arrowButton}
        >
            <Icon
                name="chevron-right"
                size={20}
                color={currentIndex === filteredRestaurants.length - 1 ? '#555' : 'gold'}
            />
        </TouchableOpacity>
    </View>
)}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Upcoming Reservations:</Text>
                {reservations.length === 0 ? (
                    <Text style={styles.emptyMessage}>No upcoming reservations.</Text>
                ) : (
                    <FlatList
                        data={reservations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderReservationItem}
                        ListEmptyComponent={<Text style={styles.emptyMessage}>No upcoming reservations.</Text>}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Past Reservations/History:</Text>
                {pastReservations.length === 0 ? (
                    <Text style={styles.emptyMessage}>No past reservations.</Text>
                ) : (
                    <FlatList
                        data={pastReservations}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderReservationItem}
                        ListEmptyComponent={<Text style={styles.emptyMessage}>No past reservations.</Text>}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
        paddingVertical: 20,
    },
    mainTitle: {
        color: 'gold',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    welcomeText: {
        color: 'gold',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    menuButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    menuButton: {
        backgroundColor: 'black',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    menuButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchInput: {
        backgroundColor: '#333',
        color: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 20,
        fontSize: 20,
    },
    restaurantCard: {
        backgroundColor: '#222',
        borderRadius: 10,
        marginHorizontal: 10,
        paddingBottom: 15,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover',
    },
    restaurantCardName: {
        color: 'gold',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    restaurantCardDetails: {
        color: '#ddd',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    cardId: {
        color: '#555',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    reserveButton: {
        backgroundColor: 'gold',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    reserveButtonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#888',
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: 'gold',
    },
    arrowButton: {
        padding: 10,
    },
    section: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    sectionTitle: {
        color: 'gold',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reservationItem: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reservationItemText: {
        color: 'white',
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
        marginVertical: 10,
    },
    reservationActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 15,
    },
});

export default HomeScreen;