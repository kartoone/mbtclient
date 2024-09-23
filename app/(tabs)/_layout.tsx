import { Tabs, useLocalSearchParams  } from 'expo-router';
import React, { useEffect } from 'react';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicon from '@expo/vector-icons/Ionicons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Linking } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { everything } = useLocalSearchParams<{
    everything: string[];
    extra?: string;
  }>();
  
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log(`url`, url);
      console.log(everything);
    });
  }, []);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, focused }) => (
            <Ionicon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="axios"
        options={{
          title: 'Axios',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name={'network-wired'} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="oauthapp"
        options={{
          title: 'Oauth Package',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name={'lock'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
