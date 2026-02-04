'use server';

import { searchAirports } from '@/services/flightService';

/**
 * Server action to search for airports
 * This securely calls the Duffel API from the server side
 */
export async function searchAirportsAction(query: string) {
    if (!query) return [];


    try {
        const results = await searchAirports(query);
        return results;
    } catch (error) {
        console.error("Error in searchAirportsAction:", error);
        return [];
    }
}

import { searchFlights } from '@/services/flightService';
import { SearchParams } from '@/types/flight';

/**
 * Server action to search for flights
 * This securely calls the Duffel API from the server side
 */
export async function searchFlightsAction(params: SearchParams) {
    try {
        const results = await searchFlights(params);
        return results;
    } catch (error) {
        console.error("Error in searchFlightsAction:", error);
        return [];
    }
}

import { getOfferById } from '@/services/flightService';
import { Flight } from '@/types/flight';

/**
 * Server action to get flight offer by ID
 */
export async function getOfferByIdAction(id: string): Promise<Flight | null> {
    try {
        return await getOfferById(id);
    } catch (error) {
        console.error("Error in getOfferByIdAction:", error);
        return null;
    }
}
