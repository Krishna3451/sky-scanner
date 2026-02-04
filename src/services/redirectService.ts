
/**
 * Service to handle redirecting users to airline websites
 */

const AIRLINE_URLS: Record<string, string> = {
    'BA': 'https://www.britishairways.com',
    'EK': 'https://www.emirates.com',
    'VS': 'https://www.virginatlantic.com',
    'LH': 'https://www.lufthansa.com',
    'AF': 'https://www.airfrance.com',
    'KL': 'https://www.klm.com',
    'DL': 'https://www.delta.com',
    'AA': 'https://www.aa.com',
    'UA': 'https://www.united.com',
    'QR': 'https://www.qatarairways.com',
    'EY': 'https://www.etihad.com',
    'SQ': 'https://www.singaporeair.com',
    'AI': 'https://www.airindia.com',
    '6E': 'https://www.goindigo.in',
    'UK': 'https://www.airvistara.com',
    'SG': 'https://www.spicejet.com',
    'G8': 'https://www.flygofirst.com',
    'IX': 'https://www.airindiaexpress.com',
    // Add more airlines as needed
};

/**
 * Get the direct booking URL for an airline
 * Fallback to a general search if airline not known
 */
export const getRedirectUrl = (airlineCode: string, airlineName: string): string => {
    const directUrl = AIRLINE_URLS[airlineCode];
    if (directUrl) {
        return directUrl;
    }

    // Fallback: Google Search
    const query = encodeURIComponent(`${airlineName} airlines flight booking`);
    return `https://www.google.com/search?q=${query}`;
};
