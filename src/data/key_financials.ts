export interface FinancialSegment {
  name: string;
  category: string;
  description: string;
  keyMetrics: string;
  highlights: string[];
}

export interface CompanyFactsheet {
  companyName: string;
  reportingPeriod: string;
  headlineRevenue: string;
  ebitda: string;
  netProfit: string;
  totalAssets: string;
  marketCapRank: string;
  segments: FinancialSegment[];
  riskFactors: { category: string; description: string }[];
}

export const RELIANCE_FACTSHEET: CompanyFactsheet = {
  companyName: 'Reliance Industries Limited (RIL)',
  reportingPeriod: 'Integrated Annual Report 2025-26',
  headlineRevenue: '₹10,00,122 Cr (Gross Turnover)',
  ebitda: '₹1,78,225 Cr',
  netProfit: '₹79,020 Cr',
  totalAssets: '₹18,50,000+ Cr',
  marketCapRank: '#1 Most Valued Company in India',
  segments: [
    {
      name: 'Oil to Chemicals (O2C)',
      category: 'Energy & Refining',
      description: 'World-scale integrated refining and petrochemicals complex in Jamnagar, Gujarat. Produces transportation fuels, polymers, polyesters, and aromatics.',
      keyMetrics: 'Over 68 MMT throughput capacity, leading regional margin capture',
      highlights: [
        'Jamnagar refinery operates at near 100% operating rates with top Nelson Complexity Index',
        'Integration with petrochemicals allows nimble product-mix optimization based on crack spreads',
        'Continued leadership in domestic polymers and synthetic polyester yarn market'
      ]
    },
    {
      name: 'Reliance Retail',
      category: 'Consumer & Commerce',
      description: 'India\'s largest omnichannel retailer across grocery, electronics, fashion & lifestyle, and pharmacy with extensive footprint and supply chain network.',
      keyMetrics: '18,800+ physical stores, 1.1+ billion customer footfalls, ₹3,06,786 Cr revenue',
      highlights: [
        'Rapid digital commerce integration through JioMart and Ajio',
        'Hyperlocal store network spanning Tier 1 to Tier 4 Indian cities',
        'Deep backwards integration with farmers, artisans, and FMCG brands'
      ]
    },
    {
      name: 'Jio Platforms (Digital Services)',
      category: 'Telecom & Tech',
      description: 'Next-generation digital powerhouse providing nationwide 5G/4G connectivity, high-speed fiber broadband, enterprise cloud, and digital media platforms.',
      keyMetrics: '490+ Million subscribers, 130+ Exabytes annual data traffic',
      highlights: [
        'Full nationwide rollout of True 5G standalone (SA) network architecture',
        'JioAirFiber scaling rapidly to connect homes and small businesses',
        'Proprietary cloud, AI infrastructure, and digital entertainment services'
      ]
    },
    {
      name: 'Oil and Gas (E&P)',
      category: 'Upstream Exploration',
      description: 'Deepwater gas production operations in the Krishna Godavari (KG-D6) basin in partnership with bp, meeting critical national clean energy demand.',
      keyMetrics: 'Producing ~30 MMSCMD of natural gas, ~30% of India\'s domestic gas output',
      highlights: [
        'Key MJ, R-Cluster, and Satellite Cluster fields operating at steady plateau',
        'Substantial contribution to India\'s target to raise natural gas share in primary energy mix'
      ]
    },
    {
      name: 'New Energy & Giga Factories',
      category: 'Clean Tech & Transition',
      description: 'Pioneering clean energy ecosystem at Dhirubhai Ambani Green Energy Giga Complex in Jamnagar to enable India\'s Net Carbon Zero target by 2035.',
      keyMetrics: '5 Giga Factories: Solar PV, Energy Storage, Green Hydrogen, Fuel Cells, Power Electronics',
      highlights: [
        'Fully integrated 20 GW Solar Photovoltaic manufacturing facility',
        'Advanced chemistry cell battery giga-factory for utility & EV storage',
        'Electrolyzer manufacturing and green ammonia export pathways'
      ]
    },
    {
      name: 'Media & Entertainment',
      category: 'Media & Content',
      description: 'Leading television broadcast network (Network18/Colors) and digital streaming platform (JioCinema) in strategic venture with Disney.',
      keyMetrics: 'Dominant reach in Indian sports (IPL, BCCI, Olympics) and digital streaming',
      highlights: [
        'Creation of India\'s largest entertainment joint venture with Disney Star',
        'Record-breaking concurrent streaming viewership on JioCinema'
      ]
    }
  ],
  riskFactors: [
    {
      category: 'Commodity & Crack Spread Volatility',
      description: 'Crude oil prices, refining crack margins, and petrochemical prices fluctuate according to global macroeconomic cycles, geopolitical conflicts, and demand shifts.'
    },
    {
      category: 'Foreign Exchange & Interest Rates',
      description: 'Reliance imports significant quantities of crude feedstock priced in US dollars and maintains debt financing subject to global and domestic interest rate cycles.'
    },
    {
      category: 'Regulatory & Tariff Changes',
      description: 'Energy windfall taxes, export duties, telecom spectrum policies, retail FDI regulations, and customs duties can influence operating profits.'
    },
    {
      category: 'Capital Intensity in Energy Transition',
      description: 'Large-scale capital expenditure for the New Energy Giga Complex and 5G network expansion requires disciplined payback timelines and execution.'
    },
    {
      category: 'Technological & Competitive Shifts',
      description: 'Intense digital competition across telecom, cloud, OTT media streaming, and retail e-commerce necessitates rapid innovation.'
    }
  ]
};
