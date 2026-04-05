import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './AuthDivider.style';

interface AuthDividerProps {
  text?: string;
}

const AuthDivider: React.FC<AuthDividerProps> = ({ text = "OR CONTINUE WITH" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default AuthDivider;