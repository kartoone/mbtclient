import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Linking, Button, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function AxiosScreen() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [origToken, setOrigToken] = useState('');
  const [origRefreshToken, setOrigRefreshToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadStoredValues = async () => {
      const storedClientId = await AsyncStorage.getItem('clientId');
      const storedClientSecret = await AsyncStorage.getItem('clientSecret');
      const storedRedirectUri = await AsyncStorage.getItem('redirectUri');
      if (storedClientId) setClientId(storedClientId);
      if (storedClientSecret) setClientSecret(storedClientSecret);
      if (storedRedirectUri) setRedirectUri(storedRedirectUri);
    };

    loadStoredValues();

    const handleUrl = (event: { url: any }) => {
      const { url } = event;
      if (url.startsWith('mbtclient://axios')) {
        const code = new URL(url).searchParams.get('code');
        if (code) {
          setExpanded(true);
          // Handle the authorization code
          console.log('Authorization code:', code);
          setAuthorizationCode(code);
          // Navigate to another screen or perform other actions
          router.replace({ pathname: '/axios', params: { code } });
        }
      }
    };

    Linking.addEventListener('url', handleUrl);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  const handleClientIdChange = async (text: string) => {
    setClientId(text);
    await AsyncStorage.setItem('clientId', text);
  };

  const handleClientSecretChange = async (text: string) => {
    setClientSecret(text);
    await AsyncStorage.setItem('clientSecret', text);
  };

  const handleRedirectUriChange = async (text: string) => {
    setRedirectUri(text);
    await AsyncStorage.setItem('redirectUri', text);
  };

  const exchangeAuthorizationCode = async () => {
    try {
      console.log('clientId:', clientId);
      console.log('clientSecret:', clientSecret);
      console.log('authorizationCode:', authorizationCode);

      const response = await axios.post(
        'https://www.mybiketraffic.com/clients/access_token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: authorizationCode,
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Response:', response.data);
      const { access_token, refresh_token } = response.data;
      setAccessToken(access_token);
      setOrigToken(access_token);
      setOrigRefreshToken(refresh_token);
      setRefreshToken(refresh_token);
      console.log('Access token:', access_token);
      console.log('Refresh token:', refresh_token);
    } catch (error) {
      console.error('Failed to exchange authorization code:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        'https://www.mybiketraffic.com/clients/access_token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Response:', response.data);
      const { access_token, refresh_token } = response.data;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      console.log('New access token:', access_token);
      console.log('New refresh token:', refresh_token);
    } catch (error) {
      console.error('Failed to refresh access token:', error);
    }
  };

  const apiListRides = async () => {
    try {
      const response = await axios.get('https://www.mybiketraffic.com/clients/api_listrides', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Fetched JSON data:', response.data);
      setJsonData(response.data);
    } catch (error) {
      console.error('Failed to fetch JSON data:', error);
    }
  };

  const JSONDATA = {}
  
  const apiAddRide = async () => {
    try {
      const response = await axios.post('https://www.mybiketraffic.com/clients/api_listrides', JSONDATA, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Response:', response.data);
      setJsonData(response.data);
    } catch (error) {
      console.error('Failed to add ride:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Using Axios to Complete OAuth</ThemedText>
      </ThemedView>
      <ThemedText>This tab lets you test your client params.</ThemedText>
      <Collapsible title="Step 1: Initial authorization link">
        <ThemedText>
          Change the params in the boxes and see the link that is generated. Click the link to see the authorization page.
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Client ID"
          value={clientId}
          onChangeText={handleClientIdChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Client Secret"
          value={clientSecret}
          onChangeText={handleClientSecretChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Redirect URI"
          value={redirectUri}
          onChangeText={handleRedirectUriChange}
        />
        <ExternalLink href={`https://www.mybiketraffic.com/clients/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`}>
          <ThemedText type="link">{`https://www.mybiketraffic.com/clients/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Step 2: Exchange Authorization Code" isOpen={expanded}>
        <ThemedText>
          Click the button below to exchange the authorization code for an access token.
        </ThemedText>
        <Button title="Exchange Authorization Code" onPress={exchangeAuthorizationCode} />
          <ThemedText>Authorization Code: {authorizationCode}</ThemedText>
        {accessToken ? (
          <ThemedText>Original Access Token: {origToken}</ThemedText>
        ) : null}
        {refreshToken ? (
          <ThemedText>Original Refresh Token: {origRefreshToken}</ThemedText>
        ) : null}
      </Collapsible>
      <Collapsible title="Step 3: Refresh Access Token" isOpen={expanded}>
        <ThemedText>
          Click the button below to refresh the access token using the refresh token.
        </ThemedText>
        <Button title="Refresh Access Token" onPress={refreshAccessToken} />
        {accessToken ? (
          <ThemedText>New Access Token: {accessToken}</ThemedText>
        ) : null}
        {refreshToken ? (
          <ThemedText>New Refresh Token: {refreshToken}</ThemedText>
        ) : null}
      </Collapsible>
      <Collapsible title="Step 4: Fetch JSON Data" isOpen={expanded}>
        <ThemedText>
          Click the button below to fetch JSON data using the access token.
        </ThemedText>
        <Button title="Fetch JSON Data" onPress={apiListRides} />
        {jsonData ? (
          <ScrollView style={styles.jsonContainer}>
            <ThemedText>{JSON.stringify(jsonData, null, 2)}</ThemedText>
          </ScrollView>
        ) : null}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  jsonContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});