import { MapaEstaticoProps } from "../../../types/index";
export function obtenerUrlMapaEstatico({
  latitud,
  longitud,
  zoom = 15,
  ancho = 600,
  alto = 400
}: MapaEstaticoProps): string {
  
  // En Next.js (App Router), las variables públicas del entorno se acceden así:
  const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

  if (!API_KEY) {
    console.warn("Geoapify API Key no encontrada en las variables de entorno.");
  }

  const posicion = `lonlat:${longitud},${latitud}`;

  return `https://maps.geoapify.com/v1/staticmap?` +
    `style=osm-carto` +
    `&width=${ancho}` +
    `&height=${alto}` +
    `&center=${posicion}` +
    `&zoom=${zoom}` +
    `&marker=${posicion};color:%23ff0000;size:medium` +
    `&apiKey=${API_KEY}`;
}