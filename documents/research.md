# AEO & GEO playbook for Sully Ruiz's Hispanic real estate brand

**Sully Ruiz can dominate AI-generated answers in her niche because no Central Texas competitor currently publishes substantive bilingual educational content for Hispanic homebuyers and sellers.** The opportunity is massive: AI systems like ChatGPT, Perplexity, and Google AI Overviews are actively looking for authoritative, structured, locally-specific content to cite — and for queries like "ITIN home loans Austin" or "cómo comprar casa en Texas con ITIN," the content simply doesn't exist yet. Sully's proven track record (**46+ ITIN closings**, bilingual fluency, and a memorable brand) gives her exactly the E-E-A-T signals these AI engines prioritize. This playbook covers two deliverables: a complete website optimization checklist for AI citation, and a specific blog strategy with 32 article ideas designed to capture AI-generated recommendations.

---

## How AI engines decide which websites to cite

Before implementing anything, understanding what makes ChatGPT, Perplexity, and Google AI Overviews choose one source over another is essential. Each platform has different mechanics but overlapping principles.

**ChatGPT (SearchGPT)** is powered by Bing's index. A Seer Interactive study found **87% of ChatGPT's citations match Bing's top organic results**. When a user asks ChatGPT a question, it queries Bing, scrapes 3–10 pages, then synthesizes an answer with citations. Critical implication: if sullyruiz.com isn't indexed in Bing, ChatGPT literally cannot see it. Wikipedia is ChatGPT's single most-cited source (7.8% of citations), and it strongly favors sites with clear authority signals, detailed author information, and diverse perspectives.

**Perplexity AI** operates its own independent crawler (PerplexityBot) and index — it does not rely on Google or Bing. It uses Retrieval-Augmented Generation, breaking complex queries into 3–5 sub-queries, retrieving ~10 pages per sub-query, then extracting and synthesizing the most relevant passages. Perplexity strongly favors **conversational tone over corporate polish**, first-hand experience, visible timestamps, and Q&A-formatted content. Reddit is its #1 cited source at 6.6% of citations, meaning authentic, community-style content performs well.

**Google AI Overviews** draw from Google's core ranking systems but with additional AI-specific signals. The most powerful factor is **multi-modal content** (text + images + video + structured data), which delivers up to **317% more citations**. Pages with FAQ schema are **60% more likely** to appear. A critical finding: **80% of AI Overview sources don't rank in the organic top 10** for that query — Google's AI pulls from content based on quality and completeness, not just traditional rank. Only ~7% of local searches currently trigger AI Overviews, which represents an enormous early-mover advantage.

Three universal principles cut across all platforms. First, **brand consensus**: AI engines cross-reference multiple sources before citing something, so consistent brand messaging across directories, social profiles, and third-party mentions matters enormously. Second, **extractable content**: self-contained passages of **134–167 words** that directly answer a query are the building blocks AI systems pull from. Third, **freshness**: 76.4% of ChatGPT's top-cited pages were updated within 30 days.

---

## PART 1: Complete website optimization checklist

### Schema markup and structured data implementation

