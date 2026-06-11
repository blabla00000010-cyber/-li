import { useEffect, useRef } from 'react';
import { Listing, ListingCategory } from '../types';

interface MapContainerProps {
  listings: Listing[];
  selectedListingId: string | null;
  onSelectListing: (listing: Listing) => void;
  isAddingMode: boolean;
  addingCoords: { lat: number; lng: number } | null;
  onMapClickForCoords: (coords: { lat: number; lng: number }) => void;
}

// Helpers for category visual representations
const getCategoryEmoji = (category: ListingCategory): string => {
  switch (category) {
    case 'companies': return '🏢';
    case 'schools': return '🏫';
    case 'stores': return '☕';
    case 'others': return '📍';
  }
};

const getCategoryColor = (category: ListingCategory): string => {
  switch (category) {
    case 'companies': return '#3b82f6'; // blue-500
    case 'schools': return '#10b981'; // emerald-500
    case 'stores': return '#f59e0b'; // amber-500
    case 'others': return '#8b5cf6'; // purple-500
  }
};

export default function MapContainer({
  listings,
  selectedListingId,
  onSelectListing,
  isAddingMode,
  addingCoords,
  onMapClickForCoords,
}: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const addMarkerRef = useRef<any>(null);

  const L = (window as any).L;

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !L) return;

    // Center map around Riyadh initially
    const initialLat = 24.7136;
    const initialLng = 46.6753;
    const initialZoom = 12;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([initialLat, initialLng], initialZoom);

    // Zoom controls at bottom-right or top-right instead
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Modern light-themed Voyager tile layer (very clean and premium look!)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;

    // Listen to map clicks
    map.on('click', (e: any) => {
      // If we are in adding mode, send the click coordinates up
      onMapClickForCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Sync isAddingMode / addingCoords
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !L) return;

    if (isAddingMode && addingCoords) {
      // Remove old adding marker if exists
      if (addMarkerRef.current) {
        map.removeLayer(addMarkerRef.current);
      }

      // Create a glowing pulse marker for adding mode
      const pinIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center rounded-full bg-rose-500 border-4 border-white shadow-xl animate-bounce" style="width: 44px; height: 44px;">
            <span class="text-white text-lg">💡</span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-rose-500"></div>
          </div>
        `,
        className: 'adding-pin-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      addMarkerRef.current = L.marker([addingCoords.lat, addingCoords.lng], { icon: pinIcon }).addTo(map);
      map.setView([addingCoords.lat, addingCoords.lng], 14, { animate: true });
    } else {
      if (addMarkerRef.current) {
        map.removeLayer(addMarkerRef.current);
        addMarkerRef.current = null;
      }
    }
  }, [isAddingMode, addingCoords]);

  // 3. Sync Listings Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !L) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    // Render new ones
    listings.forEach((listing) => {
      const color = getCategoryColor(listing.category);
      const emoji = getCategoryEmoji(listing.category);
      const isActive = selectedListingId === listing.id;

      // Custom SVG DivIcon
      const border = isActive ? 'border-4 border-slate-900 scale-120 z-[999]' : 'border-2 border-white';
      const size = isActive ? 44 : 36;
      const shadow = isActive ? 'shadow-2xl' : 'shadow-md';

      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center rounded-full aspect-square transition-all duration-300 ${border} ${shadow}" 
               style="background-color: ${color}; width: ${size}px; height: ${size}px;">
            <span class="text-white text-base leading-none select-none">${emoji}</span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px]" 
                 style="border-t-color: ${isActive ? '#0f172a' : color};"></div>
          </div>
        `,
        className: `custom-marker-icon-${listing.id}`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
      });

      const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);

      // Create helpful Arabic popup
      const popupContent = `
        <div class="p-1 text-right" style="direction: rtl;">
          <h3 class="font-bold text-slate-900 text-sm mb-1">${listing.name}</h3>
          <p class="text-xs text-slate-500 mb-1.5 flex items-center gap-1 justify-end">
            <span>${listing.address}</span>
            <span>📍</span>
          </p>
          <div class="flex items-center gap-1 justify-end">
            <span class="text-amber-500 font-bold text-xs">${listing.rating}</span>
            <span class="text-slate-400 text-xs">(${listing.reviewsCount} تقييم)</span>
            <span class="text-amber-400 text-xs">★</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: L.point(0, -5) });

      // Handle marker Click
      marker.on('click', () => {
        onSelectListing(listing);
      });

      markersRef.current[listing.id] = marker;

      // If active, open popup right away
      if (isActive) {
        marker.openPopup();
      }
    });
  }, [listings, selectedListingId]);

  // 4. Center map when selected listing changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedListingId) return;

    const activeList = listings.find((l) => l.id === selectedListingId);
    if (activeList) {
      map.setView([activeList.lat, activeList.lng], 14, {
        animate: true,
        duration: 1.0,
      });

      // Also trigger popup manually
      const marker = markersRef.current[selectedListingId];
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [selectedListingId, listings]);

  if (!L) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium">جاري تحميل نظام الخرائط التفاعلية...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      {/* Map Element */}
      <div id="leaflet-map" ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Mode Indicators overlay */}
      {isAddingMode && (
        <div className="absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700/80 text-sm flex items-center gap-2 animate-pulse font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>📍 انقر على الخريطة لتحديد موقع منشأتك الجديد</span>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md border border-slate-100 text-xs text-slate-700 space-y-1.5">
        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1 text-center">ألوان التصنيفات</p>
        <div className="flex items-center gap-1.5 justify-start">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
          <span>🏢 شركات ومؤسسات</span>
        </div>
        <div className="flex items-center gap-1.5 justify-start">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>🏫 مدارس وجامعات</span>
        </div>
        <div className="flex items-center gap-1.5 justify-start">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span>☕ محلات ومقاهي</span>
        </div>
        <div className="flex items-center gap-1.5 justify-start">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
          <span>📍 خدمات أخرى</span>
        </div>
      </div>
    </div>
  );
}
