'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DatePriceBar from '@/components/results/DatePriceBar';
import FilterSidebar from '@/components/results/FilterSidebar';
import FlightCard from '@/components/results/FlightCard';
import { HotelPromoBanner } from '@/components/results/PromoBanner';
import Footer from '@/components/layout/Footer';
import ResultsHeader from '@/components/layout/ResultsHeader';
import CollapsibleSearchBar from '@/components/search/CollapsibleSearchBar';
import { useFlightSearch } from '@/hooks/useFlightSearch';

import styles from './flights.module.css';

function FlightResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || 'DEL';
  const to = searchParams.get('to') || 'AGR';
  const depart = searchParams.get('depart') || '2026-02-15';
  const returnDate = searchParams.get('return') || undefined;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const cabinClass = (searchParams.get('cabin') || 'economy').toLowerCase() as any;

  // Use the custom hook for all search logic
  const {
    filteredFlights,
    sortedFlights,
    loading,
    error,
    filters,
    setFilters,
    datePrices,
    availableAirlines,
    maxDuration,
    filterCounts,
    cheapestPrice
  } = useFlightSearch({
    from,
    to,
    departDate: depart,
    returnDate,
    adults,
    cabinClass
  });

  const handleDateSelect = (index: number) => {
    const selectedDate = datePrices[index].fullDate;
    if (selectedDate) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('depart', selectedDate);
      router.push(`/flights?${params.toString()}`);
    }
  };

  return (
    <>
      <ResultsHeader />
      <Suspense fallback={<div className={styles.searchLoading}>Loading...</div>}>
        <CollapsibleSearchBar
          from={from}
          to={to}
          depart={depart}
          returnDate={returnDate}
          adults={adults}
          cabin={cabinClass}
        />
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
          maxDuration={maxDuration}
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
                  No flights match your filters.
                  <button
                    onClick={() => setFilters({ stops: [], airlines: [], departureTime: [0, 24], duration: 2000 })}
                    className="text-blue-500 underline ml-2"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          <HotelPromoBanner />

        </main>
      </div>

      <Footer />
    </>
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
