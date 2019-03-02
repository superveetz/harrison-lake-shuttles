import * as React from "react";
import { CarouselItem, CarouselCaption } from "reactstrap";
import SlickSlider from "react-slick";
require("./Slider.css");

const classes: any = require("./Slider.module.css");

import imgSlide1 from "../../../assets/slide-1.jpg";
import imgSlide2 from "../../../assets/slide-2.jpg";
import imgSlide3 from "../../../assets/slide-3.jpg";
// import imgSlide4 from '../../../assets/slide-4.jpg';
// import imgSlide5 from '../../../assets/slide-5.jpg';

import Spinner from "../Spinner/Spinner";
import Aux from "../../../hoc/Auxillary/Auxillary";

const items = [
  {
    src: imgSlide1,
    altText: "Slide 1",
    caption: "Slide 1",
  },
  {
    src: imgSlide2,
    altText: "Slide 2",
    caption: "Slide 2",
  },
  {
    src: imgSlide3,
    altText: "Slide 3",
    caption: "Slide 3",
  },
];

class Slider extends React.Component<any, any> {
  private animating: boolean = true;

  constructor(props: any) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex: number) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map((item) => {
      return (
        <div className={classes.CarouselItem} key={item.src}>
          <div className={classes.ImgWrap}>
            <img style={{ height: "100%", width: "100%" }} src={item.src} alt={item.altText} />
          </div>

          {/* <CarouselCaption className="d-block" captionText={item.caption} captionHeader={item.caption} /> */}
        </div>
      );
    });

    var settings: any = {
      dots: false,
      autoplay: false,
      infinite: true,
      autoplaySpeed: 6000,
      pauseOnHover: false,
      pauseOnFocus: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <SlickSlider className={classes.Slider} {...settings}>
        {slides}
      </SlickSlider>
      // <Carousel className={classes.Slider} activeIndex={activeIndex} next={this.next} previous={this.previous}>
      //     <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
      //     {slides}
      //     <CarouselControl
      //         className={classes.CarouselControlLeft}
      //         direction="prev"
      //         directionText="Previous"
      //         onClickHandler={this.previous}
      //     />
      //     <CarouselControl
      //         className={classes.CarouselControlRight}
      //         direction="next"
      //         directionText="Next"
      //         onClickHandler={this.next}
      //     />
      // </Carousel>
    );
  }
}

export default Slider;
