import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.description}>
        Feel free to reach out to us with any questions or feedback!
      </Text>
      <Text style={styles.contactInfo}>
        Email: support@reserveat.com
        {'\n'}Phone: 123-456-7890
      </Text>
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
    fontSize: 25,
    color: '#FFF',
    marginBottom: 20, 
	 fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 25,
    color: '#FFF',
    textAlign: 'center', 
	 fontWeight: 'bold',
  },
});

export default ContactScreen;
