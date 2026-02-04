export interface Airport {
    code: string;
    city: string;
    name: string;
    country: string;
    distance: string | null;
}

/**
 * Commonly used airports for quick selection
 */
export const AIRPORTS: Airport[] = [
    { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport", country: "India", distance: null },
    { code: "SXV", city: "Salem", name: "Salem Airport", country: "India", distance: "160 km from Bengaluru" },
    { code: "MYQ", city: "Mysore", name: "Mysore Airport", country: "India", distance: "128 km from Bengaluru" },
    { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India", distance: null },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj", country: "India", distance: null },
    { code: "AGR", city: "Agra", name: "Agra Airport", country: "India", distance: null },
    { code: "GOI", city: "Goa", name: "Goa International Airport", country: "India", distance: null },
    { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", distance: null },
    { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India", distance: null },
    { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose", country: "India", distance: null },
    { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE", distance: null },
    { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore", distance: null },
    { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK", distance: null },
];

/**
 * IATA code to city name mapping for display purposes
 */
export const CITY_NAMES: Record<string, string> = {
    'DEL': 'Delhi',
    'AGR': 'Agra',
    'BOM': 'Mumbai',
    'BLR': 'Bangalore',
    'LHR': 'London',
    'DXB': 'Dubai',
    'SIN': 'Singapore',
    'HYD': 'Hyderabad',
    'MAA': 'Chennai',
    'CCU': 'Kolkata',
    'GOI': 'Goa',
    'MYQ': 'Mysore',
    'SXV': 'Salem',
};

/**
 * Get city name from IATA code, returns code if not found
 */
export const getCityName = (code: string): string => CITY_NAMES[code] || code;

/**
 * Available cabin classes
 */
export const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"] as const;
export type CabinClass = typeof CABIN_CLASSES[number];
