import React from 'react';
import { View, Text, Image, Page } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface CoverProps {
  title: string;
  subtitle: string;
  agentName: string;
  agentTitle: string;
  edition: string;
  photoPath?: string;
}

export const Cover: React.FC<CoverProps> = ({
  title,
  subtitle,
  agentName,
  agentTitle,
  edition,
  photoPath,
}) => (
  <Page size="LETTER" style={styles.coverPage}>
    <View style={styles.coverContent}>
      {/* Top decorative line */}
      <View style={styles.coverLine} />

      {/* Main title */}
      <Text style={styles.coverTitle}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.coverSubtitle}>{subtitle}</Text>

      {/* Bottom decorative line */}
      <View style={styles.coverLine} />

      {/* Agent photo with gold border */}
      {photoPath && (
        <View style={{
          marginVertical: 30,
          padding: 4,
          borderRadius: 75,
          borderWidth: 2,
          borderColor: colors.gold,
        }}>
          <Image
            src={photoPath}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
            }}
          />
        </View>
      )}

      {/* Agent attribution */}
      <Text style={styles.coverAgent}>
        {agentTitle}
      </Text>
      <Text style={[styles.coverAgent, { fontWeight: 600, fontStyle: 'normal', marginTop: 5 }]}>
        {agentName}
      </Text>

      {/* Edition */}
      <Text style={styles.coverEdition}>{edition}</Text>

      {/* Keller Williams logo placeholder */}
      <View style={{
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.gold,
      }}>
        <Text style={{
          fontFamily: 'Montserrat',
          fontSize: 10,
          letterSpacing: 2,
          color: colors.black,
          textTransform: 'uppercase',
        }}>
          Keller Williams Realty
        </Text>
      </View>
    </View>
  </Page>
);
