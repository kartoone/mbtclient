import { Button, Image, StyleSheet, Platform, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <ThemedText>
          This client app lets you test the OAuth process using the client_id and client_secret you received from MyBikeTraffic.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 0: Register for a client</ThemedText>
        <ThemedText>
          If you haven't already, request a client_id and client_secret from the MyBikeTraffic website.
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.mybiketraffic.com/clients/request')}>
          <Text style={styles.buttonText}>mybiketraffic.com</Text>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Authorization</ThemedText>
        <ThemedText>
          Inside your app or website, display a link or button for users to click that will take them to the mybiketraffic website to authorize
          your app to use the mybiketraffic API on your users' behalf. An example link is shown below. Click the Step 1 tab to try it with your client credentials.
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          https://www.mybiketraffic.com/clients/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stepContainer: {
    paddingHorizontal: 16,   // Add padding on the sides
    paddingVertical: 8,     // Add padding on top and bottom
    gap: 8,                 // Increase gap between text and button
    marginBottom: 0,        // Increase spacing between sections
    backgroundColor: '#fff', // Optional: Add background color to make each section distinct
    borderRadius: 8,         // Optional: Add rounded corners to each section
    shadowColor: '#000',     // Optional: Add shadow for depth (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,            // Optional: Elevation for Android shadow
  },
  reactLogo: {
    height: 78,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
