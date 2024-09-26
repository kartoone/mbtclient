import Ionicons from '@expo/vector-icons/Ionicons';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ title, children }: PropsWithChildren & { title: string }) => {
  const [expanded, setExpanded] = useState(true);
  const theme = useColorScheme() ?? 'light';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleExpanded}
        activeOpacity={0.8}>
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-forward-outline'}
          size={18}
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {expanded && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
