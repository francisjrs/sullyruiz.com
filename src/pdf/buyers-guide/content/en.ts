export const content = {
  locale: 'en',

  // Cover Page
  cover: {
    title: 'The Texas\nHome Buyer\'s Guide',
    subtitle: 'Your Roadmap to Homeownership',
    agentTitle: 'Your Personal Guide by',
    agentName: 'Sully Ruiz',
    edition: '2025 Edition',
    brokerage: 'Keller Williams Realty',
  },

  // Page 2: Welcome + Market Overview
  welcome: {
    chapterTitle: 'Welcome',
    greeting: 'Welcome to Your Home Buying Journey',
    message: `Thank you for taking the first step toward finding your Texas home. Whether you're a first-time buyer or relocating to the Lone Star State, this guide will walk you through every step of the process. The Texas real estate market moves fast, but with the right preparation and guidance, you'll be ready to find the perfect home for you and your family.`,
    signature: '— Sully Ruiz',
  },

  marketOverview: {
    sectionTitle: 'Austin & Central Texas Market Snapshot',
    intro: `The Central Texas real estate market continues to be one of the most dynamic in the nation. Here's what you need to know heading into 2025:`,
    stats: [
      { label: 'Austin Metro Median Price', value: '$450,000 - $550,000' },
      { label: 'Round Rock / Georgetown', value: '$400,000 - $480,000' },
      { label: 'San Marcos / Kyle', value: '$320,000 - $400,000' },
      { label: 'Average Days on Market', value: '45-60 days' },
    ],
    timing: {
      title: 'Best Time to Buy',
      content: `While spring and summer see the most listings, savvy buyers know that fall and winter often bring less competition and more motivated sellers. The key is being prepared when the right home appears.`,
    },
    callout: {
      title: 'Texas Truth',
      content: `In Texas, the market moves fast. Homes in desirable areas can receive multiple offers within days. Having your pre-approval ready and a trusted agent by your side makes all the difference.`,
    },
  },

  // Pages 3-5: The Home Buying Journey (5 Steps)
  steps: {
    chapterTitle: 'The Home Buying Journey',
    chapterNumber: 'Chapter One',
    intro: `Every successful home purchase follows a proven path. Here are the five essential steps that will take you from dreaming to owning.`,

    items: [
      {
        number: 1,
        title: 'Get Pre-Approved',
        description: `Before you fall in love with a home, know exactly what you can afford. A pre-approval letter from a lender shows sellers you're a serious buyer and tells you your price range. Gather your financial documents—pay stubs, tax returns, bank statements—and meet with a lender to get started.`,
        tip: `A pre-approval is different from a pre-qualification. Pre-approval involves verification of your financial information and carries more weight with sellers. In competitive markets, it's often required to even submit an offer.`,
      },
      {
        number: 2,
        title: 'Find Your Dream Home',
        description: `Create two lists: your "must-haves" and your "nice-to-haves." Be realistic about what you need versus what you want. Your real estate agent will set up personalized searches and schedule showings that match your criteria. Remember, no home is perfect—focus on what matters most to you.`,
        tip: `Don't try to go it alone. A buyer's agent costs you nothing (the seller pays the commission) and provides invaluable expertise on neighborhoods, pricing, negotiations, and the entire buying process.`,
      },
      {
        number: 3,
        title: 'Make a Winning Offer',
        description: `When you find "the one," it's time to make an offer. Your agent will help you determine a competitive price based on comparable sales and market conditions. In Texas, the option period—typically 7-10 days—gives you time to conduct inspections and back out if needed, for a small fee.`,
        tip: `The Texas option period is unique to our state. For a negotiable fee (usually $100-$500), you can terminate the contract for any reason during this period. It's your safety net—use it wisely.`,
      },
      {
        number: 4,
        title: 'Complete Due Diligence',
        description: `Once your offer is accepted, the clock starts ticking. You'll need to complete a home inspection, order an appraisal (your lender handles this), and work with a title company to ensure the property has a clear title. Any issues discovered can be negotiated with the seller during this phase.`,
        tip: `Never skip the home inspection. A qualified inspector will identify potential problems with the foundation, roof, electrical, plumbing, and more. This small investment can save you thousands down the road.`,
      },
      {
        number: 5,
        title: 'Close & Get Your Keys',
        description: `The finish line is in sight! Before closing, you'll do a final walkthrough to ensure the property is in the agreed-upon condition. At closing, you'll sign documents, pay closing costs, and receive the keys to your new home. In Texas, you can often close within 30-45 days of an accepted offer.`,
        tip: `Bring a valid ID and a cashier's check (or wire transfer confirmation) for your closing costs and down payment. Don't forget to set up utilities and change your address before moving day!`,
      },
    ],
  },

  // Page 6: Financing Made Simple
  financing: {
    chapterTitle: 'Financing Made Simple',
    chapterNumber: 'Chapter Two',
    intro: `Understanding your financing options is key to making informed decisions. Here's a breakdown of the most common loan types and Texas-specific programs that can help.`,

    loanComparison: {
      title: 'Loan Types Compared',
      headers: ['Loan Type', 'Down Payment', 'Best For'],
      rows: [
        ['Conventional', '3-20%', 'Good credit, stable income'],
        ['FHA', '3.5%', 'First-time buyers, lower credit scores'],
        ['VA', '0%', 'Veterans and active military'],
        ['USDA', '0%', 'Rural areas, income limits apply'],
      ],
    },

    texasPrograms: {
      title: 'Texas Programs & Assistance',
      items: [
        {
          name: 'TSAHC (Texas State Affordable Housing Corporation)',
          description: 'Down payment assistance and mortgage credit certificates for eligible buyers.',
        },
        {
          name: 'TDHCA (Texas Department of Housing)',
          description: 'My First Texas Home program offers competitive rates and down payment assistance.',
        },
        {
          name: 'Local City Programs',
          description: 'Many Texas cities offer additional assistance programs—ask your lender about options in your area.',
        },
      ],
    },

    keyCosts: {
      title: 'Key Costs to Know',
      items: [
        'Down Payment: Typically 3-20% of purchase price',
        'Closing Costs: 2-5% of loan amount (fees, title insurance, prepaid taxes)',
        'Property Taxes: Texas has no state income tax, but property taxes average 1.8-2.2% of home value annually',
        'Homeowners Insurance: Required by lenders, varies by location and coverage',
      ],
    },

    callout: {
      title: 'Money-Saving Tip',
      content: `Ask your lender about buying down your interest rate with "points." One point (1% of loan amount) can lower your rate by 0.25%. If you plan to stay in the home long-term, this can save thousands over the life of the loan.`,
    },
  },

  // Page 7: Top 5 Mistakes to Avoid
  mistakes: {
    chapterTitle: 'Top 5 Mistakes to Avoid',
    chapterNumber: 'Chapter Three',
    intro: `Even the most prepared buyers can stumble. Here are the most common pitfalls I see—and how to avoid them.`,

    items: [
      {
        number: 1,
        title: 'Not Getting Pre-Approved First',
        description: `Shopping without a pre-approval wastes time and can cost you the home you love. Sellers in competitive markets won't even consider offers without proof of financing.`,
      },
      {
        number: 2,
        title: 'Skipping the Home Inspection',
        description: `Even new construction can have issues. A $400-500 inspection can uncover problems that cost tens of thousands to repair. It's your best insurance against hidden surprises.`,
      },
      {
        number: 3,
        title: 'Making Big Purchases Before Closing',
        description: `That new car or furniture set can wait. Large purchases or new credit accounts can change your debt-to-income ratio and jeopardize your loan approval at the last minute.`,
      },
      {
        number: 4,
        title: 'Waiving the Option Period',
        description: `In hot markets, some buyers waive the option period to make their offer more attractive. This is risky—you lose your ability to back out if inspections reveal major problems.`,
      },
      {
        number: 5,
        title: 'Going It Alone',
        description: `Buying a home is the largest financial transaction most people ever make. A qualified real estate agent provides expertise, negotiation skills, and peace of mind—at no cost to you as the buyer.`,
      },
    ],
  },

  // Page 8: Checklist + Contact
  checklist: {
    chapterTitle: 'Your Buying Checklist',
    items: [
      'Check your credit score (aim for 620+)',
      'Calculate your budget (monthly payment ≤ 28% of income)',
      'Get pre-approved with a lender',
      'Create your must-have vs. nice-to-have list',
      'Find a trusted real estate agent',
      'Start your home search',
      'Make an offer and negotiate',
      'Complete inspection and appraisal',
      'Review closing documents',
      'Do final walkthrough',
      'Close and celebrate!',
    ],
  },

  contact: {
    sectionTitle: 'Let\'s Connect',
    message: `Ready to find your Texas home? I'm here to guide you through every step of the journey. Whether you're just starting to explore or ready to make an offer, let's talk about how I can help make your homeownership dreams a reality.`,
    cta: 'Ready to find your Texas home? Let\'s talk.',
    name: 'Sully Ruiz',
    title: 'Real Estate Agent',
    phone: '(512) 555-0123',
    email: 'sully@sullyruiz.com',
    website: 'sullyruiz.com',
  },

  // Footer
  footer: {
    agentName: 'Sully Ruiz',
    website: 'sullyruiz.com',
  },
};

export type GuideContent = typeof content;
