import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  PhoneCall,
  Check,
  SlidersHorizontal,
  ExternalLink,
  Mic,
  Receipt
} from 'lucide-react';
import { MumbaiHotel } from '../types';
import { MUMBAI_HOTELS } from '../services/mumbaiHotelsData';
import { MumbaiHotelBookingModal } from '../components/forms/MumbaiHotelBookingModal';
import { MumbaiHotelDetailsModal } from '../components/forms/MumbaiHotelDetailsModal';
import { ApiService } from '../services/api';
import { useToast } from '../components/common/Toast';

interface MumbaiHotelBookingPageProps {
  onOpenTableBookingForHotel?: (hotel: MumbaiHotel) => void;
  onOpenAiVoiceReceptionist?: () => void;
  activeHotelId?: string;
  onSelectActiveHotel?: (hotelId: string) => void;
}

export const MumbaiHotelBookingPage: React.FC<MumbaiHotelBookingPageProps> = ({
  onOpenTableBookingForHotel,
  onOpenAiVoiceReceptionist,
  activeHotelId = 'taj-mahal-palace',
  onSelectActiveHotel,
}) => {
  const { showToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [checkInDate, setCheckInDate] = useState('2026-10-18');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-20');
  const [adults, setAdults] = useState(2);

  // Active Modals
  const [bookingModalHotel, setBookingModalHotel] = useState<MumbaiHotel | null>(null);
  const [detailsModalHotel, setDetailsModalHotel] = useState<MumbaiHotel | null>(null);

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return MUMBAI_HOTELS.filter((h) => {
      // Zone filter
      if (selectedZone !== 'All' && h.zone !== selectedZone) return false;

      // Price filter
      if (priceFilter === 'under_20k' && h.startingPrice >= 20000) return false;
      if (priceFilter === '20k_to_30k' && (h.startingPrice < 20000 || h.startingPrice > 30000)) return false;
      if (priceFilter === 'above_30k' && h.startingPrice <= 30000) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesNeighborhood = h.neighborhood.toLowerCase().includes(q);
        const matchesAddress = h.address.toLowerCase().includes(q);
        const matchesChain = h.chain.toLowerCase().includes(q);
        const matchesLandmark = h.distanceHighlights.some((d) => d.label.toLowerCase().includes(q));
        const matchesDining = h.diningVenues.some((d) => d.name.toLowerCase().includes(q));
        if (!matchesName && !matchesNeighborhood && !matchesAddress && !matchesChain && !matchesLandmark && !matchesDining) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price_high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended order
    });
  }, [searchQuery, selectedZone, priceFilter, sortBy]);

  const handleSwitchActiveHotel = async (hotel: MumbaiHotel) => {
    await ApiService.switchActiveHotel(hotel.id);
    if (onSelectActiveHotel) {
      onSelectActiveHotel(hotel.id);
    }
    showToast(`${hotel.name} set as active property for front desk operations.`, 'success');
  };

  const zones = [
    'All',
    'South Mumbai',
    'Bandra & Juhu Coast',
    'Lower Parel & Worli',
    'BKC Financial District',
    'Airport & North Mumbai',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-1 rounded-full">
              MUMBAI, MAHARASHTRA • INDIA
            </span>
            <span className="text-[10px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified 5-Star Luxury & Business Properties
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Book 5-Star Luxury Hotels in Mumbai
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct reservations at Mumbai’s iconic luxury hotels including The Taj Mahal Palace, The Oberoi, The St. Regis, JW Marriott Juhu, and ITC Maratha. Best INR rates, 18% GST billing, and instant confirmation.
          </p>
        </div>

        {/* Quick Search Bar Controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search hotel, Colaba, Marine Drive, BKC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Dates Picker */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                title="Check-in Date"
              />
            </div>
            <span className="text-slate-500 text-xs">→</span>
            <div className="flex-1">
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                title="Check-out Date"
              />
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Price Ranges</option>
              <option value="under_20k">Under ₹20,000 / night</option>
              <option value="20k_to_30k">₹20,000 - ₹30,000 / night</option>
              <option value="above_30k">Above ₹30,000 / night</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Guest Rating: Highest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Neighborhood / Zone Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 px-2 shrink-0">
          Mumbai Area:
        </span>
        {zones.map((zone) => {
          const isSelected = selectedZone === zone;
          return (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {zone}
            </button>
          );
        })}
      </div>

      {/* Results Count & Quick Status */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredHotels.length}</strong> top hotels in Mumbai, India
        </span>
        {(searchQuery || selectedZone !== 'All' || priceFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedZone('All');
              setPriceFilter('all');
              setSortBy('recommended');
            }}
            className="text-sky-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredHotels.map((hotel) => {
          const isActive = hotel.id === activeHotelId;
          return (
            <div
              key={hotel.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col md:flex-row ${
                isActive ? 'border-sky-400 ring-2 ring-sky-400/20' : 'border-sky-100 hover:border-slate-300'
              }`}
            >
              {/* Hotel Photo Section */}
              <div className="md:w-80 h-56 md:h-auto relative shrink-0 bg-slate-100">
                <img
                  src={hotel.heroImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

                {/* Featured Badge */}
                {hotel.featuredTag && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                    {hotel.featuredTag}
                  </span>
                )}

                {/* Active Property Indicator */}
                {isActive && (
                  <span className="absolute bottom-3 left-3 md:top-3 md:left-auto md:right-3 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active in Front Desk</span>
                  </span>
                )}
              </div>

              {/* Hotel Info Content */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  {/* Top Line: Chain & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-sky-700 tracking-wide uppercase font-mono">
                      {hotel.chain} • {hotel.zone}
                    </span>
                    <div className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-900">{hotel.rating}</span>
                      <span className="text-[10px] text-slate-500">
                        ({hotel.reviewCount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {/* Hotel Name */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {hotel.name}
                  </h3>

                  {/* Address */}
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{hotel.address}</span>
                  </p>

                  {/* Distance snippets */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-slate-600">
                    {hotel.distanceHighlights.slice(0, 2).map((dist, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {dist.label}: <strong className="text-slate-900">{dist.distance}</strong>
                      </span>
                    ))}
                  </div>

                  {/* Signature Dining */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-700">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Dining:</span>
                    <span className="truncate text-slate-600">
                      {hotel.diningVenues.map((v) => v.name).join(' • ')}
                    </span>
                  </div>

                  {/* Key Amenities */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 5).map((am, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 border border-sky-100"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Price & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Pricing */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Starting Rate
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                        ₹{hotel.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500">/ night</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium block">
                      + 18% Indian Hospitality GST • Free Cancellation
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailsModalHotel(hotel)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      Details & Dining
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenTableBookingForHotel) {
                          onOpenTableBookingForHotel(hotel);
                        } else {
                          setDetailsModalHotel(hotel);
                        }
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Reserve Table</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingModalHotel(hotel)}
                      className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
                    >
                      Book Room Now
                    </button>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => handleSwitchActiveHotel(hotel)}
                        title="Set this hotel as the active property for Front Desk PMS management"
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Building2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Mumbai Hotel Booking Essentials Accordion */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Receipt className="w-4 h-4 text-sky-600" />
          <span>Mumbai Hotel Booking Guidelines & Taxes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Indian GST Tax Slabs</h4>
            <p className="leading-relaxed text-slate-600">
              Hotel rooms with nightly tariff above ₹7,500 attract 18% Goods & Services Tax (GST). Official GSTIN invoices are provided for corporate input tax credit.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Check-in & Identification</h4>
            <p className="leading-relaxed text-slate-600">
              Standard Mumbai hotel check-in is 14:00 and check-out is 12:00. Government photo ID (Aadhaar, Passport, or Voter ID) is mandatory for all adult guests.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">Chhatrapati Shivaji Airport (BOM)</h4>
            <p className="leading-relaxed text-slate-600">
              All listed hotels offer pre-scheduled luxury airport chauffeur services. South Mumbai is reachable in ~40 mins via the coastal road, and BKC in ~18 mins.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalHotel && (
        <MumbaiHotelBookingModal
          isOpen={!!bookingModalHotel}
          onClose={() => setBookingModalHotel(null)}
          hotel={bookingModalHotel}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialAdults={adults}
        />
      )}

      {/* Details Modal */}
      {detailsModalHotel && (
        <MumbaiHotelDetailsModal
          isOpen={!!detailsModalHotel}
          onClose={() => setDetailsModalHotel(null)}
          hotel={detailsModalHotel}
          onBookRoom={() => setBookingModalHotel(detailsModalHotel)}
          onReserveTable={() => {
            if (onOpenTableBookingForHotel) {
              onOpenTableBookingForHotel(detailsModalHotel);
            }
          }}
        />
      )}
    </div>
  );
};
