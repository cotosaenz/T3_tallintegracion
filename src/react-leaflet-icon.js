import point from './icons/point.png';
import point2 from './icons/point2.png';
import plane from './icons/plane.png';
import L from 'leaflet';

export const Point = L.icon({
  iconUrl: point,
  iconSize: [15 , 15]
});

export const Point2 = L.icon({
  iconUrl: point2,
  iconSize: [5 , 5]
});

export const Plane = L.icon({
  iconUrl: plane,
  iconSize: [45 , 45]
});