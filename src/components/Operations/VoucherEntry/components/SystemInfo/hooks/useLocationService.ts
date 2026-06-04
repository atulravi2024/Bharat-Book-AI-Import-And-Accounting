import React from "react";
import { AddressData } from "../Geocoders";

export function useLocationService(addressSearchQuery: string, setIsSearchingAddress: any, cachedIpAddress: string | null) {
  // Use state to hold the current coordinates and status of the user logging in
  const [latitude, setLatitude] = React.useState<string>("Retrieving...");
  const [longitude, setLongitude] = React.useState<string>("Retrieving...");
  const [geolocationStatus, setGeolocationStatus] = React.useState<string>(
    "Retrieving position...",
  );

  // State variables for reverse-geocoded address fields
  const [streetAddress, setStreetAddress] = React.useState<string>(
    "P.D'Mello Road, Carnac Bunder",
  );
  const [cityField, setCityField] = React.useState<string>("Mumbai");
  const [stateField, setStateField] = React.useState<string>("Maharashtra");
  const [countryField, setCountryField] = React.useState<string>("India");
  const [postalField, setPostalField] = React.useState<string>("400001");

  const handleAddressResolved = React.useCallback((addr: AddressData) => {
    setStreetAddress(addr.road || "N/A");
    setCityField(addr.city || "N/A");
    setStateField(addr.state || "N/A");
    setCountryField(addr.country || "N/A");
    setPostalField(addr.postal || "N/A");
  }, []);


  return { latitude, setLatitude, longitude, setLongitude, geolocationStatus, setGeolocationStatus, streetAddress, setStreetAddress, cityField, setCityField, stateField, setStateField, countryField, setCountryField, postalField, setPostalField, handleAddressResolved };
}
