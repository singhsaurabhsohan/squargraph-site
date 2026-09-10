export const ALLOWED_ORIGINS = new Set([
  'https://squargraph.com',
  'https://www.squargraph.com',
  'http://127.0.0.1:4177',
  'http://localhost:4177',
]);

export const PRODUCTS = {
  discovery: {
    name: 'Discovery Session™',
    description: '30-min founder-led brand strategy session',
    amount: 299900,
    currency: 'INR',
  },
  audit: {
    name: 'Brand Growth Audit™',
    description: 'Full digital brand communication & growth audit',
    amount: 999900,
    currency: 'INR',
  },
  sprint: {
    name: 'Brand Foundation Sprint™',
    description: 'Complete brand system in 3 weeks',
    amount: 4999900,
    currency: 'INR',
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
