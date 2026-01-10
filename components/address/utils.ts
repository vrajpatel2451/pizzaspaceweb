// Types
export interface ParsedAddress {
  formattedAddress: string;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  lat: number;
  long: number;
}

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

// UK default center (London)
export const DEFAULT_CENTER = { lat: 51.5074, lng: -0.1278 };
export const DEFAULT_ZOOM = 15;

// Parse Google Geocoding result into our address format
export function parseGeocodingResult(
  result: google.maps.GeocoderResult
): ParsedAddress {
  const components = result.address_components;
  const location = result.geometry.location;

  const getComponent = (types: string[]): string => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.long_name || "";
  };

  const streetNumber = getComponent(["street_number"]);
  const route = getComponent(["route"]);
  const premise = getComponent(["premise"]);
  const subpremise = getComponent(["subpremise"]);

  // Build line1 from street number + route
  let line1 = "";
  if (streetNumber && route) {
    line1 = `${streetNumber} ${route}`;
  } else if (route) {
    line1 = route;
  } else if (premise) {
    line1 = premise;
  }

  // Line2 for subpremise/building details
  const line2 = subpremise || "";

  return {
    formattedAddress: result.formatted_address,
    line1,
    line2,
    area:
      getComponent(["neighborhood", "sublocality", "sublocality_level_1"]) ||
      getComponent(["locality", "postal_town"]),
    city: getComponent(["locality", "postal_town"]),
    county: getComponent([
      "administrative_area_level_2",
      "administrative_area_level_1",
    ]),
    country: getComponent(["country"]),
    zip: getComponent(["postal_code"]),
    lat: typeof location.lat === "function" ? location.lat() : location.lat,
    long: typeof location.lng === "function" ? location.lng() : location.lng,
  };
}
