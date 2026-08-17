import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    L: any;
  }
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  color?: 'purple' | 'emerald' | 'cyan';
  onClick?: () => void;
}

interface PharmacyMapProps {
  centerLat: number;
  centerLng: number;
  markers: MapMarker[];
  zoom?: number;
  heightClass?: string;
  centerLabel?: string;
}

const COLOR_HEX: Record<string, string> = {
  purple: '#a855f7',
  emerald: '#10b981',
  cyan: '#22d3ee',
};

function buildIcon(color: string) {
  const hex = COLOR_HEX[color] || COLOR_HEX.purple;
  return window.L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${hex};border:2px solid white;box-shadow:0 0 8px ${hex}99"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// خريطة تفاعلية بسيطة تعتمد على Leaflet + OpenStreetMap (مجانية بالكامل، بدون مفتاح API).
export const PharmacyMap: React.FC<PharmacyMapProps> = ({ centerLat, centerLng, markers, zoom = 13, heightClass = 'h-72', centerLabel = 'موقعك الحالي' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // إنشاء الخريطة مرة واحدة
  useEffect(() => {
    if (!containerRef.current || !window.L) return;
    if (mapRef.current) return;

    const map = window.L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([centerLat, centerLng], zoom);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markersLayerRef.current = window.L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // إعادة توسيط الخريطة عند تغيّر الموقع المركزي
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([centerLat, centerLng], zoom);
    }
  }, [centerLat, centerLng, zoom]);

  // تحديث العلامات
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !window.L) return;
    markersLayerRef.current.clearLayers();

    // علامة الموقع المركزي (موقعي الحالي أو موقع طرف آخر، حسب centerLabel)
    window.L.marker([centerLat, centerLng], { icon: buildIcon('cyan') })
      .bindPopup(centerLabel)
      .addTo(markersLayerRef.current);

    markers.forEach((m) => {
      const marker = window.L.marker([m.lat, m.lng], { icon: buildIcon(m.color || 'purple') })
        .bindPopup(m.label)
        .addTo(markersLayerRef.current);
      if (m.onClick) {
        marker.on('click', m.onClick);
      }
    });
  }, [markers, centerLat, centerLng, centerLabel]);

  return (
    <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-emerald-500/20`}>
      <div ref={containerRef} className="w-full h-full" style={{ background: '#0f172a' }} />
    </div>
  );
};
