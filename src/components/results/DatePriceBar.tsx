'use client';

import { useState, useEffect } from 'react';
import { DatePrice, formatPrice } from '@/data/mockFlights';
import styles from './DatePriceBar.module.css';

interface DatePriceBarProps {
  dates: DatePrice[];
  selectedIndex?: number;
  onSelectDate?: (index: number) => void;
  loading?: boolean;
}

export default function DatePriceBar({
  dates,
  selectedIndex = 2,
  onSelectDate,
  loading = false
}: DatePriceBarProps) {
  const [selected, setSelected] = useState(selectedIndex);

  // Sync selected state when dates/props change (e.g. after navigation)
  useEffect(() => {
    setSelected(selectedIndex);
  }, [dates, selectedIndex]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelectDate?.(index);
  };

  // Find cheapest price
  const cheapestPrice = Math.min(...dates.map(d => d.price));

  return (
    <div className={styles.datePriceBar}>


      <div className={styles.datesContainer}>
        {dates.map((date, idx) => {
          const isSelected = idx === selected;
          const isCheapest = date.price === cheapestPrice;

          return (
            <button
              key={date.date}
              className={`${styles.dateItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleSelect(idx)}
            >
              <span className={styles.dateLabel}>{date.dayName} {date.date}</span>
              <span className={`${styles.price} ${isCheapest && !isSelected ? styles.cheapest : ''}`}>
                {loading ? (
                  <span className="block w-12 h-3.5 bg-gray-200/50 animate-pulse rounded mx-auto mt-1" />
                ) : (
                  <>
                    {(date as any).isEstimated && <span style={{ fontSize: '0.85em', opacity: 0.7, marginRight: '2px' }}>~</span>}
                    {formatPrice(date.price)}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>




    </div>
  );
}
