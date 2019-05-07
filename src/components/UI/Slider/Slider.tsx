import * as React from "react";
import { CarouselItem, CarouselCaption } from "reactstrap";
import SlickSlider from "react-slick";
require("./Slider.css");

const classes: any = require("./Slider.module.css");

// import imgWelcomeSign from "../../../assets/img/harrison-welcome-sign.jpg";
import imgSlide1 from "../../../assets/img/harrison-lake-bench.jpg";
import imgSlide2 from "../../../assets/img/harrison-lake-beach-tree.jpg";
import imgSlide3 from "../../../assets/img/harrison-lake-birds.jpg";
import imgSlide5 from "../../../assets/img/harrison-lake-shuttle.jpg";
import imgSlide6 from "../../../assets/img/harrison-milky-way.jpg";
import imgSlide4 from "../../../assets/img/harrison-mountains.jpg";
// import imgSlide4 from '../../../assets/slide-4.jpg';
// import imgSlide5 from '../../../assets/slide-5.jpg';

import Spinner from "../Spinner/Spinner";
import Aux from "../../../hoc/Auxillary/Auxillary";

const items = [
  // {
  //   src: imgWelcomeSign,
  //   className: classes.SlideWelcomeSign,
  //   altText: "Harrison Scenery",
  //   caption: "<span>Welcome to</span><br /> <span>Harrison Hot Springs</span>",
  // },
  {
    src: imgSlide1,
    className: classes.Slide1,
    altText: "Harrison Welcome Sign",
    caption: "<span>Welcome to</span><br /> <span>Harrison Hot Springs</span>",
  },
  {
    src: imgSlide2,
    className: classes.Slide2,
    altText: "Slide 3",
    caption: "<span>A True Slice</span><br /><span>of Paradise</span>",
  },
  {
    src: imgSlide3,
    className: classes.Slide3,
    altText: "Slide 3",
    caption: "<span>With So Much</span><br /><span>To See and Do</span>",
  },
  {
    src: imgSlide4,
    className: classes.Slide4,
    altText: "Slide 3",
    caption: "<span>You'll Lose Your Blues With</span><br /><span>Mountain Views</span>",
  },
  {
    src: imgSlide5,
    className: classes.Slide5,
    altText: "Slide 3",
    caption: "<span>And We Can Help</span><br /><span>Get You There</span>",
  },
];

interface SliderState {
  addAnimationClassToActiveSlide: boolean;
  activeIndex: number;
}
class Slider extends React.Component<any, SliderState> {
  private animating: boolean = true;
  // fill a new array with 7 empty ref objects
  private activeTimeoutRef: number | null = null;

  public state = {
    addAnimationClassToActiveSlide: false,
    activeIndex: 0,
  };

  constructor(props: any) {
    super(props);
    // this.next = this.next.bind(this);
    // this.previous = this.previous.bind(this);
    // this.goToIndex = this.goToIndex.bind(this);
    // this.onExiting = this.onExiting.bind(this);
    // this.onExited = this.onExited.bind(this);
    this.setAnimationClassIn = this.setAnimationClassIn.bind(this);
  }

  componentDidMount() {
    this.setAnimationClassIn(true, 2250);
  }

  setAnimationClassIn(animationEnterClass: boolean, milliseconds: number): number {
    return window.setTimeout(() => {
      this.setState({
        addAnimationClassToActiveSlide: animationEnterClass,
      });
    }, milliseconds);
  }

  // onExiting() {
  //   this.animating = true;
  //   console.log("exiting");
  //   this.activeTimeoutRef = this.setAnimationClassIn(false, 0);
  // }

  // onExited() {
  //   this.animating = false;
  //   console.log("exited");
  //   this.activeTimeoutRef = this.setAnimationClassIn(true, 1500);
  // }

  // next() {
  //   console.log("next");
  //   if (this.animating) return;
  //   const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
  //   this.setState({ activeIndex: nextIndex });
  // }

  // previous() {
  //   console.log("previous");
  //   if (this.animating) return;
  //   const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
  //   this.setState({ activeIndex: nextIndex });
  // }

  // goToIndex(newIndex: number) {
  //   console.log("goto index");
  //   if (this.animating) return;
  //   this.setState({ activeIndex: newIndex });
  // }

  render() {
    const { activeIndex } = this.state;
    const animationClass: string = this.state.addAnimationClassToActiveSlide ? "animated fadeIn" : "";

    const slides = items.map((item, itemIndex) => {
      return (
        <div className={classes.CarouselItem} key={item.src}>
          <div className={classes.ImgWrap}>
            <div
              style={{
                opacity: 0,
              }}
              className={[`slide-${activeIndex}`, animationClass, classes.CarouselCaption, item.className].join(" ")}
              dangerouslySetInnerHTML={{ __html: item.caption }}
            />
            <img style={{ height: "100%", width: "100%" }} src={item.src} alt={item.altText} />
          </div>
        </div>
      );
    });

    var settings: any = {
      dots: false,
      autoplay: true,
      infinite: true,
      autoplaySpeed: 6000,
      pauseOnHover: true,
      pauseOnFocus: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <SlickSlider className={classes.Slider} {...settings}>
        {slides}
      </SlickSlider>
    );
  }
}

export default Slider;
