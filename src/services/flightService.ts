
import { duffel } from '@/lib/duffel';
import { Flight } from '@/data/mockFlights';

export interface SearchParams {
    from: string; // IATA code
    to: string;   // IATA code
    departDate: string; // YYYY-MM-DD
    returnDate?: string; // YYYY-MM-DD
    adults: number;
    cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

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

function mapDuffelOfferToFlight(offer: any): Flight {
    const outboundSlice = offer.slices[0];
    const inboundSlice = offer.slices[1]; // Undefined for one-way

    // Helper to process segments
    const processSlice = (slice: any) => {
        const segments = slice.segments;
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];

        const departureTime = new Date(firstSegment.departing_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const arrivalTime = new Date(lastSegment.arriving_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // Calculate total duration (simplified for now, ideally sum durations + connections)
        // Duffel provides `duration` on the slice usually?
        // Slice has `duration` string like "PT2H30M"
        const duration = formatDuration(slice.duration);

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
            // Layover logic if stops > 0 (taking the first layover for simplicity if multiple)
            layover: segments.length > 1 ? {
                airport: segments[0].destination.iata_code,
                duration: '1h' // Placeholder, need to calc connection time
            } : undefined
        };
    };

    const originalPrice = parseFloat(offer.total_amount);
    const originalCurrency = offer.total_currency;

    let finalPrice = originalPrice;
    let finalCurrency = originalCurrency;

    // Approximate conversion to INR if needed (since user requested "always INR")
    if (originalCurrency !== 'INR') {
        const rates: Record<string, number> = {
            'GBP': 108,
            'USD': 86,
            'EUR': 92,
            'AED': 23,
        };

        if (rates[originalCurrency]) {
            finalPrice = originalPrice * rates[originalCurrency];
            finalCurrency = 'INR';
        }
    }

    return {
        id: offer.id,
        airline: {
            name: offer.owner.name,
            code: offer.owner.iata_code,
            logo: offer.owner.logo_symbol_url,
        },
        outbound: processSlice(outboundSlice),
        inbound: inboundSlice ? processSlice(inboundSlice) : ({} as any), // Handle one-way UI gracefully later
        price: finalPrice,
        currency: finalCurrency,
        emissions: 'CO2 data' // Placeholder
    };
}

function formatDuration(isoDuration: string | null): string {
    if (!isoDuration) return "";
    // Simple ISO 8601 duration parser (e.g., PT2H30M)
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return isoDuration;

    const hours = match[1] ? match[1].replace('H', 'h') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours} ${minutes}`.trim();
}
