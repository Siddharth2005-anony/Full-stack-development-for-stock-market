export const COMPANY_PROFILES = {
  ITC: {
    symbol: "ITC",
    name: "ITC Limited",
    sector: "FMCG, Hotels, Agri & Paperboards",
    headquarters: "Kolkata, India",
    marketCap: "₹5.40T",
    description:
      "ITC has evolved into a diversified consumer powerhouse with strong cash flows from cigarettes and fast-growing FMCG brands across foods, personal care, and home essentials.",
    annualRevenue: [
      { year: "2022", value: 0.62 },
      { year: "2023", value: 0.69 },
      { year: "2024", value: 0.77 },
      { year: "2025", value: 0.84 },
    ],
    highlights: [
      "FMCG premiumization across staples and personal care",
      "Asset-light expansion in hotels and distribution",
      "Sustainability-led packaging and agri sourcing",
    ],
  },
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy, Retail, Telecom & Digital",
    headquarters: "Mumbai, India",
    marketCap: "₹19.60T",
    description:
      "Reliance combines scale in refining and petrochemicals with high-growth consumer businesses in telecom and retail, making it one of the broadest business ecosystems in India.",
    annualRevenue: [
      { year: "2022", value: 8.65 },
      { year: "2023", value: 9.38 },
      { year: "2024", value: 9.96 },
      { year: "2025", value: 10.72 },
    ],
    highlights: [
      "Digital monetization through Jio and platform offerings",
      "Retail footprint expansion with omnichannel strategy",
      "Gradual shift toward green energy investments",
    ],
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT Services & Consulting",
    headquarters: "Mumbai, India",
    marketCap: "₹13.90T",
    description:
      "TCS is a globally diversified IT services leader with deep enterprise relationships and robust execution in cloud migration, platform engineering, and AI-enabled transformation.",
    annualRevenue: [
      { year: "2022", value: 2.11 },
      { year: "2023", value: 2.32 },
      { year: "2024", value: 2.48 },
      { year: "2025", value: 2.66 },
    ],
    highlights: [
      "Large-deal momentum in BFSI and manufacturing",
      "Focus on productivity-led AI service delivery",
      "Strong operating discipline and retention programs",
    ],
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys",
    sector: "IT Services & Consulting",
    headquarters: "Bengaluru, India",
    marketCap: "₹7.10T",
    description:
      "Infosys continues to strengthen digital engineering and cloud services while balancing cost optimization programs for global clients navigating macro uncertainty.",
    annualRevenue: [
      { year: "2022", value: 1.48 },
      { year: "2023", value: 1.59 },
      { year: "2024", value: 1.69 },
      { year: "2025", value: 1.82 },
    ],
    highlights: [
      "Enterprise cloud and cybersecurity modernization",
      "Reskilling talent pool for AI-native delivery",
      "Margin support through automation and efficiency",
    ],
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Banking & Financial Services",
    headquarters: "Mumbai, India",
    marketCap: "₹12.80T",
    description:
      "HDFC Bank leverages its retail franchise and corporate banking network to drive consistent credit growth, while improving digital servicing and cross-sell efficiency post-merger.",
    annualRevenue: [
      { year: "2022", value: 1.72 },
      { year: "2023", value: 1.84 },
      { year: "2024", value: 2.03 },
      { year: "2025", value: 2.22 },
    ],
    highlights: [
      "Retail and SME lending expansion with controlled risk",
      "Digital onboarding and payments ecosystem depth",
      "Synergy capture from broader customer base",
    ],
  },
  BPCL: {
    symbol: "BPCL",
    name: "Bharat Petroleum",
    sector: "Oil & Gas Refining and Marketing",
    headquarters: "Mumbai, India",
    marketCap: "₹1.35T",
    description:
      "BPCL operates a large refining and fuel distribution network and is gradually diversifying into petrochemicals and cleaner mobility segments.",
    annualRevenue: [
      { year: "2022", value: 4.21 },
      { year: "2023", value: 4.74 },
      { year: "2024", value: 4.46 },
      { year: "2025", value: 4.95 },
    ],
    highlights: [
      "Refining optimization and higher throughput strategy",
      "Marketing network expansion in high-demand corridors",
      "Capex push in gas and low-carbon opportunities",
    ],
  },
  MRF: {
    symbol: "MRF",
    name: "MRF Limited",
    sector: "Automotive Components (Tyres)",
    headquarters: "Chennai, India",
    marketCap: "₹0.62T",
    description:
      "MRF is a premium tyre brand known for quality and pricing power, supported by broad replacement demand and increasing presence across passenger and commercial segments.",
    annualRevenue: [
      { year: "2022", value: 0.24 },
      { year: "2023", value: 0.26 },
      { year: "2024", value: 0.29 },
      { year: "2025", value: 0.32 },
    ],
    highlights: [
      "Premium segment mix improving realization per tyre",
      "Distribution resilience in replacement channels",
      "Raw material cost management supports margins",
    ],
  },
  IDFCFIRSTB: {
    symbol: "IDFCFIRSTB",
    name: "IDFC First Bank",
    sector: "Banking & Financial Services",
    headquarters: "Mumbai, India",
    marketCap: "₹0.61T",
    description:
      "IDFC First Bank is scaling its retail-focused banking model with improved deposit franchise quality, digital-first customer acquisition, and selective credit growth.",
    annualRevenue: [
      { year: "2022", value: 0.26 },
      { year: "2023", value: 0.31 },
      { year: "2024", value: 0.37 },
      { year: "2025", value: 0.43 },
    ],
    highlights: [
      "Retail liabilities franchise strengthening year over year",
      "Digitally enabled lending and servicing journeys",
      "Granular portfolio mix with improving profitability",
    ],
  },
};

export const DEFAULT_SYMBOL = "ITC";

export const COMPANY_LIST = Object.values(COMPANY_PROFILES);