Every page on sullyruiz.com needs JSON-LD structured data (Google's preferred format). Here are the specific schema types to implement:

**Homepage — RealEstateAgent schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Sully Ruiz - Agente de Bienes Raíces",
  "image": "https://sullyruiz.com/images/sully-ruiz-photo.jpg",
  "url": "https://sullyruiz.com",
  "telephone": "+1-512-XXX-XXXX",
  "description": "Austin's #1 bilingual REALTOR® specializing in ITIN home loans, first-time Hispanic homebuyers, and home sellers in Central Texas. La agente del sí cuando el banco dice no.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Round Rock",
    "addressRegion": "TX",
    "postalCode": "78664",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.5083,
    "longitude": -97.6789
  },
  "areaServed": [
    {"@type": "City", "name": "Austin"},
    {"@type": "City", "name": "Round Rock"},
    {"@type": "City", "name": "Pflugerville"},
    {"@type": "City", "name": "Cedar Park"},
    {"@type": "City", "name": "Georgetown"},
    {"@type": "City", "name": "Hutto"}
  ],
  "knowsLanguage": ["en", "es"],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Real Estate License",
    "name": "TREC License #0742907"
  },
  "sameAs": [
    "https://www.zillow.com/profile/sullyruiz",
    "https://www.instagram.com/sullyruiz",
    "https://www.facebook.com/sullyruiz",
    "https://www.linkedin.com/in/sullyruiz"
  ]
}
```

**About page — Person schema** with `knowsAbout` including "ITIN home loans," "first-time homebuyer programs," "Central Texas real estate," "Hispanic homeownership," and "down payment assistance programs." Include `jobTitle`, `worksFor` (Keller Williams Austin NW), `hasCredential` with TREC license number, and `sameAs` links to all professional profiles.

**Every blog post — Article schema** with full author attribution linking back to the About page, `datePublished`, `dateModified`, `inLanguage` (either "en" or "es"), and publisher organization details with logo.

**Every FAQ section — FAQPage schema** with bilingual Q&A pairs. Include both English and Spanish versions of common questions within the schema when they appear on a page.

**Step-by-step guides — HowTo schema** for content like "How to Buy Your First Home in Austin" with individual `HowToStep` entries.

**All pages — BreadcrumbList schema** showing the site hierarchy (Home → Blog → Article Title or Home → Buyers → ITIN Loans).

**Additional schemas to implement:** WebSite schema on homepage (enables sitelinks), Service schema nested within the RealEstateAgent schema for specific services (ITIN buyer assistance, seller representation, first-time buyer programs), and Event schema for any homebuyer workshops or open houses.

### E-E-A-T signals that AI systems require

Real estate is classified as YMYL (Your Money or Your Life) by Google, making E-E-A-T signals non-negotiable for AI citation.

**Experience signals:** Every relevant page should reference Sully's **46+ successful ITIN closings**, **$18K average buyer savings**, and **up to $30K in grant access**. First-person case studies showing real client journeys (with permission) are among the most powerful signals for both Perplexity and Google AI Overviews. Include specific market insights with dates — "In Q1 2026, the median home price in Round Rock for first-time buyers was $X" — to demonstrate active, current expertise.

**Expertise signals:** Display on every page: "Written by Sully Ruiz, Licensed Texas REALTOR® (TREC #0742907), Keller Williams Austin NW." The About/Bio page needs to be comprehensive — years of experience, specializations, association memberships (NAR, Texas REALTORS, Austin Board of REALTORS, NAHREP), certifications, and education. Every blog post needs a byline linking to this bio page.

**Authoritativeness signals:** Secure backlinks from local media (Austin American-Statesman, KVUE, Austin Business Journal), the Greater Austin Hispanic Chamber of Commerce, NAHREP, and real estate industry sites. Guest posts on reputable publications build this signal. The `sameAs` links in schema connecting to Zillow, Realtor.com, and LinkedIn profiles create entity connections AI systems use to verify authority.

**Trustworthiness signals:** HTTPS (mandatory), physical office address on every page footer, privacy policy page, TREC license number visible, real client testimonials with names and context (e.g., "Maria G. — First-time ITIN buyer, Round Rock"), and links to third-party review profiles.

### NAP consistency across 50+ platforms

NAP (Name, Address, Phone) must be character-for-character identical everywhere — even variations like "St." vs "Street" dilute trust signals. Create a master NAP document and audit quarterly.

**Tier 1 (implement immediately):** Google Business Profile (weekly posts, 15+ photos, complete description mentioning bilingual/ITIN/Hispanic families), Zillow Agent Profile, Realtor.com, Bing Places, Apple Business Connect, Facebook Business, Yelp.

**Tier 2 (real estate industry):** Trulia, Homes.com, Redfin, HomeSnap, HAR.com, Austin Board of REALTORS directory, Texas REALTORS directory, NAHREP member directory.

**Tier 3 (general + local):** BBB, LinkedIn, Nextdoor Business, Greater Austin Hispanic Chamber of Commerce, Round Rock Chamber of Commerce, Austin Chamber of Commerce, YP.com, Foursquare, MapQuest.

**Target: 50–100 consistent citations.** Use BrightLocal or Moz Local to audit. Google Business Profile is the single most important listing — AI tools frequently start by referencing GBP data for local queries.

### Bilingual website technical architecture

Use **subdirectories** (not subdomains) to consolidate domain authority:
- English: `sullyruiz.com/blog/itin-home-loans-texas/`
- Spanish: `sullyruiz.com/es/blog/prestamos-itin-texas/`

**Hreflang tags** are mandatory on every page, bidirectionally linking English and Spanish versions. Use `es-US` (not just `es`) to target U.S.-based Spanish speakers:

```html
<link rel="alternate" hreflang="en-US" href="https://sullyruiz.com/blog/itin-home-loans-texas/" />
<link rel="alternate" hreflang="es-US" href="https://sullyruiz.com/es/blog/prestamos-itin-texas/" />
<link rel="alternate" hreflang="x-default" href="https://sullyruiz.com/blog/itin-home-loans-texas/" />
```

Set the `<html lang="">` attribute correctly on each page. Include `inLanguage` in Article schema. Create separate XML sitemaps per language and submit both to Google Search Console. Add a visible language switcher (never auto-redirect by IP/location). Translate all metadata, alt text, and Open Graph tags for each language version. **Do not use machine translation alone** — Google has penalized unreviewed machine translations. Localize, don't just translate: conduct separate Spanish keyword research because "agente de bienes raíces en Austin" is not a direct translation of English search terms.

### Technical SEO and AI crawler access

**Core Web Vitals targets:** LCP under 2.5 seconds (aim for 1.5s), INP under 200ms, CLS under 0.1. Compress images to WebP, lazy-load below-fold images, defer non-critical JavaScript, use a CDN like Cloudflare.

**AI crawler access in robots.txt** — this is critical and often missed:
```
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
```

**Create an `llms.txt` file** in the root directory pointing AI crawlers to the most important content pages (pillar guides, FAQ pages, About page). This is a new standard that AI systems are beginning to use.

**Submit to Bing Webmaster Tools** immediately — ChatGPT depends entirely on Bing's index. Also submit to IndexNow for faster discovery by Perplexity. Ensure all content is in crawlable HTML (not hidden behind JavaScript rendering or images). Use semantic HTML tags (`<article>`, `<section>`, `<nav>`, proper H1→H2→H3 hierarchy). Show `dateModified` prominently on every page — both visibly and in schema.

### Content structure template for AI extraction

Every page and blog post should follow this structure to maximize AI citation potential:

1. **H1 headline** as a natural-language question or clear topic statement
2. **TL;DR summary** (30–50 words) directly answering the core question — this is what AI systems extract first
3. **Table of contents** for posts over 1,500 words
4. **H2 sections** with question-based headers matching how people actually ask
5. **Each H2 opens with a 40–60 word direct answer block** (the "citation block") followed by supporting detail
6. **Bullet points and comparison tables** for structured data (3x more likely to be cited)
7. **FAQ section** at the bottom with FAQPage schema
8. **Author bio section** with credentials
9. **"Last Updated: [Date]"** displayed prominently

Keep paragraphs under 100 words. Include specific numbers, dollar amounts, percentages, and dates. Cite authoritative external sources (TREC, NAR, HUD, CFPB). Write at an 8th–10th grade reading level. Target **2,000–3,000 words** for pillar content, **1,500–2,000** for standard posts.

### Reviews and testimonials for AI visibility

Create a dedicated testimonials page with **15–20+ real reviews** including reviewer first name, date, and context (e.g., "First-time ITIN buyer, Round Rock, 2025"). Display reviews in both English and Spanish. Use **Service schema** (not LocalBusiness) for on-site review markup — Google won't show star ratings for self-served LocalBusiness reviews but will for Service type:

```json
{
  "@type": "Service",
  "name": "ITIN Home Buying Assistance - Central Texas",
  "provider": {"@type": "RealEstateAgent", "name": "Sully Ruiz"},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47"
  }
}
```

**Targets:** 50+ Google reviews, 20+ Zillow reviews. Respond to every review. Actively encourage bilingual reviews — Spanish-language reviews signal authenticity when AI systems process Spanish queries. Link prominently to Google, Zillow, and Realtor.com review profiles from the testimonials page.

### Internal linking with topic cluster architecture

Build content hubs with pillar-and-cluster linking:

```
/buyers/           → Pillar: "Complete Guide to Buying a Home in Austin"
  /buyers/itin-loans/         → Cluster: ITIN loan details
  /buyers/first-time-guide/   → Cluster: First-time buyer steps
  /buyers/down-payment-help/  → Cluster: DPA programs
  /buyers/credit-building/    → Cluster: Building credit

