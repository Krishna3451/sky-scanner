
import { duffel } from '@/lib/duffel';
import { Flight, FlightSegment, SearchParams } from '@/types/flight';
import { convertToINR, DEFAULT_CURRENCY } from '@/constants/currencies';

/**
 * Search for airports/places by query string
 */
export const searchAirports = async (query: string) => {
    if (!query) return [];
    try {
        const response = await duffel.suggestions.list({
            query: query,
        });
        return response.data;
    } catch (error) {
        console.error('Error searching airports:', error);
        return [];
    }
};

/**
 * Get a single flight offer by ID
 */
export const getOfferById = async (id: string): Promise<Flight | null> => {
    try {
        const offer = await duffel.offers.get(id);
        return mapDuffelOfferToFlight(offer.data);
    } catch (error) {
        console.error('Error fetching flight offer:', error);
        return null;
    }
};

/**
 * Search for flights based on search parameters
 */
export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
    try {
        const slices: any[] = [
            {
                origin: params.from,
                destination: params.to,
                departure_date: params.departDate,
            },
        ];

        if (params.returnDate) {
            slices.push({
                origin: params.to,
                destination: params.from,
                departure_date: params.returnDate,
            });
        }

        const offerRequest = await duffel.offerRequests.create({
            slices: slices,
            passengers: Array(params.adults).fill({ type: 'adult' }),
            cabin_class: params.cabinClass,
        });

        const offers = await duffel.offers.list({
            offer_request_id: offerRequest.data.id,
            sort: 'total_amount',
            limit: 20,
        });

        return offers.data.map(mapDuffelOfferToFlight);
    } catch (error) {
        console.error('Error searching flights:', error);
        return [];
    }
};

/**
 * Map Duffel API offer to our Flight type
 */
function mapDuffelOfferToFlight(offer: any): Flight {
    const outboundSlice = offer.slices[0];
    const inboundSlice = offer.slices[1]; // Undefined for one-way

    const originalPrice = parseFloat(offer.total_amount);
    const originalCurrency = offer.total_currency;

    // Convert price to INR using centralized currency conversion
    const finalPrice = convertToINR(originalPrice, originalCurrency);
    const finalCurrency = originalCurrency !== 'INR' ? DEFAULT_CURRENCY : originalCurrency;

    return {
        id: offer.id,
        airline: {
            name: offer.owner.name,
            code: offer.owner.iata_code,
            logo: offer.owner.logo_symbol_url,
        },
        outbound: processSlice(outboundSlice),
        inbound: inboundSlice ? processSlice(inboundSlice) : undefined,
        price: finalPrice,
        currency: finalCurrency,
        emissions: offer.total_emissions_kg ? `${offer.total_emissions_kg}kg CO₂` : undefined,
    };
}

/**
 * Process a flight slice into FlightSegment format
 */
function processSlice(slice: any): FlightSegment {
    const segments = slice.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    const departureTime = new Date(firstSegment.departing_at).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const arrivalTime = new Date(lastSegment.arriving_at).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const duration = formatDuration(slice.duration);

    // Calculate layover duration if there are stops
    let layover: FlightSegment['layover'] = undefined;
    if (segments.length > 1) {
        const connectionTime = calculateConnectionTime(
            segments[0].arriving_at,
            segments[1].departing_at
        );
        layover = {
            airport: segments[0].destination.iata_code,
            duration: connectionTime,
        };
    }

    return {
        departure: {
            time: departureTime,
            airport: firstSegment.origin.iata_code,
            city: firstSegment.origin.city_name || firstSegment.origin.name,
        },
        arrival: {
            time: arrivalTime,
            airport: lastSegment.destination.iata_code,
            city: lastSegment.destination.city_name || lastSegment.destination.name,
        },
        duration: duration,
        stops: segments.length - 1,
        layover,
        segments: segments.map((seg: any) => ({
            departure: {
                time: new Date(seg.departing_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                airport: seg.origin.iata_code,
                city: seg.origin.city_name || seg.origin.name,
            },
            arrival: {
                time: new Date(seg.arriving_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                airport: seg.destination.iata_code,
                city: seg.destination.city_name || seg.destination.name,
            },
            duration: formatDuration(seg.duration),
            mkCarrier: {
                name: seg.marketing_carrier.name,
                code: seg.marketing_carrier.iata_code,
                logo: seg.marketing_carrier.logo_symbol_url,
            },
            opCarrier: seg.operating_carrier ? {
                name: seg.operating_carrier.name,
                code: seg.operating_carrier.iata_code,
            } : undefined,
            flightNumber: seg.marketing_carrier_flight_number,
        })),
    };
}

/**
 * Calculate connection time between two ISO datetime strings
 */
function calculateConnectionTime(arrival: string, departure: string): string {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    const diffMs = departureDate.getTime() - arrivalDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
}

/**
 * Format ISO 8601 duration (e.g., PT2H30M) to human readable format
 */
function formatDuration(isoDuration: string | null): string {
    if (!isoDuration) return "";
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return isoDuration;

    const hours = match[1] ? match[1].replace('H', 'h') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours} ${minutes}`.trim();
}

