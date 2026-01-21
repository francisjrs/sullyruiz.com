import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../styles';

interface TableProps {
  headers: string[];
  rows: string[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => (
  <View style={styles.table}>
    {/* Header row */}
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((header, index) => (
        <Text
          key={index}
          style={[
            styles.tableHeaderCell,
            index === headers.length - 1 && { borderRightWidth: 0 },
          ]}
        >
          {header}
        </Text>
      ))}
    </View>
    {/* Data rows */}
    {rows.map((row, rowIndex) => (
      <View
        key={rowIndex}
        style={[
          styles.tableRow,
          rowIndex === rows.length - 1 && { borderBottomWidth: 0 },
          rowIndex % 2 === 1 && { backgroundColor: colors.white },
        ]}
      >
        {row.map((cell, cellIndex) => (
          <Text
            key={cellIndex}
            style={[
              styles.tableCell,
              cellIndex === row.length - 1 && { borderRightWidth: 0 },
            ]}
          >
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);
