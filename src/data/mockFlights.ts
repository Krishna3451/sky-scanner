export interface FlightSegment {
  departure: {
    time: string;
    airport: string;
    city?: string;
  };
  arrival: {
    time: string;
    airport: string;
    city?: string;
  };
  duration: string;
  stops: number;
  layover?: {
    airport: string;
    duration: string;
  };
}

export interface Flight {
  id: string;
  airline: {
    name: string;
    code: string;
    logo?: string;
  };
  outbound: FlightSegment;
  inbound?: FlightSegment;
  price: number;
  currency: string;
  emissions?: string;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  price: number;
  image?: string;
}

export interface DatePrice {
  date: string;
  dayName: string;
  price: number;
  fullDate?: string;
  isCheapest?: boolean;
}

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: { name: 'IndiGo', code: '6E', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '10:25', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '13:20', airport: 'AGR', city: 'Agra' },
      duration: '2h 55m',
      stops: 0
    },
    inbound: {
      departure: { time: '14:00', airport: 'AGR', city: 'Agra' },
      arrival: { time: '16:45', airport: 'DEL', city: 'Delhi' },
      duration: '2h 45m',
      stops: 0
    },
    price: 14877,
    currency: 'INR',
    emissions: 'Low CO₂'
  },
  {
    id: '2',
    airline: { name: 'Air India', code: 'AI', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '08:30', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '11:50', airport: 'AGR', city: 'Agra' },
      duration: '3h 20m',
      stops: 1,
      layover: { airport: 'JAI', duration: '1h 15m' }
    },
    inbound: {
      departure: { time: '14:05', airport: 'AGR', city: 'Agra' },
      arrival: { time: '17:00', airport: 'DEL', city: 'Delhi' },
      duration: '2h 55m',
      stops: 0
    },
    price: 16845,
    currency: 'INR'
  },
  {
    id: '3',
    airline: { name: 'Vistara', code: 'UK', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '06:15', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '08:45', airport: 'AGR', city: 'Agra' },
      duration: '2h 30m',
      stops: 0
    },
    inbound: {
      departure: { time: '19:30', airport: 'AGR', city: 'Agra' },
      arrival: { time: '22:00', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 18250,
    currency: 'INR'
  },
  {
    id: '4',
    airline: { name: 'SpiceJet', code: 'SG', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '12:45', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '16:10', airport: 'AGR', city: 'Agra' },
      duration: '3h 25m',
      stops: 1,
      layover: { airport: 'HYD', duration: '55m' }
    },
    inbound: {
      departure: { time: '17:20', airport: 'AGR', city: 'Agra' },
      arrival: { time: '19:50', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 12450,
    currency: 'INR',
    emissions: 'Low CO₂'
  },
  {
    id: '5',
    airline: { name: 'IndiGo', code: '6E', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '15:30', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '18:15', airport: 'AGR', city: 'Agra' },
      duration: '2h 45m',
      stops: 0
    },
    inbound: {
      departure: { time: '20:00', airport: 'AGR', city: 'Agra' },
      arrival: { time: '22:30', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 15320,
    currency: 'INR'
  },
  {
    id: '6',
    airline: { name: 'Air India', code: 'AI', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '07:00', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '09:30', airport: 'AGR', city: 'Agra' },
      duration: '2h 30m',
      stops: 0
    },
    inbound: {
      departure: { time: '16:45', airport: 'AGR', city: 'Agra' },
      arrival: { time: '20:15', airport: 'DEL', city: 'Delhi' },
      duration: '3h 30m',
      stops: 1,
      layover: { airport: 'AMD', duration: '1h' }
    },
    price: 17890,
    currency: 'INR'
  },
  {
    id: '7',
    airline: { name: 'Vistara', code: 'UK', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '09:45', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '13:00', airport: 'AGR', city: 'Agra' },
      duration: '3h 15m',
      stops: 1,
      layover: { airport: 'BOM', duration: '45m' }
    },
    inbound: {
      departure: { time: '15:30', airport: 'AGR', city: 'Agra' },
      arrival: { time: '18:00', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 19650,
    currency: 'INR'
  },
  {
    id: '8',
    airline: { name: 'SpiceJet', code: 'SG', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '11:00', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '13:30', airport: 'AGR', city: 'Agra' },
      duration: '2h 30m',
      stops: 0
    },
    inbound: {
      departure: { time: '21:15', airport: 'AGR', city: 'Agra' },
      arrival: { time: '23:45', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 13290,
    currency: 'INR'
  },
  {
    id: '9',
    airline: { name: 'IndiGo', code: '6E', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '18:20', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '22:05', airport: 'AGR', city: 'Agra' },
      duration: '3h 45m',
      stops: 2,
      layover: { airport: 'JAI', duration: '1h 30m' }
    },
    inbound: {
      departure: { time: '08:00', airport: 'AGR', city: 'Agra' },
      arrival: { time: '10:30', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 11200,
    currency: 'INR',
    emissions: 'Low CO₂'
  },
  {
    id: '10',
    airline: { name: 'Air India', code: 'AI', logo: '/Indigo.png' },
    outbound: {
      departure: { time: '05:30', airport: 'DEL', city: 'Delhi' },
      arrival: { time: '08:00', airport: 'AGR', city: 'Agra' },
      duration: '2h 30m',
      stops: 0
    },
    inbound: {
      departure: { time: '22:00', airport: 'AGR', city: 'Agra' },
      arrival: { time: '00:30', airport: 'DEL', city: 'Delhi' },
      duration: '2h 30m',
      stops: 0
    },
    price: 16100,
    currency: 'INR'
  }
];

export const mockHotels: Hotel[] = [
  { id: '1', name: 'Hotel Shree Residency', stars: 3, rating: 7.5, price: 1320, image: '/hotel1.jpg' },
  { id: '2', name: 'ITC Mughal Resort & Spa', stars: 5, rating: 8.8, price: 16500, image: '/hotel2.jpg' },
  { id: '3', name: 'Hotel Mansingh', stars: 2, rating: 6.4, price: 463, image: '/hotel3.jpg' },
  { id: '4', name: 'The Oberoi Amarvilas', stars: 5, rating: 9.2, price: 28000 },
  { id: '5', name: 'Crystal Sarovar Premiere', stars: 4, rating: 8.1, price: 4500 },
  { id: '6', name: 'Radisson Hotel Agra', stars: 4, rating: 7.9, price: 5200 }
];

export const mockDatePrices: DatePrice[] = [
  { date: '13 Feb', dayName: 'Thu', price: 15200 },
  { date: '14 Feb', dayName: 'Fri', price: 16800 },
  { date: '15 Feb', dayName: 'Sat', price: 14877, isCheapest: false },
  { date: '16 Feb', dayName: 'Sun', price: 11200, isCheapest: true },
  { date: '17 Feb', dayName: 'Mon', price: 13500 },
  { date: '18 Feb', dayName: 'Tue', price: 14200 },
  { date: '19 Feb', dayName: 'Wed', price: 15900 }
];

export function formatPrice(price: number, currency: string = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currency} ${price.toFixed(2)}`;
  }
}
