import React from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/" +
    "api/js?key=AIzaSyCWY5F_K-smbBNSPB2JwHEqHeekgYx0ahE" +
    "&v=3.exp&libraries=geometry,drawing,places&",
    loadingElement: <div style={{flex: 1, height: `100%` }} />,
    containerElement: <div style={{display: 'flex', flex:1, height: `400px` }} />,
    mapElement: <div style={{flex: 1, height: `100%`, width: '50%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <div style={{display: 'flex', flex: 1}}>
    <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
  </GoogleMap>
  </div>
  
)


export default Map
