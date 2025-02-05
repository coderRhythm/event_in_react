import React, { useState, useEffect } from "react";
import "./Student.css";
import Navbar from "./Navbar";
import { useSpring, animated, config } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaCalendar, FaUsers, FaSmile, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Student = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const res = await fetch("http://localhost:5000/getEvents", {
          method: "GET",
          credentials: "include",
        });
        const eventsData = await res.json();
        setEvents(eventsData);

        // Fetch student details
        const response = await fetch("http://localhost:5000/student/studentDetails", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch student details");
        const data = await response.json();
        setStudentDetails(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = (eventId) => {
    const eventToRegister = events.find((event) => event.id === eventId);
    if (!registeredEvents.some((event) => event.id === eventId)) {
      setRegisteredEvents([...registeredEvents, eventToRegister]);
    }
  };

  // Scrollable Animations
  const [homeRef, homeInView] = useInView({ triggerOnce: true });
  const homeAnimation = useSpring({
    opacity: homeInView ? 1 : 0,
    transform: homeInView ? "translateY(0)" : "translateY(50px)",
    config: config.wobbly,
  });

  const [aboutRef, aboutInView] = useInView({ triggerOnce: true });
  const aboutAnimation = useSpring({
    opacity: aboutInView ? 1 : 0,
    transform: aboutInView ? "translateY(0)" : "translateY(50px)",
    config: config.gentle,
  });

  const [eventsRef, eventsInView] = useInView({ triggerOnce: true });
  const eventsAnimation = useSpring({
    opacity: eventsInView ? 1 : 0,
    transform: eventsInView ? "translateY(0)" : "translateY(50px)",
    config: config.slow,
  });

  const [registeredRef, registeredInView] = useInView({ triggerOnce: true });
  const registeredAnimation = useSpring({
    opacity: registeredInView ? 1 : 0,
    transform: registeredInView ? "translateY(0)" : "translateY(50px)",
    config: config.molasses,
  });

  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });
  const testimonialsAnimation = useSpring({
    opacity: testimonialsInView ? 1 : 0,
    transform: testimonialsInView ? "translateY(0)" : "translateY(50px)",
    config: config.stiff,
  });

  const [contactRef, contactInView] = useInView({ triggerOnce: true });
  const contactAnimation = useSpring({
    opacity: contactInView ? 1 : 0,
    transform: contactInView ? "translateY(0)" : "translateY(50px)",
    config: config.default,
  });

  // Carousel Settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="student-page">
      <Navbar />

      {/* Home Section */}
      <section id="home" className="section home" ref={homeRef}>
        <animated.div className="overlay" style={homeAnimation}>
          <div className="content">
            <h1>
              Welcome <span className="highlight">{studentDetails?.name}</span> to{" "}
              <span className="brand">Event Hub</span>
            </h1>
            <p className="tagline">Discover, Register, and Participate in Exciting Events!</p>
            <p className="description">
              Stay ahead with the latest events, workshops, and networking opportunities tailored just for you. Join the
              best minds and make every event count! Register for events and clubs that match your interests, and enjoy
              being an active part of the community.
            </p>

            {/* Event Highlights Carousel */}
            

            {/* Why Register? Section */}
          {/* Why Register? Section */}
<div className="why-register">
  <h2>Why Register for Events?</h2>
  <div className="reasons">
    <div className="reason">
      <span className="icon">
        <FaSmile size={28} /> {/* Larger size for emphasis */}
      </span>
      <h3>Learn & Grow</h3>
      <p>Gain new skills and knowledge from workshops and seminars.</p>
    </div>
    <div className="reason">
      <span className="icon">
        <FaUsers size={24} /> {/* Medium size */}
      </span>
      <h3>Network</h3>
      <p>Connect with peers, mentors, and industry professionals.</p>
    </div>
    <div className="reason">
      <span className="icon">
        <FaCalendar size={20} /> {/* Smaller size */}
      </span>
      <h3>Have Fun</h3>
      <p>Participate in cultural fests, sports, and entertainment events.</p>
    </div>
  </div>
