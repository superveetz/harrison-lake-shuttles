import * as React from "react";
import { scrollToTop } from "../../shared/util";

const classes: any = require("./Home.module.css");
import imgSlide4 from "../../assets/img/harrison-milky-way.jpg";

import Slider from "../../components/UI/Slider/Slider";
import Button from "../../components/UI/Button/Button";
import PageHeader from "../../components/UI/PageHeader/PageHeader";
import CheckList from "../../components/UI/CheckList/Checklist";
import GoogleMap from "../../components/UI/GoogleMap/GoogleMap";

class Home extends React.Component<{}, {}> {
  componentDidMount() {
    scrollToTop();
  }

  public render(): JSX.Element {
    const items = [
      {
        text: "Safe & Reliable Transport",
      },
      {
        text: "Top Notch Service",
      },
      {
        text: "Bookings Confirmed Instantly",
      },
      {
        text: "Best Price Guarenteed",
      },
    ];

    const section3Styles: any = {
      backgroundImage: `url(${imgSlide4})`,
      backgroundPosition: "bottom",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      position: "relative",
    };

    return (
      <div>
        <section>
          <Slider />
        </section>

        <section className={[classes.Section, classes.FlexCenter].join(" ")}>
          <div className="align-self-center">
            <PageHeader elem="h2" classes="my-3" centered>
              Why People Choose Us
            </PageHeader>

            <CheckList centered items={items} />
          </div>
        </section>

        <section style={section3Styles} className={[classes.Section, classes.Section3, classes.FlexCenter].join(" ")}>
          <Button classes="align-self-center" kind="link" size="btn-lg" to="/book-now" theme="secondary">
            Book Now
          </Button>

          <Button classes="align-self-center" kind="link" size="btn-lg" to="/contact" theme="primary">
            Contact Us
          </Button>
        </section>
      </div>
    );
  }
}

export default Home;
