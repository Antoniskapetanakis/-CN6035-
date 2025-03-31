import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us!</Text>
      <Text style={styles.description}>
        Welcome to the Reserveat App! Our mission is to make restaurant reservations easier and more convenient for everyone.
        Whether you're looking to reserve a table for two or a large group, we provide you with a seamless experience from search to booking.
      </Text>
      <Text style={styles.contact}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 35,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 30,
    color: '#FFF',
    marginBottom: 20, 
	    fontWeight: 'bold',
  },
  contact: {
    fontSize: 30,
    color: '#FFF',
    textAlign: 'center', 
	  fontWeight: 'bold',
  },
});

export default AboutScreen;
