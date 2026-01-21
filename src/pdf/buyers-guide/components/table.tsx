import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import { styles, colors } from '../styles';

interface TableProps {
  headers: string[];
  rows: string[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => (
  <View style={styles.table}>
    {/* Header row */}
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, index) => {
        const cellStyles: Style[] = [styles.tableHeaderCell];
        if (index === headers.length - 1) {
          cellStyles.push({ borderRightWidth: 0 });
        }
        return (
          <Text key={index} style={cellStyles}>
            {header}
          </Text>
        );
      })}
    </View>
    {/* Data rows */}
    {rows.map((row, rowIndex) => {
      const rowStyles: Style[] = [styles.tableRow];
      if (rowIndex === rows.length - 1) {
        rowStyles.push({ borderBottomWidth: 0 });
      }
      if (rowIndex % 2 === 1) {
        rowStyles.push({ backgroundColor: colors.white });
      }
      return (
        <View key={rowIndex} style={rowStyles}>
          {row.map((cell, cellIndex) => {
            const cellStyles: Style[] = [styles.tableCell];
            if (cellIndex === row.length - 1) {
              cellStyles.push({ borderRightWidth: 0 });
            }
            return (
              <Text key={cellIndex} style={cellStyles}>
                {cell}
              </Text>
            );
          })}
        </View>
      );
    })}
  </View>
);
