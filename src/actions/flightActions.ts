'use server';

import { searchAirports, searchFlights, SearchParams } from '@/services/flightService';

export async function searchAirportsAction(query: string) {
    try {
        const results = await searchAirports(query);
        // Serialize data to avoid "Plain Object" errors with complex Duffel types if any
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error('Action Error - searchAirports:', error);
        return [];
    }
}

export async function searchFlightsAction(params: SearchParams) {
    try {
        const results = await searchFlights(params);
        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error('Action Error - searchFlights:', error);
        return [];
    }
}
