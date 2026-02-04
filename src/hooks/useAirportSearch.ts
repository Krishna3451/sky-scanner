"use client";

import { useState, useEffect, useCallback } from "react";
import { Airport, AIRPORTS } from "@/constants/airports";

interface UseAirportSearchResult {
    query: string;
    setQuery: (query: string) => void;
    selectedAirport: Airport | null;
    setSelectedAirport: (airport: Airport | null) => void;
    suggestions: Airport[];
    isSearching: boolean;
}

/**
 * Custom hook for airport search with debouncing
 */
export function useAirportSearch(
    initialQuery: string = "",
    initialAirport: Airport | null = null
): UseAirportSearchResult {
    const [query, setQuery] = useState(initialQuery);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(initialAirport);
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search effect
    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const { searchAirportsAction } = await import("@/actions/flightActions");
                const results = await searchAirportsAction(query);

                const mappedResults: Airport[] = results.map((place: any) => ({
                    code: place.iata_code,
                    city: place.city_name || place.name,
                    name: place.name,
                    country: place.country_name || place.country?.name || "",
                    distance: null,
                }));

                setSuggestions(mappedResults);
            } catch (error) {
                console.error("Airport search error:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return {
        query,
        setQuery,
        selectedAirport,
        setSelectedAirport,
        suggestions,
        isSearching,
    };
}

/**
 * Format airport for display
 */
export function formatAirport(airport: Airport | null): string {
    if (!airport) return "";
    return `${airport.city} (${airport.code})`;
}
