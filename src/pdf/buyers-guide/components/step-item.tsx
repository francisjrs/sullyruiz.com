import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  tip?: string;
  tipTitle?: string;
}

export const StepItem: React.FC<StepItemProps> = ({
  number,
  title,
  description,
  tip,
  tipTitle = 'Pro Tip',
}) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepNumber}>{String(number).padStart(2, '0')}</Text>
    <Text style={styles.stepTitle}>{title}</Text>
    <Text style={styles.paragraph}>{description}</Text>
    {tip && (
      <View style={styles.calloutBox}>
        <Text style={styles.calloutTitle}>{tipTitle}</Text>
        <Text style={styles.calloutText}>{tip}</Text>
      </View>
    )}
  </View>
);
