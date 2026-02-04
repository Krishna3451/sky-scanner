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
    // Detailed segments for the itinerary view
    segments?: {
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
        mkCarrier: {
            name: string;
            code: string;
            logo?: string;
        };
        opCarrier?: {
            name: string;
            code: string;
        };
        flightNumber: string;
    }[];
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

export interface DatePrice {
    date: string;
    dayName: string;
    price: number;
    fullDate?: string;
    isCheapest?: boolean;
}

export interface SearchParams {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    adults: number;
    cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface FilterState {
    stops: number[];
    airlines: string[];
    departureTime: [number, number];
    duration: number;
}
