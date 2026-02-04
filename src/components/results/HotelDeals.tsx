'use client';

import { Hotel, formatPrice } from '@/data/mockFlights';
import styles from './HotelDeals.module.css';

interface HotelDealsProps {
  destination: string;
  hotels: Hotel[];
}

export default function HotelDeals({ destination, hotels }: HotelDealsProps) {
  return (
    <section className={styles.hotelDeals}>
      <h2 className={styles.dealsTitle}>{destination} hotel deals</h2>

      <div className={styles.filterTabs}>
        <button className={`${styles.filterTab} ${styles.active}`}>Best</button>
        <button className={styles.filterTab}>4 stars</button>
        <button className={styles.filterTab}>3 stars</button>
        <button className={styles.filterTab}>Best reviews</button>
        <button className={styles.filterTab}>Breakfast included</button>
        <button className={styles.filterTab}>Price per nice</button>
      </div>

      <div className={styles.hotelGrid}>
        {hotels.slice(0, 3).map((hotel) => (
          <div key={hotel.id} className={styles.hotelCard}>
            <div className={styles.imageContainer}>
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.name} className={styles.hotelImage} />
              ) : (
                <div className={styles.placeholderImage}></div>
              )}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.hotelInfo}>
                <h3 className={styles.hotelName}>{hotel.name}</h3>
                <div className={styles.stars}>
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <span key={i} className={styles.star}>★</span>
                  ))}
                </div>

                <div className={styles.ratingInfo}>
                  <span className={styles.ratingScore}>{hotel.rating}</span>
                  <span className={styles.ratingText}>
                    {hotel.rating >= 9 ? 'Excellent' :
                      hotel.rating >= 8 ? 'Very good' :
                        hotel.rating >= 7 ? 'Good' : 'Review score'}
                  </span>
                  <span className={styles.reviewCount}>({Math.floor(Math.random() * 500) + 50} reviews)</span>
                </div>
              </div>

              <div className={styles.priceInfo}>
                <div>
                  <span className={styles.price}>{formatPrice(hotel.price)}</span>
                  <span className={styles.perNight}>per night</span>
                </div>
                <button className={styles.viewBtn}>View details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.exploreBtn}>Explore hotels</button>
    </section>
  );
}
