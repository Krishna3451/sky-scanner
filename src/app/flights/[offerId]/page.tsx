'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getOfferByIdAction } from '@/actions/flightActions';
import { getRedirectUrl } from '@/services/redirectService';
import { Flight } from '@/types/flight';
import { formatPrice } from '@/constants/currencies';
import styles from './flightsDetail.module.css';
import { ArrowLeft, Heart, Clock, Wifi, Utensils, ChevronDown, ChevronUp, Info, Star, Check, Gift, Briefcase, Luggage } from 'lucide-react';

interface Params {
    params: Promise<{
        offerId: string;
    }>
}

interface BookingPartner {
    name: string;
    rating: number;
    reviews: number;
    features: string[];
    price: number;
    isAirline: boolean;
    discount?: string;
}

export default function FlightDetailsPage({ params }: Params) {
    const { offerId } = use(params);
    const [offer, setOffer] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFlightDetailsExpanded, setIsFlightDetailsExpanded] = useState(true);
    const [isReadBeforeBookingOpen, setIsReadBeforeBookingOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchOffer = async () => {
            if (offerId) {
                try {
                    const data = await getOfferByIdAction(offerId);
                    setOffer(data);
                } catch (error) {
                    console.error("Failed to fetch offer:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOffer();
    }, [offerId]);

    if (loading) return <div className={styles.loadingState}>Loading flight details...</div>;
    if (!offer) return <div className={styles.loadingState}>Flight not found.</div>;

    // Generate mock booking partners based on the actual flight data
    const bookingPartners: BookingPartner[] = [
        {
            name: "MakeMyTrip",
            rating: 4.6,
            reviews: 28017,
            features: ["24/7 customer support", "Additional discounts of up to 20% may be available using Skyscanner Exclusive code MMTSKYSUPER (for international flights only)*"],
            price: offer.price,
            isAirline: false,
            discount: "MMTSKYSUPER"
        },
        {
            name: "Goibibo",
            rating: 4.6,
            reviews: 52594,
            features: ["24/7 customer support", "Additional discounts of flat 10% off for domestic flights and up to 20% off for international flights using Skyscanner exclusive code GISKYSUPER*"],
            price: offer.price,
            isAirline: false,
            discount: "GISKYSUPER"
        },
        {
            name: offer.airline.name,
            rating: 4.9,
            reviews: 908,
            features: [],
            price: Math.round(offer.price * 1.01),
            isAirline: true
        },
        {
            name: "Trip.com",
            rating: 4.9,
            reviews: 3898,
            features: ["24/7 live chat and telephone support"],
            price: Math.round(offer.price * 1.08),
            isAirline: false
        }
    ];

    const handleSelect = (partnerName: string) => {
        const url = getRedirectUrl(offer.airline.code, partnerName);
        window.open(url, '_blank');
    };

    const formatDate = () => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return today.toLocaleDateString('en-GB', options);
    };

    const getStopsLabel = () => {
        const stops = offer.outbound.stops;
        if (stops === 0) return 'Direct';
        return `${stops} stop${stops > 1 ? 's' : ''}`;
    };

    const getStopAirports = () => {
        if (!offer.outbound.segments || offer.outbound.segments.length <= 1) return '';
        return offer.outbound.segments.slice(0, -1).map(seg => seg.arrival.airport).join(', ');
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Dark Header */}
            <header className={styles.darkHeader}>
                <div className={styles.headerContent}>
                    <a href="/flights" onClick={(e) => { e.preventDefault(); router.back(); }} className={styles.backLink}>
                        <ArrowLeft size={18} />
                        <span>Back to results</span>
                    </a>
                    <div className={styles.logoCenter}>
                        <span className={styles.logoIcon}>✈</span>
                        <span>Skyscanner</span>
                    </div>
                    <button className={styles.saveButton}>
                        <Heart size={18} />
                        <span>Save</span>
                    </button>
                </div>
                <div className={styles.destinationInfo}>
                    <h1 className={styles.destinationName}>
                        {offer.outbound.arrival.city || offer.outbound.arrival.airport}
                    </h1>
                    <p className={styles.tripMeta}>1 traveller • One way • Economy class</p>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.mainContainer}>
                <div className={styles.mainGrid}>
                    {/* Left Column: Book your ticket */}
                    <div className={styles.bookingSection}>
                        <h2 className={styles.sectionTitle}>Book your ticket</h2>

                        <div className={styles.readBeforeBookingWrapper}>
                            <div
                                className={styles.readBeforeBooking}
                                onClick={() => setIsReadBeforeBookingOpen(!isReadBeforeBookingOpen)}
                            >
                                <Info size={16} />
                                <span>Read before booking</span>
                                {isReadBeforeBookingOpen ? (
                                    <ChevronUp size={16} className={styles.chevronRight} />
                                ) : (
                                    <ChevronDown size={16} className={styles.chevronRight} />
                                )}
                            </div>
                            {isReadBeforeBookingOpen && (
                                <div className={styles.readBeforeBookingContent}>
                                    <p>
                                        Prices include an estimate of mandatory taxes and charges. Baggage and ticket
                                        conditions are estimates. Some providers charge extra for baggage, insurance
                                        or using credit cards. <a href="#" className={styles.checkFeesLink}>Check airline fees</a>
                                    </p>
                                    <p className={styles.checkDetailsNote}>
                                        Check all ticket details and prices on the provider's site before booking.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className={styles.mustInclude}>
                            <span className={styles.mustIncludeLabel}>Must include</span>
                            <span className={styles.bagBadge}><Briefcase size={14} /> Cabin bag</span>
                            <span className={styles.bagBadge}><Luggage size={14} /> Checked bag</span>
                        </div>

                        {/* Booking Partner Cards */}
                        {bookingPartners.map((partner, idx) => (
                            <div key={idx} className={styles.partnerCard}>
                                <div className={styles.partnerHeader}>
                                    <div className={styles.partnerNameRow}>
                                        <span className={styles.partnerName}>{partner.name}</span>
                                        {partner.isAirline && <span className={styles.airlineBadge}>Airline</span>}
                                    </div>
                                    <div className={styles.partnerRating}>
                                        <Star size={14} fill="#f5a623" stroke="#f5a623" />
                                        <span className={styles.ratingValue}>{partner.rating}</span>
                                        <span className={styles.ratingMax}>/5</span>
                                        <a href="#" className={styles.reviewsLink}>{partner.reviews.toLocaleString()}</a>
                                    </div>
                                </div>

                                <div className={styles.partnerFeatures}>
                                    {partner.features.map((feature, fidx) => (
                                        <div key={fidx} className={styles.featureItem}>
                                            {feature.includes('discount') || feature.includes('Discount') ? (
                                                <Gift size={14} className={styles.featureIconGift} />
                                            ) : (
                                                <Check size={14} className={styles.featureIconCheck} />
                                            )}
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                    <div className={styles.featureItem}>
                                        <Info size={14} className={styles.featureIconInfo} />
                                        <span>Partner's Terms and Conditions applicable.</span>
                                    </div>
                                </div>

                                <div className={styles.partnerFooter}>
                                    <div className={styles.partnerPrice}>
                                        {formatPrice(partner.price, offer.currency)}
                                    </div>
                                    <button
                                        className={styles.selectButton}
                                        onClick={() => handleSelect(partner.name)}
                                    >
                                        Select
                                    </button>
                                </div>

                                <div className={styles.moreFares}>
                                    <Briefcase size={14} />
                                    <Luggage size={14} />
                                    <a href="#" className={styles.moreFaresLink}>More fares</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Flight details */}
                    <div className={styles.flightDetailsSection}>
                        <h2 className={styles.sectionTitle}>Flight details</h2>

                        <div className={styles.flightSummaryCard}>
                            <div className={styles.outboundHeader}>
                                <span className={styles.outboundLabel}>Outbound</span>
                                <span className={styles.outboundDate}>{formatDate()}</span>
                                <span className={styles.localTimeNote}>all times are local</span>
                            </div>

                            <div
                                className={styles.flightSummaryRow}
                                onClick={() => setIsFlightDetailsExpanded(!isFlightDetailsExpanded)}
                            >
                                <div className={styles.summaryLeft}>
                                    <img
                                        src={offer.airline.logo || ''}
                                        alt={offer.airline.name}
                                        className={styles.summaryAirlineLogo}
                                    />
                                    <div className={styles.summaryTimes}>
                                        <span className={styles.summaryTime}>{offer.outbound.departure.time}</span>
                                        <div className={styles.summaryDuration}>
                                            <span className={styles.durationText}>{offer.outbound.duration}</span>
                                            <div className={styles.durationLine}>
                                                <div className={styles.lineDot}></div>
                                                <div className={styles.lineBar}></div>
                                                {offer.outbound.stops > 0 && (
                                                    <div className={styles.stopsIndicator}>
                                                        <span className={styles.stopsText}>{getStopsLabel()}</span>
                                                        <span className={styles.stopsAirports}>{getStopAirports()}</span>
                                                    </div>
                                                )}
                                                <div className={styles.lineDot}></div>
                                            </div>
                                        </div>
                                        <span className={styles.summaryTime}>{offer.outbound.arrival.time}</span>
                                    </div>
                                    <div className={styles.summaryAirports}>
                                        <span>{offer.outbound.departure.airport}</span>
                                        <span>{offer.outbound.arrival.airport}</span>
                                    </div>
                                </div>
                                <button className={styles.expandButton}>
                                    {isFlightDetailsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>

                            <div className={styles.operatedBy}>
                                Partly operated by {offer.airline.name}
                            </div>

                            {/* Expanded Flight Details */}
                            {isFlightDetailsExpanded && offer.outbound.segments && (
                                <div className={styles.expandedDetails}>
                                    {offer.outbound.segments.map((seg, idx) => (
                                        <div key={idx}>
                                            {/* Segment Header */}
                                            <div className={styles.segmentHeader}>
                                                <img
                                                    src={seg.mkCarrier.logo}
                                                    alt={seg.mkCarrier.name}
                                                    className={styles.segmentAirlineLogo}
                                                />
                                                <span className={styles.segmentAirlineName}>
                                                    {seg.mkCarrier.name} {seg.flightNumber}
                                                </span>
                                                {seg.opCarrier && (
                                                    <span className={styles.operatedByText}>
                                                        | Operated by {seg.opCarrier.name}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Departure */}
                                            <div className={styles.timelineItem}>
                                                <div className={styles.timelineDot}></div>
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.timelineTime}>{seg.departure.time}</div>
                                                    <div className={styles.timelinePlace}>
                                                        {seg.departure.airport} {seg.departure.city}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div className={styles.timelineItem}>
                                                <div className={styles.timelineLine}></div>
                                                <div className={styles.segmentDuration}>
                                                    <Clock size={14} />
                                                    <span>{seg.duration}</span>
                                                </div>
                                                <div className={styles.segmentAmenities}>
                                                    <Wifi size={14} />
                                                    <Utensils size={14} />
                                                    <span className={styles.showInfo}>Show info</span>
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div className={styles.timelineItem}>
                                                <div className={styles.timelineDot}></div>
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.timelineTime}>{seg.arrival.time}</div>
                                                    <div className={styles.timelinePlace}>
                                                        {seg.arrival.airport} {seg.arrival.city}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Connection if not last segment */}
                                            {idx < (offer.outbound.segments?.length || 0) - 1 && (
                                                <div className={styles.connectionBadge}>
                                                    <span className={styles.connectionTime}>2h 45</span>
                                                    <span className={styles.connectionText}>Connect in airport</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className={styles.arrivalInfo}>
                                        <span className={styles.arrivesLabel}>Arrives:</span>
                                        <span>{formatDate()}</span>
                                        <span className={styles.separator}>|</span>
                                        <span className={styles.journeyDuration}>
                                            Journey duration: {offer.outbound.duration}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
