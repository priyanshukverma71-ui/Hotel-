import React, { useState } from 'react';
import {
  X,
  MapPin,
  Star,
  Phone,
  Mail,
  UtensilsCrossed,
  Clock,
  Compass,
  Check,
  BedDouble,
  ShieldCheck,
  Sparkles,
  Building2
} from 'lucide-react';
import { MumbaiHotel } from '../../types';

interface MumbaiHotelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: MumbaiHotel;
  onBookRoom: () => void;
  onReserveTable: () => void;
}

export const MumbaiHotelDetailsModal: React.FC<MumbaiHotelDetailsModalProps> = ({
  isOpen,
  onClose,
  hotel,
  onBookRoom,
  onReserveTable,
}) => {
  const [activeImage, setActiveImage] = useState(hotel.heroImage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-sky-100 max-w-3xl w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={activeImage}
            alt={hotel.name}
            className="w-full h-full object-cover opacity-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hotel Name & Stars Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/80 text-white uppercase tracking-wider">
                {hotel.chain}
              </span>
              <span className="text-amber-400 text-xs flex items-center">
                {'★'.repeat(hotel.starRating)}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                • {hotel.rating} / 5 ({hotel.reviewCount.toLocaleString('en-IN')} reviews)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {hotel.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{hotel.address}</span>
            </p>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {hotel.galleryImages.length > 0 && (
          <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveImage(hotel.heroImage)}
              className={`h-12 w-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                activeImage === hotel.heroImage ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={hotel.heroImage} alt="Main" className="w-full h-full object-cover" />
            </button>
            {hotel.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`h-12 w-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  activeImage === img ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Quick Contact & Timings Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Concierge</span>
              <a href={`tel:${hotel.phone}`} className="font-semibold text-sky-700 hover:underline">
                {hotel.phone}
              </a>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-in / Check-out</span>
              <span className="font-semibold text-slate-800">14:00 Check-in • 12:00 Check-out</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Inquiries</span>
              <span className="font-semibold text-slate-800 truncate block">{hotel.email}</span>
            </div>
          </div>

          {/* Key Amenities Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Property Amenities & Services</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/50 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Landmark Distances */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              <span>Mumbai Landmark Proximity</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {hotel.distanceHighlights.map((dist, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-800">{dist.label}</span>
                  <span className="font-mono text-sky-700 font-semibold">{dist.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fine Dining Venues */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4 text-sky-600" />
              <span>Restaurants & Fine Dining</span>
            </h3>
            <div className="space-y-2">
              {hotel.diningVenues.map((v, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{v.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                      {v.cuisine}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-700">Specialty:</span> {v.specialty}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{v.timing}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Starting from</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">
              ₹{hotel.startingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500"> / night + GST</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReserveTable();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Reserve Dining Table
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookRoom();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Book Room Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
