import type { ImageSourcePropType } from 'react-native';
import { FranshiseChip, FranshiseFilterChip, PropertyCardProps, TeamCardProps, Partner } from '../types';

export type RelatedFranchise = {
  id: string;
  image: string;
  title: string;
  price: string;
};

export type FranchiseItem = {
  id: number;
  title: string;
  description: string;
  companyOverview: string;
  investmentRange: string;
  totalInvestment: string;
  franchiseFee: string;
  royaltyFee: string;
  tag?: string;
  imageSource?: ImageSourcePropType;
  images?: string[];
  sectionImages?: {
    totalInvestment?: string;
    franchiseFee?: string;
    royaltyFee?: string;
    about?: string;
  };
  videoUrl?: string;
  relatedFranchises?: RelatedFranchise[];

};



export const franchiseFilters: FranshiseFilterChip[] = [
  { id: 'coffee', label: 'Coffee & Tea' },
  { id: 'fastfood', label: 'Fast Food' },
  { id: 'fitness', label: 'Fitness & Gym' },
  { id: 'education', label: 'Education' },
  { id: 'retail', label: 'Retail' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'tech', label: 'Technology' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'home', label: 'Home Services' },
  { id: 'pet', label: 'Pet Care' },
];


// ─── International Franchises ────────────────────────────────────────────────
export const internationalFranchises: FranchiseItem[] = [
  {
    id: 1,
    tag: 'Global Leader',
    title: "McDonald's",
    description:
      'World’s largest fast‑food chain, serving burgers and fries in over 100 countries with proven operational systems.',
    companyOverview:
      'McDonald’s was founded in 1955 and has become a global icon with over 38,000 restaurants. Its franchise model offers extensive training, supply chain expertise, and brand recognition.',
    investmentRange: '$1M – $2.2M',
    totalInvestment: '$1,000,000 – $2,300,000',
    franchiseFee: '$45,000',
    royaltyFee: '4% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=rG-EkVJFv2Q',
    relatedFranchises: [
      { id: 'rf-1', image: 'https://images.unsplash.com/photo-1618843158465-d962c111c96e?q=80&w=690&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Subway', price: '$150k – $300k' },
      { id: 'rf-2', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop', title: "Domino's Pizza", price: '$120k – $500k' },
    ],
  },
  {
    id: 2,
    tag: 'Coffee Giant',
    title: 'Starbucks',
    description:
      'Global coffeehouse brand with a strong focus on premium coffee, store experience, and community engagement.',
    companyOverview:
      'Starbucks was established in 1971 and now operates over 35,000 stores worldwide. The franchise (licensed stores) model emphasises premium quality and customer experience.',
    investmentRange: '$315k – $2.9M',
    totalInvestment: '$315,000 – $2,900,000',
    franchiseFee: '$50,000',
    royaltyFee: '6% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=cQScQyLdDME',
    relatedFranchises: [
      { id: 'rf-3', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', title: "McDonald's", price: '$1M – $2.2M' },
      { id: 'rf-4', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop', title: "Domino's Pizza", price: '$120k – $500k' },
    ],
  },
  {
    id: 3,
    tag: 'Fast & Healthy',
    title: 'Subway',
    description:
      'World’s largest submarine sandwich franchise, offering fresh, customisable meals in more than 100 countries.',
    companyOverview:
      'Subway started in 1965 and has grown to over 37,000 locations. It’s known for its lower investment costs and flexibility in store formats.',
    investmentRange: '$150k – $300k',
    totalInvestment: '$150,000 – $300,000',
    franchiseFee: '$15,000',
    royaltyFee: '8% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=6fidL51oakg',
    relatedFranchises: [
      { id: 'rf-5', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', title: "McDonald's", price: '$1M – $2.2M' },
      { id: 'rf-6', image: 'https://images.unsplash.com/photo-1526367790999-015e5a4b97f4?w=200&h=200&fit=crop', title: '7-Eleven', price: '$250k – $1.5M' },
    ],
  },
  {
    id: 4,
    tag: 'Convenience',
    title: '7‑Eleven',
    description:
      'Leading international convenience store chain with 24/7 operations, offering groceries, snacks, and services.',
    companyOverview:
      '7‑Eleven began in 1927 and now operates over 70,000 stores globally. Its franchise model provides a turnkey convenience retail solution.',
    investmentRange: '$250k – $1.5M',
    totalInvestment: '$250,000 – $1,500,000',
    franchiseFee: '$30,000',
    royaltyFee: '5% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1526367790999-015e5a4b97f4?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1526367790999-015e5a4b97f4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=-2LQZbeV4HQ',
    relatedFranchises: [
      { id: 'rf-16', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&h=200&fit=crop', title: 'Subway', price: '$150k – $300k' },
      { id: 'rf-8', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop', title: "Domino's Pizza", price: '$120k – $500k' },
    ],
  },
  {
    id: 5,
    tag: 'Fitness Empire',
    title: 'Anytime Fitness',
    description:
      'Fast‑growing global gym franchise with 24/7 access, small footprint, and low operating costs.',
    companyOverview:
      'Founded in 2002, Anytime Fitness has over 5,000 gyms in 50+ countries. It offers a low‑cost, high‑support franchise system.',
    investmentRange: '$350k – $600k',
    totalInvestment: '$350,000 – $600,000',
    franchiseFee: '$50,000',
    royaltyFee: '7% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=OnYYdLRSNVY',
    relatedFranchises: [
      { id: 'rf-9', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop', title: 'Starbucks', price: '$315k – $2.9M' },
      { id: 'rf-17', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=200&fit=crop', title: 'Kumon', price: '$70k – $150k' },
    ],
  },
  {
    id: 6,
    tag: 'Pizza Icon',
    title: "Domino's Pizza",
    description:
      'Global pizza delivery chain known for innovation in technology, menu, and efficient supply chain.',
    companyOverview:
      "Domino's was founded in 1960 and has over 17,000 stores worldwide. It's renowned for its delivery focus and digital ordering innovation.",
    investmentRange: '$120k – $500k',
    totalInvestment: '$120,000 – $500,000',
    franchiseFee: '$25,000',
    royaltyFee: '5.5% of gross sales',
    imageSource: {
      uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
    },
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    relatedFranchises: [
      { id: 'rf-11', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', title: "McDonald's", price: '$1M – $2.2M' },
      { id: 'rf-12', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&h=200&fit=crop', title: 'Subway', price: '$150k – $300k' },
    ],
  },
  {
    id: 7,
    tag: 'Education',
    title: 'Kumon',
    description:
      'World‑renowned after‑school math and reading program with a proven curriculum and low‑overhead model.',
    companyOverview:
      'Kumon was founded in 1958 in Japan and now serves over 4 million students in 50+ countries. It’s a low‑cost, home‑based franchise opportunity.',
    investmentRange: '$70k – $150k',
    totalInvestment: '$70,000 – $150,000',
    franchiseFee: '$20,000',
    royaltyFee: '10% of gross sales',
    images: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop',
    },
    // No image – will show fallback background
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    relatedFranchises: [
      { id: 'rf-18', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', title: 'Anytime Fitness', price: '$350k – $600k' },
    ],
  },
];

// ─── Local / Artisan Franchises ──────────────────────────────────────────────
export const franchiseData: FranchiseItem[] = [
  {
    id: 1,
    tag: 'Trending Now',
    title: 'Aura Coffee Co.',
    description:
      'Specialty artisan coffee experience with scalable architectural retail units.',
    companyOverview:
      'Founded in 2015, Aura Coffee Co. has grown from a single roastery to a lifestyle brand with over 200 locations worldwide, known for its minimalist design and ethically sourced beans.',
    investmentRange: '$250k – $400k',
    totalInvestment: '$280,000 – $420,000',
    franchiseFee: '$45,000',
    royaltyFee: '6% of gross sales',
    imageSource: { uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop' },
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    relatedFranchises: [
      { id: 'rf-19', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', title: 'FitZone Gym', price: '$500k – $1M' },
      { id: 'rf-20', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop', title: 'GreenLeaf Organic Market', price: '$200k – $450k' },
    ],
  },
  {
    id: 2,
    tag: 'Hot Deal',
    title: 'The Burger Lab',
    description:
      'Gourmet burger franchise with a focus on locally sourced ingredients and a modern twist on classic recipes.',
    companyOverview:
      'The Burger Lab was launched in 2018 by a Michelin‑starred chef to bring fine‑dining quality burgers to the masses. With 50+ locations across the US and Europe, it’s a fast‑growing concept.',
    investmentRange: '$150k – $300k',
    totalInvestment: '$180,000 – $320,000',
    franchiseFee: '$35,000',
    royaltyFee: '5% of gross sales',
    imageSource: { uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=400&fit=crop' },
    images: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    relatedFranchises: [
      { id: 'rf-21', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop', title: 'Aura Coffee Co.', price: '$250k – $400k' },
      { id: 'rf-22', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop', title: 'TechHub Coworking', price: '$350k – $600k' },
    ],
  },
  {
    id: 3,
    tag: 'Popular',
    title: 'FitZone Gym',
    description:
      'High‑intensity fitness franchise offering 24/7 access, group classes, and personalised training programs.',
    companyOverview:
      'FitZone started in 2010 as a small bootcamp studio and has exploded to 300+ gyms in 15 countries. Known for its community‑driven approach and innovative fitness technology.',
    investmentRange: '$500k – $1M',
    totalInvestment: '$550,000 – $1,100,000',
    franchiseFee: '$60,000',
    royaltyFee: '7% of gross sales',
    imageSource: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop' },
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=RgKAFK5djSk',
    relatedFranchises: [
      { id: 'rf-23', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop', title: 'Aura Coffee Co.', price: '$250k – $400k' },
      { id: 'rf-24', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop', title: 'GreenLeaf Organic Market', price: '$200k – $450k' },
    ],
  },
  {
    id: 4,
    tag: 'New',
    title: 'TechHub Coworking',
    description:
      'Innovative coworking spaces designed for startups, freelancers, and remote teams with all‑in‑one amenities.',
    companyOverview:
      'TechHub was founded in 2017 by serial entrepreneurs who wanted to create a global network of high‑tech, design‑led workspaces. It now operates in 25 cities across 4 continents.',
    investmentRange: '$350k – $600k',
    totalInvestment: '$380,000 – $620,000',
    franchiseFee: '$50,000',
    royaltyFee: '6% of gross sales',
    imageSource: { uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop' },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop',
    },
    videoUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    relatedFranchises: [
      { id: 'rf-25', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop', title: 'The Burger Lab', price: '$150k – $300k' },
      { id: 'rf-26', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop', title: 'GreenLeaf Organic Market', price: '$200k – $450k' },
    ],
  },
  {
    id: 5,
    tag: 'Eco‑Friendly',
    title: 'GreenLeaf Organic Market',
    description:
      'Organic grocery and cafe franchise with a commitment to sustainability and community wellness.',
    companyOverview:
      'GreenLeaf was born in 2012 out of a single organic farm store. Today it’s a beloved brand with 80+ eco‑conscious markets that combine grocery, deli, and café in one space.',
    investmentRange: '$200k – $450k',
    totalInvestment: '$220,000 – $470,000',
    franchiseFee: '$40,000',
    royaltyFee: '5.5% of gross sales',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506275492151-2906a581e1ff?w=800&h=500&fit=crop',
    ],
    sectionImages: {
      totalInvestment: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=300&fit=crop',
      franchiseFee: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop',
      royaltyFee: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
      about: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop',
    },
    // No image – will fall back to a placeholder background
    videoUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
    relatedFranchises: [
      { id: 'rf-27', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop', title: 'Aura Coffee Co.', price: '$250k – $400k' },
    ],
  },
];

export const propertyData: PropertyCardProps[] = [
  {
    id: 0,
    tag: 'Commercial',
    title: 'Shiraz Agora',
    description:
      'A high-visibility commercial agora on Main University Road, Peshawar — the city’s busiest retail artery — offering basement, ground and upper floors for brands and investors.',
    marketValue: '$1.2M',
    details: { type: 'Mixed Use', size: 'Multi-storey', yield: '10.5%' },
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    listedAt: '21-Apr-2026 16:45',
    status: 'Available',
    city: 'Peshawar',
    address: 'Main University Road, Peshawar',
    floors: ['Basement', 'Ground Floor', 'Upper Floor'],
    opportunity: 'Investors and Brands required',
  },
  {
    id: 1,
    tag: 'Retail',
    title: 'Downtown Retail Plaza',
    description: 'Prime retail space in the heart of downtown featuring 12 storefronts with modern amenities, ample parking, and high foot traffic.',
    marketValue: '$2.4M',
    details: { type: 'Retail', size: '3,200 sq ft', yield: '8.5%' },
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    tag: 'Office',
    title: 'Millennium Business Tower',
    description: 'Class-A office tower with floor-to-ceiling glass, co-working annex, on-site cafeteria, and direct transit access.',
    marketValue: '$5.8M',
    details: { type: 'Office', size: '12,500 sq ft', yield: '9.2%' },
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    tag: 'Retail',
    title: 'Sunset Strip Mall',
    description: 'Iconic strip mall with strong anchor tenants, 24-hour gym, drive-through lanes, and dedicated delivery bays.',
    marketValue: '$3.1M',
    details: { type: 'Retail', size: '8,000 sq ft', yield: '7.8%' },
    imageUrl: 'https://images.unsplash.com/photo-1582407949804-f0a0628c9a47?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    tag: 'Industrial',
    title: 'Harborview Logistics Hub',
    description: '45,000 sq ft warehouse & distribution center near the port with 12 loading docks, climate control, and 30-ft ceilings.',
    marketValue: '$4.2M',
    details: { type: 'Warehouse', size: '45,000 sq ft', yield: '10.1%' },
    imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    tag: 'Commercial',
    title: 'Greenfield Commercial Park',
    description: 'Modern business park with 5 standalone units, shared courtyard, EV charging stations, and proximity to highway 35.',
    marketValue: '$1.9M',
    details: { type: 'Mixed Use', size: '5,800 sq ft', yield: '6.9%' },
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    tag: 'Mixed Use',
    title: 'City Center Plaza',
    description: 'Mixed-use building with ground-floor retail, 3 floors of office suites, and a rooftop terrace with skyline views.',
    marketValue: '$7.5M',
    details: { type: 'Mixed Use', size: '18,200 sq ft', yield: '11.3%' },
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    tag: 'Retail',
    title: 'Westside Shopping Center',
    description: 'Community shopping center anchored by a grocery chain, featuring 18 units across 85,000 sq ft with a central plaza.',
    marketValue: '$6.3M',
    details: { type: 'Retail', size: '85,000 sq ft', yield: '8.9%' },
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    tag: 'Office',
    title: 'Tech Haven Co-Working',
    description: 'Three-story co-working facility with open floor plans, private pods, two conference rooms, and a café on the ground floor.',
    marketValue: '$3.6M',
    details: { type: 'Office', size: '6,400 sq ft', yield: '7.2%' },
    imageUrl: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=400&h=300&fit=crop',
  },
];



export const teamMembers: TeamCardProps[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Head of Investments',
    image: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Director of Operations',
    image: { uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Senior Analyst',
    image: { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Marketing Lead',
    image: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
  },
  {
    id: 6,
    name: 'James Okafor',
    role: 'Legal Counsel',
    image: { uri: 'https://images.unsplash.com/photo-1556157382-97eda2f9e2b0?w=400&h=400&fit=crop' },
  },
  {
    id: 7,
    name: 'Emma Watson',
    role: 'Client Relations',
    image: { uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
  },
];

export const partnersData: Partner[] = [
  {
    id: 1,
    name: 'Starbucks',
    logo: { uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop' },
    description: 'Global coffeehouse chain with 35,000+ locations worldwide.',
  },
  {
    id: 2,
    name: "McDonald's",
    logo: { uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
    description: 'World\'s largest fast-food chain serving 69 million customers daily.',
  },
  {
    id: 3,
    name: '7-Eleven',
    logo: { uri: 'https://images.unsplash.com/photo-1526367790999-015e5a4b97f4?w=200&h=200&fit=crop' },
    description: 'Leading convenience store chain operating in 18 countries.',
  },
  {
    id: 4,
    name: 'Anytime Fitness',
    logo: { uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
    description: '24/7 fitness franchise with over 5,000 gyms worldwide.',
  },
  {
    id: 5,
    name: "Domino's Pizza",
    logo: { uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
    description: 'Global pizza delivery giant with 20,000+ stores in 90 markets.',
  },
  {
    id: 6,
    name: 'Kumon',
    logo: { uri: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=200&fit=crop' },
    description: 'World\'s largest after-school math and reading program.',
  },
  {
    id: 7,
    name: 'Subway',
    logo: { uri: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&h=200&fit=crop' },
    description: 'Fresh-made sandwich franchise with 37,000+ locations globally.',
  },
  {
    id: 8,
    name: 'Hilton Hotels',
    logo: { uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop' },
    description: 'Premium hospitality brand with 7,000+ properties worldwide.',
  },
];
