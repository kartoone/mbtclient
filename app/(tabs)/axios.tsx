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
  const [rideId, setRideId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [origToken, setOrigToken] = useState('');
  const [origRefreshToken, setOrigRefreshToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [jsonRideData, setJsonRideData] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadStoredValues = async () => {
      const storedClientId = await AsyncStorage.getItem('clientId');
      const storedClientSecret = await AsyncStorage.getItem('clientSecret');
      const storedRedirectUri = await AsyncStorage.getItem('redirectUri');
      const storedRideId = await AsyncStorage.getItem('rideId');
      const storedJsonRideData = await AsyncStorage.getItem('jsonRideData');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (storedClientId) setClientId(storedClientId);
      if (storedClientSecret) setClientSecret(storedClientSecret);
      if (storedRedirectUri) setRedirectUri(storedRedirectUri);
      if (storedRideId) setRideId(storedRideId);
      if (storedJsonRideData) setJsonRideData(storedJsonRideData);
      if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    };

    loadStoredValues();

    const handleUrl = (event: { url: any }) => {
      const { url } = event;
      if (url.startsWith('mbtclient://axios')) {
        const code = new URL(url).searchParams.get('code');
        if (code) {
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

  const handleJsonRideDataChange = async (text: string) => {
    setJsonRideData(text);
    await AsyncStorage.setItem('jsonRideData', text);
  };

  const handleRideIdChange = async (text: string) => {
    setRideId(text);
    await AsyncStorage.setItem('rideId', text);
  };

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
      await AsyncStorage.setItem('accessToken', access_token);
      await AsyncStorage.setItem('refreshToken', refresh_token);
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
      await AsyncStorage.setItem('accessToken', access_token);
      await AsyncStorage.setItem('refreshToken', refresh_token);
      console.log('New access token:', access_token);
      console.log('New refresh token:', refresh_token);
    } catch (error) {
      console.error('Failed to refresh access token:', error);
    }
  };

  const revokeToken = async() => { 
    console.log('revoking token');
    console.log('clientId:', clientId);
    console.log('clientSecret:', clientSecret);
    console.log('accessToken:', accessToken);
    try {
      const response = await axios.post('https://www.mybiketraffic.com/clients/deauthorize', 
        new URLSearchParams({
          grant_type: 'deauthorization',
          client_id: clientId,
          client_secret: clientSecret
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      setJsonData(response.data);
    } catch (error) {
      console.error('Failed to revoke token:', error);
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

  const apiViewRide = async () => {
    try {
      const response = await axios.get('https://www.mybiketraffic.com/clients/api_viewride/'+rideId, {
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

  const apiAddRide = async () => {
    try {
      const response = await axios.post('https://www.mybiketraffic.com/clients/api_addride', JSON.stringify(jsonRideData), {
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
      <ThemedText>This tab lets you test your client params.
      JSON responses from api endpoints visible here at the top.</ThemedText>
        {jsonData ? (
          <ScrollView style={styles.jsonContainer}>
            <ThemedText>{JSON.stringify(jsonData, null, 2)}</ThemedText>
          </ScrollView>
        ) : null}
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
      <Collapsible title="Step 2: Exchange Authorization Code">
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
      <Collapsible title="Step 3: Refresh Access Token">
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
      <Collapsible title="Step 4a: Interact with api - listrides">
        <ThemedText>
          Click the button below to hit the api_listrides endpoint
        </ThemedText>
        <Button title="api_listrides" onPress={apiListRides} />
      </Collapsible>
      <Collapsible title="Step 4b: Interact with api - viewride">
        <TextInput
          style={styles.input}
          placeholder="valid ride ID"
          value={rideId}
          onChangeText={handleRideIdChange}
        />
        <ThemedText>
          Click the button below to hit the api_viewride endpoint 
        </ThemedText>
        <Button title="api_viewride" onPress={apiViewRide} />
      </Collapsible>
      <Collapsible title="Step 4c: Interact with api - addride">
        <TextInput
          multiline={true}
          numberOfLines={4}
          style={styles.inputmulti}
          placeholder="valid ride JSON data"
          value={jsonRideData}
          onChangeText={handleJsonRideDataChange}
        />
        <ThemedText>
          Click the button below to hit the api_viewride endpoint 
        </ThemedText>
        <Button title="api_addride" onPress={apiAddRide} />
      </Collapsible>
      <Collapsible title="Step 5: Revoke Token">
        <ThemedText>
          Click the button below to hit the deauthorization endpoint 
        </ThemedText>
        <Button title="Revoke Token" onPress={revokeToken} />
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
  inputmulti: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
    maxHeight: 200,
  },
});