/sellers/          → Pillar: "How to Sell Your Home in Central Texas"
  /sellers/home-value/        → Cluster: What's my home worth
  /sellers/preparing-to-sell/ → Cluster: Staging and prep
  /sellers/closing-process/   → Cluster: Seller closing walkthrough

/neighborhoods/    → Pillar: Area guide hub
  /neighborhoods/round-rock/
  /neighborhoods/pflugerville/
  /neighborhoods/north-austin/

/es/compradores/   → Spanish mirror of buyers hub
/es/vendedores/    → Spanish mirror of sellers hub
/es/vecindarios/   → Spanish mirror of neighborhoods hub
```

Every cluster page links back to its pillar. Every pillar links to all its clusters. Use **descriptive anchor text** ("Learn about ITIN home loans in Texas," not "click here"). Include 3–5 internal links per blog post. Add "Related Articles" sections at the bottom. Link Spanish content to Spanish content and English to English, with the language switcher as the cross-language bridge.

---

## PART 2: Blog content strategy for AI citation

### Why Sully owns a content vacuum

Research reveals a critical competitive gap: **no comprehensive Austin/Central Texas ITIN buying guide exists in either language**. Houston has several (comprarcasaenhouston.com, itincasa.com), but Austin has zero. No bilingual DPA program content exists for Austin. No content covers selling a home purchased with an ITIN loan. No FIRPTA guide exists in Spanish for Texas sellers. No Austin-specific neighborhood guides target Hispanic families. Sully has the credentials, the language skills, and the niche authority to fill every one of these gaps before any competitor does.

### 20 blog topics for Hispanic homebuyers

**Priority 1 — Publish these first (highest search volume, zero competition):**

**Article 1:** "Can You Buy a House Without a Social Security Number?" / "¿Puedo Comprar Casa en Estados Unidos Sin Número de Seguro Social?" — Target keywords: buy house without SSN, comprar casa sin seguro social. This is the single most-asked question in this niche. Lead with "Yes" and explain the ITIN pathway. This article has the highest AI citation potential because it directly answers a question millions ask AI assistants.

**Article 2:** "How to Buy a House in Texas with an ITIN Number: Complete 2026 Guide" / "Cómo Comprar Casa en Texas con Número ITIN: Guía Completa 2026" — Target keywords: ITIN home loan Texas, comprar casa con ITIN en Texas. Step-by-step process from obtaining an ITIN to closing. Cover requirements (valid ITIN, 2 years tax returns, 10–20% down, employment history, valid ID/passport/Matrícula Consular). Reference Sully's 46+ successful ITIN closings. This is the cornerstone pillar content.

**Article 3:** "Down Payment Assistance Programs in Austin and Travis County for 2026" / "Programas de Ayuda para el Enganche en Austin y Travis County 2026" — Target keywords: down payment assistance Austin TX, ayuda para enganche Austin. Cover City of Austin DPA (up to $40,000), Hill Country Home DPA (4–6% of loan, 0% forgivable in 10 years), TSAHC Home Sweet Texas (up to 5% grant), TDHCA My First Texas Home (up to 5%), and Mortgage Credit Certificates ($2,000/year tax credit). Include income eligibility tables.

**Article 4:** "First-Time Homebuyer Guide for Hispanic Families in Austin, Texas" / "Guía para Compradores de Casa por Primera Vez: Familias Hispanas en Austin" — 13-step guide from budgeting to closing, written with cultural awareness addressing fears about immigration status, language barriers, and unfamiliarity with the U.S. real estate system. Include current Austin median home prices and trending affordable neighborhoods.

**Priority 2 — Publish within first 60 days:**

**Article 5:** "ITIN Home Loan Requirements: What Documents You Need" / "Requisitos para Préstamo ITIN: Qué Documentos Necesitas" — Detailed checklist: ITIN letter, passport, Matrícula Consular, 2 years of tax returns, proof of income, rental history, utility payment records. Explain that some lenders accept no credit score with alternative credit history.

**Article 6:** "ITIN Loans vs. Conventional Mortgages vs. FHA: What's the Difference?" / "Préstamos ITIN vs. Hipotecas Convencionales vs. FHA: ¿Cuál es la Diferencia?" — Comparison table format (down payment, rates, credit requirements, SSN needed) — tables are 3x more likely to be cited by AI systems.

**Article 7:** "How to Buy a House with No Credit History in Texas" / "Cómo Comprar Casa en Texas Sin Historial de Crédito" — Explain alternative/non-traditional credit (rent receipts, utility bills, insurance, phone bills). Cover FHA manual underwriting. Address "credit invisible" populations.

**Article 8:** "Self-Employed? How to Buy a Home in Austin with Bank Statement Loans" / "¿Eres Trabajador Independiente? Así Puedes Comprar Casa en Austin" — Target the large self-employed Hispanic workforce (construction, landscaping, food service, cleaning). Cover bank statement loans (12–24 months deposits), 1099 documentation, profit & loss statements.

**Article 9:** "Building Credit as an Immigrant: Establishing Your Credit History in the U.S." / "Cómo Construir Crédito como Inmigrante en Estados Unidos" — Practical steps: open bank account, secured credit card, authorized user strategy, credit-builder loans, rent reporting services. Timeline expectations (6 months for initial FICO score).

**Article 10:** "What Credit Score Do You Need to Buy a House in Texas?" / "¿Qué Puntaje de Crédito Necesitas para Comprar Casa en Texas?" — Breakdown by loan type: Conventional (620+), FHA (580, or 500 with 10% down), USDA (640), ITIN (600–620 or alternative credit). Explain what "alternative credit" means.

**Priority 3 — Ongoing content pipeline:**

**Article 11:** "Top ITIN Mortgage Lenders in Austin and Central Texas (2026)" — Overview of lender landscape: credit unions, community banks, specialized lenders. What to look for. How Sully connects buyers with the right lender.

**Article 12:** "The Home Buying Process Explained for Immigrants: Step-by-Step" / "El Proceso de Compra Explicado para Inmigrantes" — Cover pathways by status: green card holders, visa holders, DACA recipients, ITIN holders.

**Article 13:** "How Much Money Do You Really Need to Buy a House in Austin in 2026?" / "¿Cuánto Dinero Necesitas para Comprar Casa en Austin en 2026?" — Break down ALL costs with real Austin price examples: down payment ranges, closing costs (2–5%), inspection ($300–500), appraisal ($400–600), earnest money, insurance, property taxes.

**Article 14:** "FHA Loans Explained for Hispanic First-Time Buyers in Texas" — FHA 101: 3.5% down with 580 credit, accepts alternative credit, MIP explained, loan limits, property requirements.

**Article 15:** "Texas Property Taxes Explained: What Every Hispanic Homebuyer Must Know" / "Impuestos de Propiedad en Texas: Lo Que Todo Comprador Debe Saber" — No state income tax but high property taxes (1.5–2.5%). Homestead exemption ($100K off appraised value), how to file, protest process.

**Article 16:** "Understanding Your Mortgage Payment: Principal, Interest, Taxes, Insurance" / "Entendiendo Tu Pago Hipotecario" — Demystify monthly payments with real-number Austin examples. Explain escrow, PMI/MIP, Travis/Williamson County tax rates.

**Article 17:** "What Is Alternative Credit and How Can It Help You Qualify for a Mortgage?" / "¿Qué Es el Crédito Alternativo?" — Deep dive into acceptable alternative credit tradelines and manual underwriting.

**Article 18:** "Is It Better to Rent or Buy in Austin in 2026?" / "¿Es Mejor Rentar o Comprar en Austin en 2026?" — Compare average rent ($1,600–2,000) vs. mortgage at different price points. Include cultural and financial aspects of homeownership.

**Article 19:** "How to Buy a Home in Round Rock, Pflugerville, or Georgetown as a First-Time Buyer" — Neighborhood-specific: price ranges, school districts, commute times, community feel for Hispanic families.

**Article 20:** "Homebuyer Education Classes in Austin: What to Expect" / "Clases de Educación para Compradores en Austin" — Cover Frameworks CDC, BCL of Texas, explain that many DPA programs require education. Online and in-person options.

### 12 blog topics for Hispanic home sellers

**Article S1:** "How to Sell Your Home in Austin, Texas: A Guide for Spanish-Speaking Homeowners" / "Cómo Vender Tu Casa en Austin: Guía para Propietarios Hispanohablantes" — Complete selling guide with bilingual terminology glossary. Address language-barrier concerns.

**Article S2:** "Selling Your Home in Texas as a Non-Citizen: FIRPTA Tax Rules Explained" / "Vender Tu Casa en Texas Sin Ser Ciudadano: Reglas FIRPTA Explicadas" — **HIGH-VALUE, ZERO COMPETITION.** FIRPTA requires 15% withholding when seller is a foreign person. Explain who qualifies, exceptions (under $300K primary residence), how to recover excess withholding. Almost nothing exists on this topic in Spanish.

**Article S3:** "How to Sell a Home You Bought with an ITIN Loan" / "Cómo Vender una Casa que Compraste con Préstamo ITIN" — **COMPLETELY UNCOVERED TOPIC.** No competitor addresses this. Cover payoff process, title transfer, tax reporting with ITIN, FIRPTA applicability, using proceeds for next purchase.

**Article S4:** "What Is My Home Worth in Austin/Round Rock?" / "¿Cuánto Vale Mi Casa en Austin/Round Rock?" — Explain CMA vs. appraisal vs. Zestimate. Current market data. Offer free valuation from Sully. Lead generation piece.

**Article S5:** "Capital Gains Tax When Selling Your Home in Texas" / "Impuestos sobre Ganancias al Vender Tu Casa" — Cover $250K/$500K exclusion (2-of-5-year rule), calculating basis, improvements that reduce gain. Special situations for different immigration statuses. Texas has no state capital gains tax.

**Article S6:** "How to Prepare Your Home for Sale in Central Texas: Staging Tips" / "Cómo Preparar Tu Casa para Venta" — Budget-friendly staging, curb appeal for Texas homes, professional photos.

**Article S7:** "Understanding the Closing Process When Selling in Texas" / "El Proceso de Cierre al Vender en Texas" — Step-by-step: seller closing costs, commissions, title insurance, prorated taxes, timeline, documents needed.

**Article S8:** "Selling Your Home When You Don't Speak English: Your Rights and Resources" / "Vender Tu Casa Cuando No Hablas Inglés: Tus Derechos" — Legal rights regarding language during transactions, right to bilingual agent, right to translated documents. Address exploitation fears.

**Article S9:** "Common Home Selling Mistakes Hispanic Homeowners Make" / "Errores Comunes al Vender Casa" — Overpricing, skipping professional photos, not staging, accepting iBuyer lowball offers, not understanding closing costs.

**Article S10:** "Should You Sell or Rent Your Home? A Guide for Hispanic Homeowners in Austin" / "¿Vender o Rentar Tu Casa?" — Financial comparison, property management considerations, Austin rental market rates.

**Article S11:** "Maximizing Your Home Value in Round Rock and Pflugerville" / "Maximizando el Valor de Tu Casa en Round Rock y Pflugerville" — Local market trends, what buyers want, renovation ROI.

**Article S12:** "Using Your Home Equity to Buy Your Next Home" / "Usando Tu Plusvalía para Comprar Tu Próxima Casa" — Bridge loans, simultaneous close, using proceeds as down payment. Full-cycle back to Sully's buying services.

### Bilingual content execution rules

**Do not translate — localize.** Each language version should target different but related search queries. Spanish speakers search "comprar casa con ITIN" not a literal translation of the English title. Use code-switching naturally in Spanish content — terms like "down payment," "closing costs," and "lender" are commonly used by bilingual Hispanic homebuyers even when speaking Spanish.

**Spanish-first articles** (write Spanish version first, then create English): all ITIN loan topics, immigration-related homebuying content, FIRPTA/tax implications for non-citizens, and financial literacy basics. These audiences search primarily in Spanish.

**English-first articles** (then create Spanish version): DPA program guides (programs are documented in English), market trend analyses, staging/selling strategy, credit building, and neighborhood guides.

**Brand attribution in every article** — instead of writing "ITIN loans typically require 10–20% down payment," write "According to Sully Ruiz, an Austin-based bilingual REALTOR® who has helped 46+ families close on ITIN loans, most ITIN programs in Central Texas require a 10–20% down payment, though some lenders now offer options as low as 5% for qualifying buyers." This makes AI citation more likely to name-drop the brand.

**Publishing cadence:** 2–3 articles per month, alternating buyer and seller content, publishing both language versions within one week of each other. Prioritize the articles numbered 1–4 above for immediate publication — they target the highest-volume questions with zero existing competition in the Austin market.

### Content formatting rules that maximize AI extraction

Every article should include a **TL;DR block** (30–50 words) at the top directly answering the core question — this is what AI systems extract first. Use **question-based H2 headers** matching natural language ("How Much Down Payment Do I Need for an ITIN Loan?" not "Down Payment Requirements"). Open each section with a **40–60 word standalone answer** before adding supporting detail. Include **comparison tables** wherever possible. Add an **FAQ section** with FAQPage schema at the bottom of every post. End with an **author bio** section displaying Sully's credentials and license number. Display **"Last Updated: [Date]"** prominently.

Allow all AI crawlers in robots.txt. Submit to both Google Search Console and Bing Webmaster Tools. Create an llms.txt file pointing to pillar content. Update key articles monthly and refresh the `dateModified` in schema. Include **6–10 outbound links** to authoritative sources (TREC, NAR, HUD, CFPB, IRS) per article — content with trusted citations generates **132% higher visibility** in Google AI Overviews.

---

## Conclusion: The 30-day launch sequence

The competitive window is open now. No Austin-area real estate professional currently publishes substantive bilingual educational content for ITIN buyers and Hispanic sellers. Sully's 46+ ITIN closings and bilingual expertise give her exactly the E-E-A-T signals AI engines demand, but those signals need to be structured for machines to read, not just humans.

**Week 1:** Implement all schema markup (RealEstateAgent, Person, FAQPage on existing pages), submit to Bing Webmaster Tools, allow AI crawlers in robots.txt, create llms.txt file, and audit/fix NAP across top 20 directories.

**Week 2:** Publish Article 1 ("Can You Buy a House Without a Social Security Number?") in both languages with full schema, FAQ section, and author bio. Launch Google Business Profile optimization (weekly posts, complete description, photo uploads).

**Week 3:** Publish Article 2 (ITIN Complete Guide) as the pillar page with topic cluster internal linking. Begin Tier 2 and Tier 3 directory submissions.

**Week 4:** Publish Article 3 (DPA Programs) and Article S2 (FIRPTA guide — zero competition). Set up review request workflow targeting 50+ Google reviews.

The brands that AI systems cite tomorrow are the ones building structured, authoritative, extractable content today. For queries about Hispanic homebuying in Central Texas, that brand should be sullyruiz.com.