import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { styles, colors } from '../buyers-guide/styles';
import {
  Cover,
  ChapterHeader,
  SectionTitle,
  CalloutBox,
  QuoteBox,
  Checklist,
  BulletList,
  Footer,
  StepItem,
  MistakeItem,
  Table,
} from '../buyers-guide/components';
import { content as enContent } from './content/en';
import { content as esContent } from './content/es';
import type { SellerGuideContent } from './content/en';

interface SellersGuideProps {
  locale: 'en' | 'es';
  photoPath?: string;
}

export const SellersGuide: React.FC<SellersGuideProps> = ({
  locale,
  photoPath,
}) => {
  const content: SellerGuideContent = locale === 'es' ? esContent : enContent;

  return (
    <Document
      title={content.cover.title.replace('\n', ' ')}
      author={content.cover.agentName}
      subject="Texas Home Seller's Guide"
      creator="Sully Ruiz Real Estate"
    >
      {/* Page 1: Cover */}
      <Cover
        title={content.cover.title}
        subtitle={content.cover.subtitle}
        agentName={content.cover.agentName}
        agentTitle={content.cover.agentTitle}
        edition={content.cover.edition}
        photoPath={photoPath}
      />

      {/* Page 2: Welcome + Market Overview */}
      <Page size="LETTER" style={styles.page}>
        <ChapterHeader title={content.welcome.chapterTitle} />

        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
          {content.welcome.greeting}
        </Text>

        <Text style={styles.paragraph}>
          {content.welcome.message}
        </Text>

        <Text style={[styles.paragraph, { fontStyle: 'italic', marginTop: 10 }]}>
          {content.welcome.signature}
        </Text>

        <View style={{ marginTop: 30 }}>
          <SectionTitle>{content.marketOverview.sectionTitle}</SectionTitle>

          <Text style={styles.paragraph}>
            {content.marketOverview.intro}
          </Text>

          {/* Market stats */}
          <View style={{
            backgroundColor: colors.white,
            padding: 20,
            marginVertical: 15,
          }}>
            {content.marketOverview.stats.map((stat, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  borderBottomWidth: index < content.marketOverview.stats.length - 1 ? 1 : 0,
                  borderBottomColor: colors.goldLight,
                }}
              >
                <Text style={[styles.paragraph, { marginBottom: 0, flex: 1 }]}>
                  {stat.label}
                </Text>
                <Text style={[styles.paragraph, { marginBottom: 0, fontWeight: 600, color: colors.gold }]}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          <SectionTitle>{content.marketOverview.timing.title}</SectionTitle>
          <Text style={styles.paragraph}>
            {content.marketOverview.timing.content}
          </Text>

          <CalloutBox title={content.marketOverview.callout.title}>
            {content.marketOverview.callout.content}
          </CalloutBox>
        </View>

        <Footer pageNumber={2} />
      </Page>

      {/* Page 3: Steps 1-2 */}
      <Page size="LETTER" style={styles.page}>
        <ChapterHeader
          number={content.steps.chapterNumber}
          title={content.steps.chapterTitle}
        />

        <Text style={styles.paragraph}>
          {content.steps.intro}
        </Text>

        <StepItem
          number={content.steps.items[0].number}
          title={content.steps.items[0].title}
          description={content.steps.items[0].description}
          tip={content.steps.items[0].tip}
          tipTitle={locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
        />

        <StepItem
          number={content.steps.items[1].number}
          title={content.steps.items[1].title}
          description={content.steps.items[1].description}
          tip={content.steps.items[1].tip}
          tipTitle={locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
        />

        <Footer pageNumber={3} />
      </Page>

      {/* Page 4: Steps 3-4 */}
      <Page size="LETTER" style={styles.page}>
        <View style={{ marginTop: 10 }}>
          <StepItem
            number={content.steps.items[2].number}
            title={content.steps.items[2].title}
            description={content.steps.items[2].description}
            tip={content.steps.items[2].tip}
            tipTitle={locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
          />

          <StepItem
            number={content.steps.items[3].number}
            title={content.steps.items[3].title}
            description={content.steps.items[3].description}
            tip={content.steps.items[3].tip}
            tipTitle={locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
          />
        </View>

        <Footer pageNumber={4} />
      </Page>

      {/* Page 5: Step 5 + Costs intro */}
      <Page size="LETTER" style={styles.page}>
        <View style={{ marginTop: 10 }}>
          <StepItem
            number={content.steps.items[4].number}
            title={content.steps.items[4].title}
            description={content.steps.items[4].description}
            tip={content.steps.items[4].tip}
            tipTitle={locale === 'es' ? 'Consejo Pro' : 'Pro Tip'}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <ChapterHeader
            number={content.costs.chapterNumber}
            title={content.costs.chapterTitle}
          />

          <Text style={styles.paragraph}>
            {content.costs.intro}
          </Text>

          <SectionTitle>{content.costs.costBreakdown.title}</SectionTitle>

          <Table
            headers={content.costs.costBreakdown.headers}
            rows={content.costs.costBreakdown.rows}
          />
        </View>

        <Footer pageNumber={5} />
      </Page>

      {/* Page 6: Costs continued */}
      <Page size="LETTER" style={styles.page}>
        <SectionTitle>{content.costs.netProceeds.title}</SectionTitle>

        <BulletList items={content.costs.netProceeds.items} />

        <CalloutBox title={content.costs.callout.title}>
          {content.costs.callout.content}
        </CalloutBox>

        <Footer pageNumber={6} />
      </Page>

      {/* Page 7: Mistakes to Avoid */}
      <Page size="LETTER" style={styles.page}>
        <ChapterHeader
          number={content.mistakes.chapterNumber}
          title={content.mistakes.chapterTitle}
        />

        <Text style={styles.paragraph}>
          {content.mistakes.intro}
        </Text>

        {content.mistakes.items.map((mistake, index) => (
          <MistakeItem
            key={index}
            number={mistake.number}
            title={mistake.title}
            description={mistake.description}
          />
        ))}

        <Footer pageNumber={7} />
      </Page>

      {/* Page 8: Checklist + Contact */}
      <Page size="LETTER" style={styles.page}>
        <ChapterHeader title={content.checklist.chapterTitle} />

        <Checklist items={content.checklist.items} />

        <View style={{ marginTop: 30 }}>
          <SectionTitle>{content.contact.sectionTitle}</SectionTitle>

          <Text style={styles.paragraph}>
            {content.contact.message}
          </Text>

          <View style={styles.contactSection}>
            {/* Contact info */}
            <View style={styles.contactRight}>
              {photoPath && (
                <Image
                  src={photoPath}
                  style={styles.contactPhoto}
                />
              )}
              <Text style={styles.contactName}>{content.contact.name}</Text>
              <Text style={styles.contactTitle}>{content.contact.title}</Text>
              <Text style={styles.contactInfo}>{content.contact.phone}</Text>
              <Text style={styles.contactInfo}>{content.contact.email}</Text>
              <Text style={[styles.contactInfo, { fontWeight: 600 }]}>
                {content.contact.website}
              </Text>
            </View>
          </View>

          <QuoteBox>
            {content.contact.cta}
          </QuoteBox>
        </View>

        <Footer pageNumber={8} />
      </Page>
    </Document>
  );
};

export default SellersGuide;
