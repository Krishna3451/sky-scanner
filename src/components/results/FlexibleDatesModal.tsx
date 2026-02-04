'use client';

import { useState } from 'react';
import styles from './FlexibleDatesModal.module.css';

interface FlexibleDatesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FlexibleDatesModal({ isOpen, onClose }: FlexibleDatesModalProps) {
    if (!isOpen) return null;

    const departureDates = [
        { day: 'Mon', date: '23 Feb' },
        { day: 'Tue', date: '24 Feb' },
        { day: 'Wed', date: '25 Feb' },
        { day: 'Thu', date: '26 Feb', selected: true },
        { day: 'Fri', date: '27 Feb' },
        { day: 'Sat', date: '28 Feb' },
        { day: 'Sun', date: '1 Mar' },
    ];

    const returnDates = [
        { day: 'Sat', date: '28 Feb' },
        { day: 'Sun', date: '1 Mar' },
        { day: 'Mon', date: '2 Mar' },
        { day: 'Tue', date: '3 Mar', selected: true },
        { day: 'Wed', date: '4 Mar' },
        { day: 'Thu', date: '5 Mar' },
        { day: 'Fri', date: '6 Mar' },
    ];

    // Mock price grid data (7x7)
    const prices = [
        ['14.4K', '14.3K', '15.3K', '14.8K', '16.3K', '16.5K', '-'],
        ['14.4K', '14K', '14.4K', '14.7K', '15.9K', '16.9K', '19.8K'],
        ['14.4K', '14.3K', '15.3K', '15.3K', '16.3K', '16.9K', '15.8K'],
        ['14.4K', '14K', '15.3K', '14.9K', '15.8K', '16.9K', '15.8K'],
        ['13.8K', '14.3K', '15.3K', '15.3K', '15.3K', '16.9K', '15.8K'],
        ['14.4K', '14.3K', '15.3K', '14.9K', '16.3K', '16.7K', '15K'],
        ['14.4K', '14.3K', '15.3K', '15.3K', '16.3K', '16.2K', '14.9K'],
    ];

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Flexible dates</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.controls}>
                    <label className={styles.toggle}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                        <span className={styles.toggleLabel}>Direct flights</span>
                    </label>
                </div>

                <div className={styles.gridContainer}>
                    <div className={styles.cornerLabel}>Departure</div>

                    {/* Column Headers (Departure Dates) */}
                    <div className={styles.colHeaders}>
                        <button className={styles.navBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6" /></svg>
                        </button>
                        {departureDates.map((d, i) => (
                            <div key={i} className={`${styles.colHeader} ${d.selected ? styles.headerSelected : ''}`}>
                                <div className={styles.day}>{d.day}</div>
                                <div className={styles.date}>{d.date}</div>
                            </div>
                        ))}
                        <button className={styles.navBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,6 15,12 9,18" /></svg>
                        </button>
                    </div>

                    <div className={styles.gridBody}>
                        {/* Row Headers (Return Dates) - Absolute positioned or flex side panel? 
                 Let's use a flex row structure for the body */}
                        <div className={styles.rowHeaders}>
                            <div className={styles.returnLabel}>Return</div>
                            <button className={styles.navBtnV}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18,15 12,9 6,15" /></svg>
                            </button>
                            {returnDates.map((d, i) => (
                                <div key={i} className={`${styles.rowHeader} ${d.selected ? styles.headerSelected : ''}`}>
                                    <div className={styles.day}>{d.day}</div>
                                    <div className={styles.date}>{d.date}</div>
                                </div>
                            ))}
                            <button className={styles.navBtnV}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
                            </button>
                        </div>

                        <div className={styles.grid}>
                            {prices.map((row, rIdx) => (
                                <div key={rIdx} className={styles.gridRow}>
                                    {row.map((price, cIdx) => {
                                        const isSelected = returnDates[rIdx].selected && departureDates[cIdx].selected;
                                        const isCheapest = price === '13.8K';
                                        return (
                                            <div key={cIdx} className={`${styles.cell} ${isSelected ? styles.cellSelected : ''} ${isCheapest ? styles.cellCheapest : ''}`}>
                                                {price !== '-' ? `₹${price}` : '-'}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <span className={styles.cheapestIcon}>★</span> Cheapest date
                        </div>
                        <div className={styles.legendItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Search to see prices
                        </div>
                        <div className={styles.disclaimer}>Estimated lowest prices only. Found in the last 4 days.</div>
                    </div>
                    <button className={styles.findBtn}>Find flights</button>
                </div>
            </div>
        </div>
    );
}
