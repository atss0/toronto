import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColors } from '../../context/ThemeContext';
import { makeStyles } from './SectionHeader.style';

interface SectionHeaderProps {
  title: string;
  onPressSeeAll?: () => void;
  showSeeAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPressSeeAll, showSeeAll = true }) => {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
