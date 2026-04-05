import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './SectionHeader.style';

interface SectionHeaderProps {
  title: string;
  onPressSeeAll?: () => void;
  showSeeAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPressSeeAll, showSeeAll = true }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;