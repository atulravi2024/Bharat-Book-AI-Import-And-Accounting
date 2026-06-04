import React from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useLanguage } from "../../../../../context/LanguageContext";

export const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";
export const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

export interface AddressData {
  road: string;
  city: string;
  state: string;
  country: string;
  postal: string;
}

export interface AddressGeocoderProps {
  latitude: number | null;
  longitude: number | null;
  onAddressResolved: (data: AddressData) => void;
  setGeocodingStatus: (status: string) => void;
}

export const AddressGeocoder: React.FC<AddressGeocoderProps> = ({
  latitude,
  longitude,
  onAddressResolved,
  setGeocodingStatus,
}) => {
  const { t } = useLanguage();
  const geocodingLib = useMapsLibrary("geocoding");
  const map = useMap();

  React.useEffect(() => {
    if (
      !geocodingLib ||
      latitude === null ||
      longitude === null ||
      isNaN(latitude) ||
      isNaN(longitude)
    )
      return;

    setGeocodingStatus(t("Invoking Google Reverse-Geocoding Engine..."));
    const geocoder = new geocodingLib.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        let city = "";
        let state = "";
        let country = "";
        let postal = "";

        const comps = results[0].address_components;
        let streetNumber = "";
        let route = "";
        let sublocality = "";
        let neighborhood = "";

        for (const comp of comps) {
          const types = comp.types;
          if (types.includes("street_number")) {
            streetNumber = comp.long_name;
          } else if (types.includes("route")) {
            route = comp.long_name;
          } else if (
            types.includes("sublocality_level_1") ||
            types.includes("sublocality")
          ) {
            sublocality = comp.long_name;
          } else if (types.includes("neighborhood")) {
            neighborhood = comp.long_name;
          } else if (types.includes("locality")) {
            city = comp.long_name;
          } else if (types.includes("administrative_area_level_2") && !city) {
            city = comp.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = comp.long_name;
          } else if (types.includes("country")) {
            country = comp.long_name;
          } else if (types.includes("postal_code")) {
            postal = comp.long_name;
          }
        }

        const streetParts = [
          streetNumber,
          route,
          neighborhood,
          sublocality,
        ].filter(Boolean);
        let road = streetParts.join(", ");
        if (!road) {
          road = results[0].formatted_address.split(",")[0] || "";
        }

        onAddressResolved({ road, city, state, country, postal });
        setGeocodingStatus(
          t("Coordinates and street address verified via Google Maps API"),
        );

        if (map) {
          map.panTo(latlng);
        }
      } else {
        setGeocodingStatus(`Reverse geocode finished: ${status}`);
      }
    });
  }, [
    geocodingLib,
    latitude,
    longitude,
    onAddressResolved,
    setGeocodingStatus,
    map,
  ]);

  return null;
};

export const OfflineGeocoder: React.FC<AddressGeocoderProps> = ({
  latitude,
  longitude,
  onAddressResolved,
  setGeocodingStatus,
}) => {
  const { t } = useLanguage();
  React.useEffect(() => {
    if (
      latitude === null ||
      longitude === null ||
      isNaN(latitude) ||
      isNaN(longitude)
    )
      return;

    setGeocodingStatus(t("Invoking backup OSM Reverse-Geocoding Engine..."));

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "BharatBookVoucherImportApp/1.0",
        },
        signal: controller.signal,
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.address) {
          const addr = data.address;
          const roadParts = [
            addr.road,
            addr.suburb,
            addr.neighbourhood,
            addr.pedestrian,
            addr.industrial,
            addr.village,
          ].filter(Boolean);

          let road = roadParts.slice(0, 2).join(", ");
          if (!road && data.display_name) {
            const parts = data.display_name.split(",");
            road = parts.slice(0, 2).join(",").trim();
          }
          if (!road) road = "N/A";

          const city =
            addr.city ||
            addr.town ||
            addr.city_district ||
            addr.suburb ||
            "N/A";
          const state = addr.state || "N/A";
          const country = addr.country || "N/A";
          const postal = addr.postcode || "N/A";

          onAddressResolved({ road, city, state, country, postal });
          setGeocodingStatus(
            t("Coordinates and street address verified via backup OpenStreetMap API"),
          );
        } else {
          setGeocodingStatus(
            "OSM Reverse Geocode empty, using default regional coordinates",
          );
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setGeocodingStatus(
          "Using default regional coordinates (Configure GOOGLE_MAPS_PLATFORM_KEY for live Map & high-precision lookup)",
        );
      });

    return () => {
      controller.abort();
    };
  }, [latitude, longitude, onAddressResolved, setGeocodingStatus]);

  return null;
};
