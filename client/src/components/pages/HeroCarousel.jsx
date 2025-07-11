// File: src/components/HeroCarousel.jsx
import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HeroCarousel.css";
import wedding from "../../assets/elegantWedding.jpg";
import corporate from "../../assets/splash1.jpg";
import birthday from "../../assets/splash2.jpg";

const slides = [
  {
    image: wedding,
    title: "Elegant Weddings",
    description: "Crafting unforgettable moments with precision and style.",
  },
  {
    image: corporate,
    title: "Corporate Excellence",
    description: "Professional setups that impress and deliver impact.",
  },
  {
    image: birthday,
    title: "Vibrant Birthdays",
    description: "From themes to thrills, we bring the party to life.",
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
