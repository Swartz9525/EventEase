// File: src/components/HeroCarousel.jsx
import React from "react";
import { Carousel, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HeroCarousel.css";

const slides = [
  {
    image: "https://source.unsplash.com/1600x600/?wedding,ceremony",
    title: "Elegant Weddings",
    description: "Crafting unforgettable moments with precision and style.",
  },
  {
    image: "https://source.unsplash.com/1600x600/?corporate,conference",
    title: "Corporate Excellence",
    description: "Professional setups that impress and deliver impact.",
  },
  {
    image: "https://source.unsplash.com/1600x600/?birthday,celebration",
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
