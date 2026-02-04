'use client';

import styles from './PromoBanner.module.css';

export function FlightPromoBanner() {
  return (
    <div className={styles.likeBanner}>
      <div className={styles.likeContent}>
        <div className={styles.iconWrapper}>
          <span className={styles.likeIcon}>✨</span>
        </div>
        <div>
          <h3 className={styles.bannerTitle}>Like these flights?</h3>
          <p className={styles.bannerDesc}>We'll let you know when prices go up or down</p>
        </div>
      </div>
      <button className={styles.trackBtn}>Track prices</button>
    </div>
  );
}

export function HotelPromoBanner() {
  return (
    <div className={styles.hotelPromo}>
      <div className={styles.promoContent}>
        <div className={styles.skyLogo}>
          <span className={styles.skyIcon}>☁️</span>
          <span className={styles.skyText}>Skyscanner</span>
        </div>
        <h3 className={styles.promoTitle}>Our hottest hotel deals</h3>
        <p className={styles.promoDesc}>Save up to 35% on stays with these top offers</p>
        <button className={styles.promoBtn}>Discover a deal</button>
      </div>
      <div className={styles.promoImage}>

        <div className={styles.imageOverlay}></div>
        {/* Using a colored div as placeholder for image to match reference style */}
        <div className={styles.imagePlaceholder}></div>
      </div>
    </div>
  );
}
