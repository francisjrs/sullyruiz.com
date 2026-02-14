import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface CalloutBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: 'tip' | 'note' | 'important';
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  title,
  children,
  variant = 'tip'
}) => {
  const borderColor = variant === 'important' ? colors.black : colors.gold;

  return (
    <View style={[styles.calloutBox, { borderLeftColor: borderColor }]}>
      <Text style={styles.calloutTitle}>{title}</Text>
      <Text style={styles.calloutText}>{children}</Text>
    </View>
  );
};

interface QuoteBoxProps {
  children: React.ReactNode;
  author?: string;
}

export const QuoteBox: React.FC<QuoteBoxProps> = ({ children, author }) => (
  <View style={styles.quoteBox}>
    <Text style={styles.quoteText}>{"\u201C"}{children}{"\u201D"}</Text>
    {author && (
      <Text style={[styles.quoteText, { marginTop: 10, fontSize: 11 }]}>
        — {author}
      </Text>
    )}
  </View>
);
