'use client';

import { Flight, FlightSegment, formatPrice } from '@/data/mockFlights';
import styles from './FlightCard.module.css';

interface FlightCardProps {
  flight: Flight;
  isBestPrice?: boolean;
}

function AirlineLogo({ name, code, logo }: { name: string; code: string; logo?: string }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={styles.airlineLogoImg}
        title={name}
      />
    );
  }

  const colors: Record<string, { bg: string; text: string }> = {
    '6E': { bg: '#3d3386', text: '#fff' },
    'AI': { bg: '#ed1d24', text: '#fff' },
    'UK': { bg: '#5e2169', text: '#fff' },
    'SG': { bg: '#ffd500', text: '#000' },
  };

  const { bg, text } = colors[code] || { bg: '#666', text: '#fff' };

  return (
    <div
      className={styles.airlineLogo}
      title={name}
      style={{ background: bg, color: text }}
    >
      {code}
    </div>
  );
}

interface FlightRowProps {
  segment: FlightSegment;
  airline: Flight['airline'];
  label: string;
}

function formatIsoDuration(duration: string) {
  if (!duration) return "";
  // Check if typical "2h 30m" format first (already formatted)
  if (!duration.startsWith('P')) return duration;

  let days = 0, hours = 0, minutes = 0;

  // Parse Days
  const daysMatch = duration.match(/(\d+)D/);
  if (daysMatch) days = parseInt(daysMatch[1]);

  // Parse Hours (after T)
  const timePart = duration.split('T')[1] || '';
  const hoursMatch = timePart.match(/(\d+)H/);
  if (hoursMatch) hours = parseInt(hoursMatch[1]);

  // Parse Minutes
  const minutesMatch = timePart.match(/(\d+)M/);
  if (minutesMatch) minutes = parseInt(minutesMatch[1]);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

function FlightRow({ segment, airline, label }: FlightRowProps) {
  if (!segment || !segment.departure || !segment.arrival) {
    return null;
  }
  const stopsLabel = segment.stops === 0 ? 'Direct' : `${segment.stops} stop`;
  const formattedDuration = formatIsoDuration(segment.duration);

  return (
    <div className={styles.flightRow}>
      <div className={styles.rowLabel}>{label}</div>

      <AirlineLogo name={airline?.name || ''} code={airline?.code || ''} logo={airline?.logo} />

      <div className={styles.timeBlock}>
        <span className={styles.time}>{segment.departure.time}</span>
        <span className={styles.airport}>{segment.departure.airport}</span>
      </div>

      <div className={styles.pathBlock}>
        <span className={styles.duration}>{formattedDuration}</span>
        <div className={styles.pathLine}>
          <div className={styles.lineContainer}>
            <div className={styles.dot}></div>
            <div className={styles.line}></div>
            {segment.stops > 0 && (
              <div className={styles.stopDots}>
                {Array.from({ length: segment.stops }).map((_, i) => (
                  <span key={i} className={styles.stopDot}></span>
                ))}
              </div>
            )}
            <div className={styles.dot}></div>
          </div>
        </div>
        <span className={`${styles.stops} ${segment.stops === 0 ? styles.direct : ''}`}>
          {stopsLabel}
          {segment.layover && <span className={styles.layoverInfo}> via {segment.layover.airport}</span>}
        </span>
      </div>

      <div className={styles.timeBlock}>
        <span className={styles.time}>{segment.arrival.time}</span>
        <span className={styles.airport}>{segment.arrival.airport}</span>
      </div>
    </div>
  );
}

import { useRouter } from 'next/navigation';

export default function FlightCard({ flight, isBestPrice = false }: FlightCardProps) {
  const router = useRouter();

  const handleSelect = () => {
    router.push(`/flights/${flight.id}`);
  };

  return (
    <div className={`${styles.flightCard} ${isBestPrice ? styles.bestPrice : ''}`}>
      {isBestPrice && (
        <div className={styles.bestBadge}>Best</div>
      )}

      <div className={styles.cardContent}>
        <div className={styles.cardLeft}>
          <FlightRow segment={flight.outbound} airline={flight.airline} label="Outbound" />
          {flight.inbound && (
            <FlightRow segment={flight.inbound} airline={flight.airline} label="Return" />
          )}
        </div>

        <div className={styles.cardRight}>
          <div className={styles.priceSection}>
            <span className={`${styles.price} ${isBestPrice ? styles.best : ''}`}>
              {formatPrice(flight.price, flight.currency)}
            </span>
            <span className={styles.perPerson}>per person</span>
          </div>

          <button className={styles.selectBtn} onClick={handleSelect}>
            Select
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {flight.emissions && (
            <div className={styles.ecoBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              </svg>
              {flight.emissions}
            </div>
          )}
        </div>

        <button className={styles.heartBtn} aria-label="Save flight">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
