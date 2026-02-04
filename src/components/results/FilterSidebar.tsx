'use client';

import { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onClear?: () => void;
}

function FilterSection({ title, children, defaultOpen = true, onClear }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.filterHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.filterTitle}>{title}</span>
        <div className={styles.headerActions}>
          {onClear && (
            <span className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); onClear(); }}>
              Clear
            </span>
          )}
          <svg
            className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </button>
      {isOpen && <div className={styles.filterContent}>{children}</div>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  price?: number;
}

function Checkbox({ label, count, checked = false, onChange, price }: CheckboxProps) {
  return (
    <label className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className={styles.checkboxInput}
      />
      <span className={`${styles.checkboxCustom} ${checked ? styles.checked : ''}`}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={styles.checkboxLabel}>{label}</span>
      <div className="flex flex-col items-end ml-auto">
        {price && <span className="text-xs text-gray-400">from ₹{price.toLocaleString()}</span>}
        {count !== undefined && <span className={styles.checkboxCount}>{count}</span>}
      </div>
    </label>
  );
}

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (val: number) => string;
}

function RangeSlider({ label, min, max, value, onChange, formatLabel }: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.min(Number(e.target.value), value[1] - 1);
    onChange([newVal, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], newVal]);
  };

  return (
    <div className={styles.rangeSlider}>
      {label && <span className={styles.rangeLabel}>{label}</span>}
      <div className={styles.sliderTrack}>
        <div
          className={styles.sliderFill}
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`
          }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className={`${styles.sliderInput} z-10`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className={`${styles.sliderInput} z-20`}
        />
      </div>
      <div className={styles.rangeValues}>
        <span>{formatLabel ? formatLabel(value[0]) : value[0]}</span>
        <span>{formatLabel ? formatLabel(value[1]) : value[1]}</span>
      </div>
    </div>
  );
}

export interface FilterState {
  stops: number[];
  airlines: string[];
  departureTime: [number, number]; // Hours 0-24
  duration: number; // minutes
}

export interface FilterCounts {
  stops: Record<number, number>;
  airlines: Record<string, number>;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableAirlines: string[];
  maxDuration: number;
  counts: FilterCounts;
}

export default function FilterSidebar({ filters, onFilterChange, availableAirlines, maxDuration, counts }: FilterSidebarProps) {

  const handleStopChange = (stopCount: number, checked: boolean) => {
    const newStops = checked
      ? [...filters.stops, stopCount]
      : filters.stops.filter(s => s !== stopCount);
    onFilterChange({ ...filters, stops: newStops });
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const newAirlines = checked
      ? [...filters.airlines, airline]
      : filters.airlines.filter(a => a !== airline);
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const formatTime = (val: number) => `${String(val).padStart(2, '0')}:00`;

  return (
    <aside className={styles.filterSidebar}>
      <div className={styles.priceAlerts}>
        <label className={styles.toggleWrapper}>
          <input type="checkbox" className={styles.toggleInput} />
          <span className={styles.toggleSwitch}></span>
          <span className={styles.toggleLabel}>Get Price Alerts</span>
        </label>
      </div>

      <FilterSection title="Stops">
        <Checkbox
          label="Direct"
          checked={filters.stops.includes(0)}
          onChange={(checked) => handleStopChange(0, checked)}
          count={counts.stops[0] || 0}
        />
        <Checkbox
          label="1 stop"
          checked={filters.stops.includes(1)}
          onChange={(checked) => handleStopChange(1, checked)}
          count={counts.stops[1] || 0}
        />
        <Checkbox
          label="2+ stops"
          checked={filters.stops.includes(2)}
          onChange={(checked) => handleStopChange(2, checked)}
          count={counts.stops[2] || 0}
        />
      </FilterSection>

      <FilterSection title="Departure times">
        <RangeSlider
          label="Outbound"
          min={0}
          max={24}
          value={filters.departureTime}
          onChange={(val) => onFilterChange({ ...filters, departureTime: val })}
          formatLabel={formatTime}
        />
      </FilterSection>

      <FilterSection title="Journey duration">
        <div className={styles.durationInfo}>
          <span>Up to {Math.floor(filters.duration / 60)}h {filters.duration % 60}m</span>
        </div>
        <div className={styles.durationSliderContainer}>
          <input
            type="range"
            className={styles.durationSlider}
            min="60"
            max={maxDuration}
            value={filters.duration}
            onChange={(e) => onFilterChange({ ...filters, duration: Number(e.target.value) })}
          />
        </div>
      </FilterSection>

      <FilterSection title="Airlines" onClear={() => onFilterChange({ ...filters, airlines: [] })}>
        {availableAirlines.map(airline => (
          <Checkbox
            key={airline}
            label={airline}
            checked={filters.airlines.includes(airline)}
            onChange={(checked) => handleAirlineChange(airline, checked)}
            count={counts.airlines[airline] || 0}
          />
        ))}
      </FilterSection>
    </aside>
  );
}
