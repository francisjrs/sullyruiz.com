import { StyleSheet, Font } from '@react-pdf/renderer';

// Register brand fonts from Google Fonts
Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w-Y3tcoqK5.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr70w-Y3tcoqK5.ttf',
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQAllvuQWJ5heb_w.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQWl5vuQWJ5heb_w.ttf',
      fontWeight: 500,
      fontStyle: 'italic',
    },
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3WmX5slCNuHLi8bLeY9MK7whWMhyjYrEPjuw-NxBKL_y94.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3WmX5slCNuHLi8bLeY9MK7whWMhyjYzEDjuw-NxBKL_y94.ttf',
      fontWeight: 700,
    },
  ],
});

// Brand colors
export const colors = {
  cream: '#f4f1ec',
  black: '#000000',
  gold: '#BEB09E',
  goldLight: '#d4cfc5',
  white: '#ffffff',
  gray: '#666666',
  grayLight: '#999999',
};

// Base styles
export const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    paddingHorizontal: 50,
    paddingVertical: 40,
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    color: colors.black,
  },
  // Cover page styles
  coverPage: {
    backgroundColor: colors.cream,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 60,
  },
  coverTitle: {
    fontFamily: 'Montserrat',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.black,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.gold,
    marginTop: 8,
  },
  coverLine: {
    width: 80,
    height: 1,
    backgroundColor: colors.gold,
    marginVertical: 20,
  },
  coverPhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 30,
    borderWidth: 3,
    borderColor: colors.gold,
  },
  coverAgent: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: colors.black,
    marginTop: 15,
  },
  coverEdition: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.grayLight,
    marginTop: 20,
  },
  coverLogo: {
    width: 100,
    marginTop: 30,
  },
  // Chapter header styles
  chapterHeader: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    paddingBottom: 15,
  },
  chapterNumber: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.gold,
    marginBottom: 5,
  },
  chapterTitle: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.black,
  },
  // Section header
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.black,
    marginTop: 20,
    marginBottom: 10,
  },
  // Body text
  paragraph: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    lineHeight: 1.7,
    color: colors.black,
    marginBottom: 12,
    textAlign: 'justify',
  },
  // Step styles
  stepContainer: {
    marginBottom: 20,
  },
  stepNumber: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: 700,
    color: colors.gold,
    marginBottom: 5,
  },
  stepTitle: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.black,
    marginBottom: 8,
  },
  // Callout/Tip box
  calloutBox: {
    backgroundColor: colors.white,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    padding: 15,
    marginVertical: 15,
  },
  calloutTitle: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.gold,
    marginBottom: 5,
  },
  calloutText: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.black,
    fontStyle: 'italic',
  },
  // Quote box
  quoteBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.goldLight,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  quoteText: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: colors.black,
    lineHeight: 1.8,
  },
  // List styles
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  listBullet: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    color: colors.gold,
    marginRight: 10,
    width: 15,
  },
  listText: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.black,
    flex: 1,
  },
  // Checklist styles
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: colors.gold,
    marginRight: 12,
  },
  checklistText: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    color: colors.black,
    flex: 1,
  },
  // Table styles
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: colors.goldLight,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.goldLight,
  },
  tableHeader: {
    backgroundColor: colors.gold,
  },
  tableHeaderCell: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.white,
    padding: 10,
    flex: 1,
  },
  tableCell: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 10,
    color: colors.black,
    padding: 10,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.goldLight,
  },
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.goldLight,
    paddingTop: 10,
  },
  footerText: {
    fontFamily: 'Montserrat',
    fontSize: 8,
    letterSpacing: 1,
    color: colors.grayLight,
  },
  pageNumber: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    fontWeight: 500,
    color: colors.gold,
  },
  // Contact section styles
  contactSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  contactLeft: {
    flex: 1,
    paddingRight: 20,
  },
  contactRight: {
    flex: 1,
    paddingLeft: 20,
    alignItems: 'center',
  },
  contactPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.gold,
    marginBottom: 15,
  },
  contactName: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
  },
  contactTitle: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.gray,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactInfo: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 10,
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
  },
  // Mistake item styles
  mistakeContainer: {
    marginBottom: 15,
    paddingLeft: 10,
  },
  mistakeNumber: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 700,
    color: colors.gold,
    marginBottom: 3,
  },
  mistakeTitle: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: colors.black,
    marginBottom: 5,
  },
  mistakeText: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.gray,
  },
  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    marginTop: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  columnDivider: {
    width: 1,
    backgroundColor: colors.goldLight,
    marginHorizontal: 15,
  },
});
