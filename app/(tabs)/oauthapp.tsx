import React, { useState, useCallback, useEffect } from 'react';
import { Alert, Button, View, StyleSheet } from 'react-native';
import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
  AuthorizeResult,
  RefreshResult,
} from 'react-native-app-auth';

const mybiketrafficconfig = {
  issuer: 'https://mybiketraffic.com',
  serviceConfiguration: {
    authorizationEndpoint: 'https://mybiketraffic.com/clients/authorize',
    tokenEndpoint: 'https://www.mybiketraffic.com/clients/access_token',
    revocationEndpoint: 'https://mybiketraffic.com/clients/deauthorize',
  },
  clientId: '45714821',
  clientSecret: 'gss05hS8XR3IjiS8pZmFcgO3DOY1DLeJ',
  redirectUrl: 'mbtclient://oauthapp',
  additionalParameters: {
    response_mode: 'query',
  },
  scopes: [],
};

interface AuthState {
  hasLoggedInOnce: boolean;
  provider: string;
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
}

const defaultAuthState: AuthState = {
  hasLoggedInOnce: false,
  provider: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
};

const OAuthScreen: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      connectionTimeoutSeconds: 5,
      ...mybiketrafficconfig,
    });
  }, []);

  const handleAuthorize = useCallback(async () => {
    try {
      const newAuthState: AuthorizeResult = await authorize({
        ...mybiketrafficconfig,
        connectionTimeoutSeconds: 5,
        iosPrefersEphemeralSession: true,
      });

      setAuthState({
        hasLoggedInOnce: true,
        provider: 'mybiketraffic',
        accessToken: newAuthState.accessToken,
        accessTokenExpirationDate: newAuthState.accessTokenExpirationDate,
        refreshToken: newAuthState.refreshToken,
      });
    } catch (error) {
      Alert.alert('Failed to log in', (error as Error).message);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      const newAuthState: RefreshResult = await refresh(mybiketrafficconfig, {
        refreshToken: authState.refreshToken,
      });

      setAuthState({
        ...authState,
        accessToken: newAuthState.accessToken,
        accessTokenExpirationDate: newAuthState.accessTokenExpirationDate,
        refreshToken: newAuthState.refreshToken || authState.refreshToken,
      });
    } catch (error) {
      Alert.alert('Failed to refresh token', (error as Error).message);
    }
  }, [authState]);

  const handleRevoke = useCallback(async () => {
    try {
      await revoke(mybiketrafficconfig, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true,
      });

      setAuthState(defaultAuthState);
    } catch (error) {
      Alert.alert('Failed to revoke token', (error as Error).message);
    }
  }, [authState]);

  return (
    <View style={styles.container}>
      <Button title="Authorize" onPress={handleAuthorize} />
      <Button title="Refresh" onPress={handleRefresh} />
      <Button title="Revoke" onPress={handleRevoke} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OAuthScreen;