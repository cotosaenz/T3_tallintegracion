import React, { Component } from 'react';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

export const MarkerIcon = L.icon({
  iconUrl: './icons/plane.png',
  shadowUrl: iconShadow,
  shadowSize:   [30, 30],
  iconSize:[40,40],
  iconAnchor:[20,20]
});

class Map extends Component {
  state = {
    plane: this.func()
  }
  func () {
    var plane = L.icon({
      iconUrl:'./icons/plane.png',
      iconSize:[40,40],
      iconAnchor:[20,20]
    })
    return L.marker([51.5, -0.09], {icon: plane});
  }
  render() {
    return (
      <div>{this.plane}</div>
    );
  }
}    

export default Map;