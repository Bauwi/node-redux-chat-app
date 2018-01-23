import React, { Component } from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import mapStyle from "./../utils/mapStyle.json";

export class MapComponent extends Component {
  componentDidMount() {
    console.log("mounted");
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: this.props.coords[0], lng: this.props.coords[1] }}
        defaultOptions={{ styles: mapStyle }}
      >
        {this.props.isMarkerShown && (
          <Marker
            position={{ lat: this.props.coords[0], lng: this.props.coords[1] }}
          />
        )}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCNMJzIeL9I4d8b03tzohG-PBciEkrF3gw",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `50vh`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(MapComponent);
