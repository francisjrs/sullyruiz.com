import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface ChecklistItemProps {
  children: React.ReactNode;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ children }) => (
  <View style={styles.checklistItem}>
    <View style={styles.checkbox} />
    <Text style={styles.checklistText}>{children}</Text>
  </View>
);

interface ChecklistProps {
  items: string[];
  title?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, title }) => (
  <View style={{ marginVertical: 15 }}>
    {title && (
      <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 15 }]}>
        {title}
      </Text>
    )}
    {items.map((item, index) => (
      <ChecklistItem key={index}>{item}</ChecklistItem>
    ))}
  </View>
);

interface BulletListProps {
  items: string[];
}

export const BulletList: React.FC<BulletListProps> = ({ items }) => (
  <View style={{ marginVertical: 10 }}>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>{item}</Text>
      </View>
    ))}
  </View>
);

interface NumberedListProps {
  items: string[];
}

export const NumberedList: React.FC<NumberedListProps> = ({ items }) => (
  <View style={{ marginVertical: 10 }}>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={[styles.listBullet, { color: colors.gold, fontWeight: 600 }]}>
          {index + 1}.
        </Text>
        <Text style={styles.listText}>{item}</Text>
      </View>
    ))}
  </View>
);
