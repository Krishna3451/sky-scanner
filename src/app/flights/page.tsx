'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import DatePriceBar from '@/components/results/DatePriceBar';
import FilterSidebar, { FilterState } from '@/components/results/FilterSidebar';
import FlightCard from '@/components/results/FlightCard';
import HotelDeals from '@/components/results/HotelDeals';
import SearchForm from '@/components/search/SearchForm';
import { FlightPromoBanner, HotelPromoBanner } from '@/components/results/PromoBanner';
import Footer from '@/components/results/Footer';
import { mockFlights, mockHotels, mockDatePrices } from '@/data/mockFlights';
import styles from './flights.module.css';

// ... (Search Bar code) ... without changing it, but since I am doing a partial replace, I need to be careful.

// Helper to parse "2h 15m" to minutes
const parseDuration = (durationStr: string): number => {
  let minutes = 0;
  const parts = durationStr.split(' ');
  for (const part of parts) {
    if (part.includes('h')) minutes += parseInt(part) * 60;
    if (part.includes('min') || part.includes('m')) minutes += parseInt(part);
  }
  return minutes;
};

const generateDatePrices = (baseDateStr: string, basePrice: number, currentRealPrice: number) => {
  const baseDate = new Date(baseDateStr);
  const dates = [];

  // Generate 7 days centered on base date (-3 to +3)
  for (let i = -3; i <= 3; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);

    // Deterministic price based on date string hash, scaled around basePrice
    const dateStr = date.toISOString().split('T')[0];
    const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Variation +/- 20%
    const variance = (hash % 40) - 20; // -20 to +20

    // Use EXACT real price for the selected date (i===0), estimated for others
    const price = i === 0 ? currentRealPrice : Math.round(basePrice * (1 + variance / 100));

    dates.push({
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      dayName: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      price: price,
      fullDate: dateStr,
    });
  }
  return dates;
};

// ... (imports and SearchBar/Props can stay if I use a range that excludes them, but I need to inject the filter state)

function FlightResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || 'DEL';
  const to = searchParams.get('to') || 'AGR';
  const depart = searchParams.get('depart') || '2026-02-15';
  const returnDate = searchParams.get('return') || undefined;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const cabin = (searchParams.get('cabin') || 'economy').toLowerCase() as any;

  const [flights, setFlights] = useState<any[]>([]); // Using any[] for now to match mock structure
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stableBasePrice, setStableBasePrice] = useState<number | null>(null);

  // Update stable price only on initial load or route change (excluding date)
  useEffect(() => {
    if (flights.length > 0) {
      const currentMin = Math.min(...flights.map(f => f.price));
      // Only set if null, preventing updates on date change
      if (stableBasePrice === null) {
        setStableBasePrice(currentMin);
      }
    }
  }, [flights, stableBasePrice]);

  // Cache for storing "real" prices as they are discovered
  const [priceCache, setPriceCache] = useState<Record<string, number>>({});

  // Reset stable price and CACHE when route changes (new origin/dest)
  useEffect(() => {
    setStableBasePrice(null);
    setPriceCache({});
  }, [from, to, cabin, adults]);

  // Update Cache when we have real results for the current date
  useEffect(() => {
    if (flights.length > 0 && !loading) {
      const currentMin = Math.min(...flights.map(f => f.price));
      setPriceCache(prev => ({
        ...prev,
        [depart]: currentMin
      }));
    }
  }, [flights, loading, depart]);

  // Generate date prices using stable reference and CACHE
  const datePrices = useMemo(() => {
    const base = stableBasePrice || 5000;
    const currentRealPrice = flights.length > 0 ? Math.min(...flights.map(f => f.price)) : base;
    return generateDatePrices(depart, base, currentRealPrice, priceCache);
  }, [depart, stableBasePrice, flights, priceCache]);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    stops: [],
    airlines: [],
    departureTime: [0, 24],
    duration: 2000 // Initial high value
  });

  const handleDateSelect = (index: number) => {
    // ... existing logic ...
    const selectedDate = datePrices[index].fullDate;
    const params = new URLSearchParams(searchParams.toString());
    params.set('depart', selectedDate);
    router.push(`/flights?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      setError('');
      try {
        // ... fetching logic ...
        const { searchFlightsAction } = await import('@/actions/flightActions');
        const results = await searchFlightsAction({
          from,
          to,
          departDate: depart,
          returnDate: returnDate,
          adults,
          cabinClass: cabin
        });
        setFlights(results);

        // Set realistic max duration based on results
        const maxDur = Math.max(...results.map((f: any) => parseDuration(f?.outbound?.duration || '0m')));
        setFilters(prev => ({ ...prev, duration: maxDur || 1200 }));

      } catch (err) {
        // ... error handling ...
        console.error(err);
        setError('Failed to fetch flights. Please try again.');
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [from, to, depart, returnDate, adults, cabin]);

  // Derived Filtering Logic
  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      // Stops
      if (filters.stops.length > 0 && !filters.stops.includes(flight.outbound?.stops || 0)) return false;

      // Airlines
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline?.name)) return false;

      // Departure Time
      if (flight.outbound?.departure?.time) {
        const departHour = parseInt(flight.outbound.departure.time.split(':')[0]);
        if (departHour < filters.departureTime[0] || departHour >= filters.departureTime[1]) return false;
      }

      // Duration
      if (flight.outbound?.duration) {
        const dur = parseDuration(flight.outbound.duration);
        if (dur > filters.duration) return false;
      }

      return true;
    });
  }, [flights, filters]);

  const sortedFlights = [...filteredFlights].sort((a, b) => a.price - b.price);
  const cheapestPrice = sortedFlights[0]?.price;
  const destination = to;

  const currentParams = {
    from,
    to,
    depart,
    returnDate: returnDate || '',
    adults: Number(adults) || 1,
    cabin: cabin || 'Economy'
  };

  // Extract available airlines for the sidebar
  const availableAirlines = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.airline?.name).filter(Boolean)));
  }, [flights]);

  // Max duration for slider
  const maxDurationData = useMemo(() => {
    return Math.max(...flights.map(f => parseDuration(f?.outbound?.duration || '0m'))) || 1200;
  }, [flights]);

  // Compute Filter Counts
  const filterCounts = useMemo(() => {
    const counts = { stops: {} as Record<number, number>, airlines: {} as Record<string, number> };
    flights.forEach(f => {
      // Stops
      // We filter based on outbound stops typically
      const s = f.outbound?.stops || 0;
      counts.stops[s] = (counts.stops[s] || 0) + 1;

      // Airlines
      const a = f.airline?.name;
      if (a) counts.airlines[a] = (counts.airlines[a] || 0) + 1;
    });
    return counts;
  }, [flights]);

  return (
    <>
      <Header />
      <Suspense fallback={<div className={styles.searchLoading}>Loading...</div>}>
        <SearchBar currentParams={currentParams} />
      </Suspense>
      <DatePriceBar
        dates={datePrices}
        selectedIndex={3}
        onSelectDate={handleDateSelect}
        loading={loading}
      />

      <div className={styles.resultsContainer}>
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          availableAirlines={availableAirlines}
          maxDuration={maxDurationData}
          counts={filterCounts}
        />

        <main className={styles.resultsMain}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {loading ? 'Searching...' : `${filteredFlights.length} results found`}
            </span>
            <button className={styles.viewAll}>View all results</button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-xl font-semibold text-gray-500">Searching specifically for you...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20 text-red-500">
              {error}
            </div>
          ) : (
            <div className={styles.flightList}>
              {sortedFlights.length > 0 ? (
                sortedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isBestPrice={flight.price === cheapestPrice}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No flights match your filters. <button onClick={() => setFilters({ stops: [], airlines: [], departureTime: [0, 24], duration: 2000 })} className="text-blue-500 underline">Clear filters</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );

}

function Header() {
  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerTopRow}>
          <div className={styles.logo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 910 149"
              className="h-8 w-auto fill-current text-white"
              style={{ height: '32px', width: 'auto', fill: 'currentColor', color: 'white' }}
            >
              <path d="M100.1 127c2.1 0 4.1-.5 6-1.6l21.9-12.6c4.4-2.5 9.5-3.6 14.6-3 26.6 3.1 45.2 8.1 50.7 9.7 1.1.3 2.4-.1 3.1-1 .9-1.1 2-2.9 2.9-5.5.8-2.5.9-4.6.8-6.1-.1-1.2-.9-2.3-2.1-2.6-8.6-2.5-46.7-12.8-97.9-12.8s-89.3 10.3-97.9 12.8c-1.2.3-2 1.4-2.1 2.6-.1 1.4 0 3.5.8 6.1.8 2.6 2 4.4 2.9 5.5.7.9 2 1.3 3.1 1 5.5-1.6 24.2-6.6 50.7-9.7 5.1-.6 10.2.5 14.6 3l21.9 12.6c1.9 1.1 4 1.6 6 1.6zM63.6 56.1c1.2 2.1 3.1 3.5 5.3 4.1 2.2.6 4.5.3 6.6-.9 2.1-1.2 3.5-3.1 4.1-5.3.6-2.2.3-4.5-.9-6.6L59 13.3c-.6-1.1-1.9-1.5-3.1-1.4-1.6.1-3.8.9-6.4 2.4-2.6 1.5-4.4 3-5.3 4.3-.7 1-.9 2.3-.3 3.4l19.7 34.1zm-18 24.4c2.1 1.2 4.5 1.4 6.6.9 2.2-.6 4.1-2 5.3-4.1 1.2-2.1 1.4-4.5.9-6.6-.5-2.1-2-4.1-4.1-5.3L20.2 45.7c-1.1-.6-2.4-.4-3.4.3-1.3.9-2.8 2.7-4.3 5.3-1.5 2.6-2.3 4.8-2.4 6.4-.1 1.3.4 2.5 1.4 3.1l34.1 19.7zM108.8 44c0 2.4-1 4.6-2.5 6.2-1.6 1.6-3.7 2.5-6.2 2.5-2.4 0-4.6-1-6.2-2.5-1.6-1.6-2.5-3.7-2.5-6.2V4.7c0-1.3.8-2.3 2-2.8 1.4-.7 3.7-1.1 6.7-1.1s5.3.4 6.7 1.1c1.1.6 2 1.5 2 2.8V44zm27.8 12.1c-1.2 2.1-3.1 3.5-5.3 4.1-2.2.6-4.5.3-6.6-.9-2.1-1.2-3.5-3.1-4.1-5.3-.6-2.2-.3-4.5.9-6.6l19.7-34.1c.6-1.1 1.9-1.5 3.1-1.4 1.6.1 3.8.9 6.4 2.4 2.6 1.5 4.4 3 5.3 4.3.7 1 .9 2.3.3 3.4l-19.7 34.1zm18 24.4c-2.1 1.2-4.5 1.4-6.6.9-2.2-.6-4.1-2-5.3-4.1-1.2-2.1-1.4-4.5-.9-6.6.6-2.2 2-4.1 4.1-5.3L180 45.7c1.1-.6 2.4-.4 3.4.3 1.3.9 2.8 2.7 4.3 5.3 1.5 2.6 2.3 4.8 2.4 6.4.1 1.3-.4 2.5-1.4 3.1l-34.1 19.7zm217.5-27.1h16.4c.6 0 1.1.4 1.4.9l16.3 41.8L422 54.3c.2-.6.8-.9 1.4-.9h16.1c1.1 0 1.8 1.1 1.3 2l-40 91.8c-.2.5-.8.9-1.3.9h-14.2c-1 0-1.8-1.1-1.3-2l13.7-32.1-26.8-58.6c-.6-.9.1-2 1.2-2zm242.1 9.3v-7.8c0-.8.7-1.5 1.5-1.5h14.5c.8 0 1.5.7 1.5 1.5v62.3c0 .8-.7 1.5-1.5 1.5h-14.5c-.8 0-1.5-.7-1.5-1.5V109c-3.1 4.8-9.9 11.1-21 11.1-21.2 0-32.2-16.2-32.2-34.3 0-23.6 16.4-33.7 31.7-33.7 10.1-.1 17.1 4.7 21.5 10.6zm-35.7 23.2c0 11.2 6.9 19.8 18 19.8s18.2-7.5 18.2-19-6.9-20.3-18.7-20.3c-11.1 0-17.5 8.6-17.5 19.5zm66.3 31.3V54.9c0-.8.7-1.5 1.5-1.5h14.5c.8 0 1.5.7 1.5 1.5v8.5c3.4-5.9 9.8-11.3 20.7-11.3 11.2 0 23.7 5.5 23.7 30.8v34.3c0 .8-.7 1.5-1.5 1.5h-14.5c-.9-.1-1.5-.7-1.5-1.5v-34c0-6.1-1.5-16.6-12.3-16.6s-14.6 9.5-14.6 18.3v32.3c0 .8-.7 1.5-1.5 1.5h-14.5c-.9-.1-1.5-.7-1.5-1.5zm74.3 0V54.9c0-.8.7-1.5 1.5-1.5h14.5c.8 0 1.5.7 1.5 1.5v8.5c3.4-5.9 9.8-11.3 20.7-11.3 11.2 0 23.7 5.5 23.7 30.8v34.3c0 .8-.7 1.5-1.5 1.5H765c-.8 0-1.5-.7-1.5-1.5v-34c0-6.1-1.5-16.6-12.3-16.6s-14.6 9.5-14.6 18.3v32.3c0 .8-.7 1.5-1.5 1.5h-14.5c-.8-.1-1.5-.7-1.5-1.5zm152.3-63.8h14.1c.8 0 1.5.7 1.5 1.5v12.9c2.8-12.8 13.8-17.2 21.8-15.3.7.1 1.1.7 1.1 1.4v14.2c0 .9-.8 1.6-1.8 1.4-14.8-2.9-20.8 5.1-20.8 16.3v31.4c0 .8-.7 1.5-1.5 1.5h-14.5c-.8 0-1.5-.7-1.5-1.5V54.9c.1-.8.8-1.5 1.6-1.5zM276 67.6c-4.5-1.5-6.9-2.4-10.5-3.6-3.7-1.3-10-4.9-10-10.7 0-5.8 4-9.5 12.1-9.5 7.4 0 11.5 3.6 14.2 9.4.4.8 1.3 1.1 2.1.7l11.9-6.9c.6-.4.9-1.2.6-1.9-3.6-7.9-12-17.4-28.6-17.4-18.5 0-30.1 11-30.1 25.5 0 14.4 9.5 21.9 22.4 26.3 4.7 1.6 6.6 2.3 10.6 3.6 7.6 2.6 11.1 6 11.1 10.7 0 4.7-3 10.3-14.8 10.3-10.8 0-14.6-5.7-16.8-11.1-.3-.8-1.3-1.2-2.1-.7l-12.5 7.2c-.6.4-.9 1.1-.6 1.8 4.8 11.8 17.9 18.8 32.6 18.8 17.3 0 31.9-8.8 31.9-26.6s-19-24.4-23.5-25.9zm95.5 34c-.4-.7-1.4-1-2.1-.5-5.6 4.1-12.2 4.2-17.2-3.5-4.2-6.5-9.3-14.5-9.3-14.5l22-27.3c.8-1 .1-2.4-1.1-2.4h-17.2c-.5 0-.9.2-1.2.6l-19 26.1V27.6c0-.8-.7-1.5-1.5-1.5h-14.5c-.8 0-1.5.7-1.5 1.5v89.6c0 .8.7 1.5 1.5 1.5H325c.8 0 1.5-.7 1.5-1.5V88.1s9.7 15.3 13.4 21c5 7.8 12 11 19.6 11 7.2 0 11.8-1.9 17.3-7.3.5-.5.6-1.2.3-1.8l-5.6-9.4zM475.6 81c-4.6-1.7-6.2-2.3-9.7-3.6-3.5-1.3-6.6-3.2-6.6-6s2.6-5.9 7.9-5.9c4.6 0 7.4 1.8 9 5 .4.8 1.3 1 2 .6l10.2-5.9c.7-.4.9-1.3.5-2-2.8-4.9-8.3-11.1-21.6-11.1-16.3 0-24.7 9.4-24.7 19.8s8.5 15.3 16.3 18.4c8.8 3.6 9.4 3.8 10.5 4.2 2.7 1.1 6 2.8 6 5.9 0 3.1-3.6 5.9-9.1 5.9-5.1 0-10.9-2.1-13.3-8-.3-.8-1.3-1.2-2.1-.7l-10.3 5.9c-.6.4-.9 1.1-.6 1.8 3 7.8 11.9 14.7 26.3 14.7 15.6 0 26-8.3 26-20s-8-15.8-16.7-19zm58.6-13.4c6.5 0 11.3 2 15.8 5.2.7.5 1.7.3 2.1-.4l6-10.4c.4-.7.2-1.5-.5-1.9-6.2-4.2-13.9-8.1-24.3-8.1-10.3 0-19.8 2.8-26.6 9.7-6.8 6.8-9.9 14.9-9.9 24.5 0 11.6 4.8 19 10 24.2 5.2 5.2 14.6 9.6 26.6 9.6 10.8 0 18.8-4.5 24.3-8.1.6-.4.8-1.3.4-1.9l-5.9-10.3c-.4-.7-1.4-1-2.1-.5-3.9 2.8-9.5 5.2-15.8 5.2-7.1 0-20-4-20-18.4 0-14.4 12.8-18.4 19.9-18.4zm294.2 38c-5.8 0-11.3-1.4-15.3-4.6-4-3.2-5.9-6.5-5.9-10.4H859c.8 0 1.5-.7 1.5-1.5-.3-15.4-5.3-22.6-10.1-27.5-5-5-13.5-9.6-24.7-9.6s-19.8 4.1-25.7 9.9c-5.8 5.8-10.2 13.2-10.2 24.4s4.5 18.6 10 24.1 14.5 9.6 27.4 9.6c12.2 0 22.5-4.3 29.9-12.8.6-.7.4-1.8-.4-2.2l-10.3-6c-.5-.3-1.2-.3-1.7.2-5.1 4.8-11.6 6.4-16.3 6.4zM825.6 66c8.3 0 15.9 5 17.1 14h-34.9c2.3-9.7 9.5-14 17.8-14z"></path>
            </svg>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.helpBtn}>Help</button>
            <div className={styles.localeSelector}>₹ · EN</div>
            <button className={styles.loginBtn}>Log in</button>
          </div>
        </div>

        <nav className={styles.navTabs}>
          <button className={`${styles.navTab} ${styles.active}`}>
            <span className={styles.tabIcon}>✈️</span>
            Flights
          </button>
          <button className={styles.navTab}>
            <span className={styles.tabIcon}>🏨</span>
            Hotels
          </button>
          <button className={styles.navTab}>
            <span className={styles.tabIcon}>🚗</span>
            Car Hire
          </button>
        </nav>
      </div>
    </header>
  );
}

interface SearchBarProps {
  currentParams: {
    from: string;
    to: string;
    depart: string;
    returnDate: string;
    adults: number;
    cabin: string;
  };
}

function SearchBar({ currentParams }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  if (!currentParams) {
    return null;
  }

  const cityNames: Record<string, string> = {
    'DEL': 'Delhi',
    'AGR': 'Agra',
    'BOM': 'Mumbai',
    'BLR': 'Bangalore',
    'LHR': 'London',
    'DXB': 'Dubai',
    'SIN': 'Singapore',
  };

  const getCityName = (code: string) => cityNames[code] || code;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Handle date arrows in collapsed mode
  const adjustDate = (days: number) => {
    const date = new Date(currentParams.depart);
    date.setDate(date.getDate() + days);
    const newDateStr = date.toISOString().split('T')[0];

    const params = new URLSearchParams(window.location.search);
    params.set('depart', newDateStr);
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <div className="bg-[#05203c] py-4 mb-4 transition-all duration-300 ease-in-out relative z-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        {/* Toggle Bar */}
        <div
          className={`bg-[#1a3b5c] rounded-md flex items-center p-1 cursor-pointer transition-colors border border-transparent 
                ${isExpanded ? 'bg-[#23456b] border-gray-500/50' : 'hover:bg-[#23456b] hover:border-gray-500/30'}`}
        >

          {/* Search Icon / Toggle Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#0770e3] hover:bg-[#0661c5] text-white p-2.5 rounded-md flex-shrink-0 transition-colors"
            aria-label="Toggle search form"
          >
            {isExpanded ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            )}
          </button>

          {/* Middle Section: Route & Details - Click to expand */}
          <div
            className="flex-1 flex flex-col md:flex-row md:items-center px-4 gap-1 md:gap-4 overflow-hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="text-white font-semibold truncate flex items-center gap-2">
              <span>{getCityName(currentParams.from)} ({currentParams.from})</span>
              <span className="text-gray-400">→</span>
              <span>{getCityName(currentParams.to)} ({currentParams.to})</span>
            </div>
            <div className="text-gray-300 text-sm truncate border-l border-gray-600 pl-4 hidden md:block">
              {currentParams.adults} Adult, {currentParams.cabin}
            </div>
          </div>

          {/* Right Section: Date Navigation */}
          <div className="flex items-center gap-1 bg-[#05203c] rounded p-1 ml-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => adjustDate(-1)} className="p-1.5 text-white hover:bg-white/10 rounded">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-white font-medium text-sm whitespace-nowrap px-2">
              {formatDateFull(currentParams.depart)}
            </span>
            <button onClick={() => adjustDate(1)} className="p-1.5 text-white hover:bg-white/10 rounded">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Expanded Form Area */}
        {isExpanded && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <SearchForm
              initialFrom={{ code: currentParams.from, city: getCityName(currentParams.from), name: '', country: '' }}
              initialTo={{ code: currentParams.to, city: getCityName(currentParams.to), name: '', country: '' }}
              initialDepart={new Date(currentParams.depart)}
              initialReturn={currentParams.returnDate ? new Date(currentParams.returnDate) : null}
              initialAdults={currentParams.adults}
              initialCabin={currentParams.cabin}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-sm" // Add some styling to the form container
            />
          </div>
        )}
      </div>
    </div>
  );
}



export default function FlightsPage() {
  return (
    <div className={styles.flightsPage}>
      <Suspense fallback={<div>Loading...</div>}>
        <FlightResultsContent />
      </Suspense>
    </div>
  );
}
