"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Flight, FilterState, SearchParams, DatePrice } from "@/types/flight";

interface UseFlightSearchResult {
    flights: Flight[];
    filteredFlights: Flight[];
    sortedFlights: Flight[];
    loading: boolean;
    error: string;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    resetFilters: () => void;
    datePrices: DatePrice[];
    availableAirlines: string[];
    maxDuration: number;
    filterCounts: {
        stops: Record<number, number>;
        airlines: Record<string, number>;
    };
    cheapestPrice: number | undefined;
}

const DEFAULT_FILTERS: FilterState = {
    stops: [],
    airlines: [],
    departureTime: [0, 24],
    duration: 2000,
};

/**
 * Parse duration string like "2h 15m" to minutes
 */
const parseDuration = (durationStr: string): number => {
    let minutes = 0;
    const parts = durationStr.split(" ");
    for (const part of parts) {
        if (part.includes("h")) minutes += parseInt(part) * 60;
        if (part.includes("min") || part.includes("m")) minutes += parseInt(part);
    }
    return minutes;
};

/**
 * Generate date prices for the date strip
 */
const generateDatePrices = (
    baseDateStr: string,
    basePrice: number,
    currentRealPrice: number,
    priceCache: Record<string, number>
): DatePrice[] => {
    const baseDate = new Date(baseDateStr);
    const dates: DatePrice[] = [];

    for (let i = -3; i <= 3; i++) {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);

        const dateStr = date.toISOString().split("T")[0];
        const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const variance = (hash % 40) - 20;

        const price =
            i === 0
                ? currentRealPrice
                : priceCache[dateStr] || Math.round(basePrice * (1 + variance / 100));

        dates.push({
            date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
            dayName: date.toLocaleDateString("en-GB", { weekday: "short" }),
            price: price,
            fullDate: dateStr,
        });
    }

    return dates;
};

/**
 * Custom hook for flight search, filtering, and price calculations
 */
export function useFlightSearch(params: SearchParams): UseFlightSearchResult {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [stableBasePrice, setStableBasePrice] = useState<number | null>(null);
    const [priceCache, setPriceCache] = useState<Record<string, number>>({});

    const { from, to, departDate, returnDate, adults, cabinClass } = params;

    // Reset stable price and cache when route changes
    useEffect(() => {
        setStableBasePrice(null);
        setPriceCache({});
    }, [from, to, cabinClass, adults]);

    // Fetch flights
    useEffect(() => {
        async function fetchFlights() {
            setLoading(true);
            setError("");
            try {
                const { searchFlightsAction } = await import("@/actions/flightActions");
                const results = await searchFlightsAction({
                    from,
                    to,
                    departDate,
                    returnDate,
                    adults,
                    cabinClass,
                });
                setFlights(results);

                // Set max duration based on results
                const maxDur = Math.max(
                    ...results.map((f: Flight) => parseDuration(f?.outbound?.duration || "0m"))
                );
                setFilters((prev) => ({ ...prev, duration: maxDur || 1200 }));
            } catch (err) {
                console.error(err);
                setError("Failed to fetch flights. Please try again.");
                setFlights([]);
            } finally {
                setLoading(false);
            }
        }
        fetchFlights();
    }, [from, to, departDate, returnDate, adults, cabinClass]);

    // Update stable base price
    useEffect(() => {
        if (flights.length > 0 && stableBasePrice === null) {
            const currentMin = Math.min(...flights.map((f) => f.price));
            setStableBasePrice(currentMin);
        }
    }, [flights, stableBasePrice]);

    // Update price cache when we have real results
    useEffect(() => {
        if (flights.length > 0 && !loading) {
            const currentMin = Math.min(...flights.map((f) => f.price));
            setPriceCache((prev) => ({
                ...prev,
                [departDate]: currentMin,
            }));
        }
    }, [flights, loading, departDate]);

    // Generate date prices
    const datePrices = useMemo(() => {
        const base = stableBasePrice || 5000;
        const currentRealPrice =
            flights.length > 0 ? Math.min(...flights.map((f) => f.price)) : base;
        return generateDatePrices(departDate, base, currentRealPrice, priceCache);
    }, [departDate, stableBasePrice, flights, priceCache]);

    // Filtered flights
    const filteredFlights = useMemo(() => {
        return flights.filter((flight) => {
            // Stops filter
            if (
                filters.stops.length > 0 &&
                !filters.stops.includes(flight.outbound?.stops || 0)
            ) {
                return false;
            }

            // Airlines filter
            if (
                filters.airlines.length > 0 &&
                !filters.airlines.includes(flight.airline?.name)
            ) {
                return false;
            }

            // Departure time filter
            if (flight.outbound?.departure?.time) {
                const departHour = parseInt(flight.outbound.departure.time.split(":")[0]);
                if (
                    departHour < filters.departureTime[0] ||
                    departHour >= filters.departureTime[1]
                ) {
                    return false;
                }
            }

            // Duration filter
            if (flight.outbound?.duration) {
                const dur = parseDuration(flight.outbound.duration);
                if (dur > filters.duration) {
                    return false;
                }
            }

            return true;
        });
    }, [flights, filters]);

    // Sorted flights
    const sortedFlights = useMemo(() => {
        return [...filteredFlights].sort((a, b) => a.price - b.price);
    }, [filteredFlights]);

    // Available airlines
    const availableAirlines = useMemo(() => {
        return Array.from(new Set(flights.map((f) => f.airline?.name).filter(Boolean)));
    }, [flights]);

    // Max duration
    const maxDuration = useMemo(() => {
        return (
            Math.max(...flights.map((f) => parseDuration(f?.outbound?.duration || "0m"))) ||
            1200
        );
    }, [flights]);

    // Filter counts
    const filterCounts = useMemo(() => {
        const counts = {
            stops: {} as Record<number, number>,
            airlines: {} as Record<string, number>,
        };
        flights.forEach((f) => {
            const s = f.outbound?.stops || 0;
            counts.stops[s] = (counts.stops[s] || 0) + 1;

            const a = f.airline?.name;
            if (a) counts.airlines[a] = (counts.airlines[a] || 0) + 1;
        });
        return counts;
    }, [flights]);

    const cheapestPrice = sortedFlights[0]?.price;

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return {
        flights,
        filteredFlights,
        sortedFlights,
        loading,
        error,
        filters,
        setFilters,
        resetFilters,
        datePrices,
        availableAirlines,
        maxDuration,
        filterCounts,
        cheapestPrice,
    };
}
