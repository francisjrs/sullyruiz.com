import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface FooterProps {
  pageNumber: number;
  totalPages: number;
  agentName?: string;
  website?: string;
}

export const Footer: React.FC<FooterProps> = ({
  pageNumber,
  agentName = 'Sully Ruiz',
  website = 'sullyruiz.com',
}) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>{agentName} | {website}</Text>
    <Text style={styles.pageNumber}>{pageNumber}</Text>
  </View>
);
