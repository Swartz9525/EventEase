// File: src/pages/About.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Accordion } from "react-bootstrap";
import CountUp from "react-countup";
import teamData from "../data/team.json"; // Make sure this file exists

const testimonials = [
  {
    quote:
      "EventEase made planning our corporate gala a breeze and picture‑perfect!",
    author: "— Priya, Bengaluru",
  },
  {
    quote: "Fantastic service, top‑notch vendors, zero stress!",
    author: "— Rohit, Mumbai",
  },
  {
    quote: "Our birthday bash turned into a big success thanks to EventEase.",
    author: "— Anjali, Delhi",
  },
];

const About = () => {
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setEventCount(5000), 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container className="py-5 fade-in">
      <section className="text-center mb-5">
        <h1 className="fw-bold text-primary">About EventEase</h1>
        <p className="text-muted fs-5">
          We’re your trusted partner in crafting flawless events—from weddings
          to corporate galas.
        </p>
      </section>

      {/* Core Values */}
      <Row className="g-4 mb-5">
        {["Planning", "Personalization", "Innovation"].map((title, i) => (
          <Col md={4} key={i} className={`fade-delay-${i}`}>
            <Card className="text-center p-4 shadow-sm border-0 rounded-4">
              <div className="fs-1 mb-3">
                {["\uD83D\uDCC5", "\uD83C\uDFAF", "\uD83C\uDF1F"][i]}
              </div>
              <h4>{title}</h4>
              <p className="text-muted">
                {
                  [
                    "Streamlined booking of venues, vendors, and timelines.",
                    "Tailored experiences to match your style and budget.",
                    "Tech-first approach with easy management tools.",
                  ][i]
                }
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Counters */}
      <Card className="bg-light text-center p-4 mb-5 border-0 rounded-4 shadow-sm fade-in">
        <Row className="mt-4">
          {["Events Booked", "Vendors", "Cities"].map((label, i) => (
            <Col md={4} key={i}>
              <h2>
                <CountUp
                  end={i === 0 ? eventCount : i === 1 ? 1200 : 40}
                  duration={2}
                />
              </h2>
              <p className="text-muted">{label}</p>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Testimonials */}
      <section className="mb-5 text-center fade-in">
        <h3 className="fw-bold mb-4">Testimonials</h3>
        <Row className="g-3">
          {testimonials.map((t, i) => (
            <Col md={4} key={i}>
              <Card className="p-4 shadow-sm border-0 rounded-4 h-100">
                <p className="fst-italic">“{t.quote}”</p>
                <div className="text-primary fw-bold">{t.author}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      <Card className="bg-primary text-white text-center p-5 rounded-4 mb-5 shadow fade-in">
        <h2 className="fw-bold mb-3">Ready to start planning?</h2>
        <p className="fs-5">Let's make your next event unforgettable.</p>
        <Button variant="light" href="/services">
          Explore Services
        </Button>
      </Card>

      {/* Team */}
      <section className="mb-5 text-center fade-in">
        <h3 className="fw-bold mb-4">Meet the Team</h3>
        <Row className="g-4">
          {teamData.map((member, i) => (
            <Col md={3} key={i}>
              <Card className="p-3 border-0 shadow-sm rounded-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="rounded-circle mx-auto mb-2"
                  width={80}
                  height={80}
                />
                <h6 className="fw-bold mb-0">{member.name}</h6>
                <small className="text-muted">{member.role}</small>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* FAQ */}
      <section className="mb-5 fade-in">
        <h3 className="text-center fw-bold mb-4">FAQs</h3>
        <Accordion>
          {["How do I book?", "Can I cancel?", "Do you serve my city?"].map(
            (q, i) => (
              <Accordion.Item eventKey={i.toString()} key={i}>
                <Accordion.Header>{q}</Accordion.Header>
                <Accordion.Body>
                  {
                    [
                      "Select a service, customize with add-ons, and pay securely.",
                      "Yes – up to 48 hours before your event for a full refund.",
                      "We’re live in 40+ cities and growing fast!",
                    ][i]
                  }
                </Accordion.Body>
              </Accordion.Item>
            )
          )}
        </Accordion>
      </section>
    </Container>
  );
};

export default About;
