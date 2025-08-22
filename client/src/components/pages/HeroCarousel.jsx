// File: src/components/HeroCarousel.jsx
import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HeroCarousel.css";
import fashionShow from "../../assets/fashion_show.jpeg";
import corporate from "../../assets/splash1.jpg";
import workshop from "../../assets/workshop.jpeg";

const slides = [
  {
    image: fashionShow,
    title: "Fashion Show Extravaganza",
    description: "Experience the glamour and excitement of our fashion shows.",
  },
  {
    image: corporate,
    title: "Corporate Excellence",
    description: "Professional setups that impress and deliver impact.",
  },
  {
    image: workshop,
    title: "Creative Workshops",
    description: "Hands-on experiences that inspire and engage.",
  },
];

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel fade indicators={false} controls={true}>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 carousel-img"
              src={slide.image}
              alt={slide.title}
            />
            <Carousel.Caption className="custom-caption">
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-description">{slide.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
