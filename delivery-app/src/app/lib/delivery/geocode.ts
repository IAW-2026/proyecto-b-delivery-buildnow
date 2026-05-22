export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult> {

  const params = new URLSearchParams({
    q: address,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1'
  });

  const url =
    `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'delivery-app'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Error consultando Nominatim');
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error('Dirección no encontrada');
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}