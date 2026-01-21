import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface MistakeItemProps {
  number: number;
  title: string;
  description: string;
}

export const MistakeItem: React.FC<MistakeItemProps> = ({
  number,
  title,
  description,
}) => (
  <View style={styles.mistakeContainer}>
    <Text style={styles.mistakeNumber}>{number}</Text>
    <Text style={styles.mistakeTitle}>{title}</Text>
    <Text style={styles.mistakeText}>{description}</Text>
  </View>
);
