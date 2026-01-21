import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface ChapterHeaderProps {
  number?: string;
  title: string;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({ number, title }) => (
  <View style={styles.chapterHeader}>
    {number && <Text style={styles.chapterNumber}>{number}</Text>}
    <Text style={styles.chapterTitle}>{title}</Text>
  </View>
);

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);