</div>
            {/* Call-to-Action Buttons */}
            <div className="cta-container">
              <a href="#events" className="cta-button primary">
                Explore Events <FaArrowRight />
              </a>
              <a href="#about" className="cta-button secondary">
                Learn More <FaArrowRight />
              </a>
            </div>
          </div>
        </animated.div>
      </section>

  


      {/* About Us Section */}
      <section id="about" className="section about" ref={aboutRef}>
        <animated.div style={aboutAnimation}>
          <h2>About Us</h2>
          <p>
            Event Hub is a platform that helps students find and participate in amazing events, workshops, and networking
            opportunities. Whether you're looking for tech summits, career fairs, or entertainment fests, we have you
            covered!
          </p>
          <div className="about-grid">
            <div className="card">
              <h3>🎯 Our Mission</h3>
              <p>To connect students with events that inspire, educate, and entertain.</p>
            </div>
            <div className="card">
              <h3>🌟 Why Choose Us?</h3>
              <p>Easy registration, event recommendations, and seamless experience.</p>
            </div>
            <div className="card">
              <h3>🚀 Our Vision</h3>
              <p>To create a global community of students who learn, grow, and succeed together.</p>
            </div>
          </div>
        </animated.div>
      </section>

      {/* Events Section */}
      <section id="events" className="section events" ref={eventsRef}>
        <animated.div style={eventsAnimation}>
          <h2>Upcoming Events</h2>
          <p className="section-description">
            Explore a wide range of events tailored for students. From tech workshops to cultural fests, there's
            something for everyone!
          </p>
          <div className="event-grid">
            {Array.isArray(events) ? (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  {event.event_image && (
                    <img
                      src={`http://localhost:5000${event.event_image}`}
                      alt={event.event_name}
                      className="event-image"
                    />
                  )}
                  <h3>{event.event_name}</h3>
                  <p>
                    <strong>Date:</strong> {event.event_date}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.event_description}
                  </p>
                  <button onClick={() => handleRegister(event.id)}>Register</button>
                </div>
              ))
            ) : (
              <div className="event-card">
                {events.event_image && (
                  <img
                    src={`http://localhost:5000${events.event_image}`}
                    alt={events.event_name}
                    className="event-image"
                  />
                )}
                <h3>{events.event_name}</h3>
                <p>
                  <strong>Date:</strong> {events.event_date}
                </p>
                <p>
                  <strong>Description:</strong> {events.event_description}
                </p>
                <button onClick={() => handleRegister(events.id)}>Register</button>
              </div>
            )}
          </div>
        </animated.div>
      </section>

      {/* Registered Events Section */}
      <section id="registered" className="section registered" ref={registeredRef}>
        <animated.div style={registeredAnimation}>
          <h2>Your Registered Events</h2>
          <p className="section-description">
            Here are the events you've registered for. Don't forget to mark your calendar!
          </p>
          <div className="event-grid">
            {registeredEvents.length === 0 ? (
              <p className="no-events">You haven't registered for any events yet.</p>
            ) : (
              registeredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.event_name}</h3>
                  <p>
                    <strong>Date:</strong> {event.event_date}
                  </p>
                  <p>
                    <strong>Description:</strong> {event.event_description}
                  </p>
                </div>
              ))
            )}
          </div>
        </animated.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials" ref={testimonialsRef}>
        <animated.div style={testimonialsAnimation}>
          <h2>What Our Students Say</h2>
          <p className="section-description">
            Hear from students who have benefited from Event Hub and made the most of their college experience.
          </p>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>"Event Hub helped me discover amazing events that boosted my career!"</p>
              <p className="author">- John Doe</p>
            </div>
            <div className="testimonial-card">
              <p>"The platform is user-friendly and the events are top-notch!"</p>
              <p className="author">- Jane Smith</p>
            </div>
            <div className="testimonial-card">
              <p>"I made so many connections at the events I attended. Highly recommend!"</p>
              <p className="author">- Alex Johnson</p>
            </div>
          </div>
        </animated.div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="section contact" ref={contactRef}>
        <animated.div style={contactAnimation}>
          <h2>Contact Us</h2>
          <p className="section-description">
            Have questions or need assistance? Reach out to us! We're here to help you make the most of Event Hub.
          </p>
          <div className="contact-details">
            <p>📧 Email: support@eventhub.com</p>
            <p>📞 Phone: +1 234 567 890</p>
            <p>📍 Location: 123 Event Street, New York, USA</p>
          </div>
          <div className="social-links">
            <a href="https://facebook.com/eventhub" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://twitter.com/eventhub" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://instagram.com/eventhub" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </animated.div>
      </section>

      {/* New Section: Event Categories */}
      <section id="categories" className="section categories">
        <h2>Event Categories</h2>
        <p className="section-description">
          Explore events by category and find the ones that interest you the most!
        </p>
        <div className="category-grid">
          <div className="category-card">
            <h3>Tech & Innovation</h3>
            <p>Hackathons, coding workshops, and tech talks.</p>
          </div>
          <div className="category-card">
            <h3>Career & Networking</h3>
            <p>Career fairs, networking events, and alumni meetups.</p>
          </div>
          <div className="category-card">
            <h3>Cultural & Arts</h3>
            <p>Music festivals, art exhibitions, and cultural fests.</p>
          </div>
          <div className="category-card">
            <h3>Sports & Fitness</h3>
            <p>Sports tournaments, fitness challenges, and yoga sessions.</p>
          </div>
        </div>
      </section>

      {/* New Section: Featured Speakers */}
      <section id="speakers" className="section speakers">
        <h2>Featured Speakers</h2>
        <p className="section-description">
          Meet the inspiring speakers who will be sharing their knowledge and experiences at our events.
        </p>
        <div className="speaker-grid">
          <div className="speaker-card">
            <img src="https://via.placeholder.com/150" alt="Speaker 1" className="speaker-image" />
            <h3>John Doe</h3>
            <p>Tech Entrepreneur</p>
          </div>
          <div className="speaker-card">
            <img src="https://via.placeholder.com/150" alt="Speaker 2" className="speaker-image" />
            <h3>Jane Smith</h3>
            <p>Career Coach</p>
          </div>
          <div className="speaker-card">
            <img src="https://via.placeholder.com/150" alt="Speaker 3" className="speaker-image" />
            <h3>Alex Johnson</h3>
            <p>Artist & Innovator</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Student;