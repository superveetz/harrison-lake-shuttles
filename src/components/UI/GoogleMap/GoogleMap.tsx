import React from "react";

import Aux from "../../../hoc/Auxillary/Auxillary";
import { StaticGoogleMap, Marker, Path } from "react-static-google-map";
const classes: any = require("./GoogleMap.module.css");

interface GoogleMapProps {
  view?: string;
}

const googleMap = (props: GoogleMapProps) => {
  let mapURL =
    "https://www.google.com/maps/embed?pb=!1m24!1m8!1m3!1d334324.5749051354!2d-122.6473957203125!3d49.10733611840353!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x548411f357b6823d%3A0x29d5d3341634104e!2sHarrison+Hot+Springs%2C+British+Columbia!3m2!1d49.302472699999996!2d-121.7853114!4m5!1s0x548674e128ff0b2f%3A0xf03b13fb056e5501!2sBridgeport+Station%2C+Richmond%2C+BC!3m2!1d49.1955415!2d-123.126036!5e0!3m2!1sen!2sca!4v1552112346600&key=AIzaSyAw9kYNLf_uviqGxodHhrH_mNYHYz1dogg&zoom=4";
  return (
    <div className={classes.GoogleMap}>
      <iframe src="https://www.google.com/maps/d/embed?mid=1PqmYhFbE5hXmEto1EsesBwRvFYD789tP" />
    </div>
  );
  return (
    // <Aux>
    //   <div style={{ width: "100%", height: "100%", minHeight: "420px" }}>
    //     <iframe allowFullScreen={true} src={mapURL} width="100%" height="100%" style={{ border: "0" }} />
    //   </div>
    // </Aux>
    <StaticGoogleMap size="600x600">
      {/* <Marker location={{ lat: 40.737102, lng: -73.990318 }} color="blue" label="P" /> */}
      <Path points={["40.737102,-73.990318", "40.749825,-73.987963", "40.752946,-73.987384", "40.755823,-73.986397"]} />
    </StaticGoogleMap>
  );
};

export default googleMap;
