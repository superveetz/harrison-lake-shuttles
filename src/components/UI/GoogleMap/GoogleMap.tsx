import React from "react";

import Aux from "../../../hoc/Auxillary/Auxillary";

interface GoogleMapProps {
    view?: string;
}

const googleMap = (props: GoogleMapProps) => {
    let mapURL =
        "https://www.google.com/maps/embed?pb=!1m24!1m8!1m3!1d198430.31620127073!2d-122.69916778287048!3d49.19718458165639!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x54860b36114fa739%3A0x3985da86883bd900!2sVancouver+International+Airport+(YVR)+Domestic+and+International+Terminals%2C+3211+Grant+McConachie+Way%2C+Richmond%2C+BC!3m2!1d49.195186299999996!2d-123.17887119999999!4m5!1s0x548411f357b6823d%3A0x29d5d3341634104e!2sHarrison+Hot+Springs%2C+BC!3m2!1d49.302472699999996!2d-121.7853114!5e0!3m2!1sen!2sca!4v1541424518718";
    let allowFullScreen = false;

    if (props.view == "street") {
        mapURL =
            "https://www.google.com/maps/embed?pb=!4v1541825395349!6m8!1m7!1skHgHe2lYJWKGvKKYdrPgBQ!2m2!1d49.30317104209142!2d-121.7838696658438!3f201.77223!4f0!5f0.7820865974627469";
        allowFullScreen = true;
    } else if (props.view == "marker") {
        mapURL = "https://www.google.com/maps/d/embed?mid=1YoW3MdCEaKqiuyqEGh0pYZPh-Q5AiArU&zoom=2";
    }
    return (
        <Aux>
            <div style={{ width: "100%", height: "100%", minHeight: "420px" }}>
                <iframe
                    allowFullScreen={allowFullScreen}
                    src={mapURL}
                    width="100%"
                    height="100%"
                    style={{ border: "0" }}
                />
            </div>
        </Aux>
    );
};

export default googleMap;
