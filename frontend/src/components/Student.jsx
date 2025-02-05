import React, { useState, useEffect } from "react";
import "./Student.css";
import Navbar from "./Navbar";
import { useSpring, animated, config } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaCalendar, FaUsers, FaSmile, FaFacebook, FaTwitter, FaInstagram, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import mitLogo from '../assets/MIT_logo.png';
import avatar1 from '../assets/avatar1.avif';
import avatar2 from '../assets/avatar2.avif';
import avatar3 from '../assets/avatar3.avif';
import Loader from "./Loader"; // Import the Loader component
// FaUse
const Student = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
  const fetchData = async () => {
    try {
      
      // Fetch events
      const eventsResponse = await fetch("http://localhost:5000/getEvents", {
        credentials: "include",
      });
      if (!eventsResponse.ok) throw new Error(`Error: ${eventsResponse.statusText}`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
      setFilteredEvents(filterEventsByAudience(eventsData));
      // Fetch student details
      const studentResponse = await fetch("http://localhost:5000/student/studentDetails", {
        credentials: "include",
      });
      if (!studentResponse.ok) throw new Error(`Error: ${studentResponse.statusText}`);
      const studentData = await studentResponse.json();
      setStudentDetails(studentData.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const filterEventsByAudience = (events) => {
    return events.filter((event) => event.target_audience === 'Student' || event.target_audience === 'both');
  };
  const eventsToDisplay = showAll ? events : events.slice(0, 4);
  // Function to filter events based on target audience
  
  
  const handleShowMore = () => {
    setShowAll(true);
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

      <section id="home" className="home">
        <video autoPlay muted loop className="background-video">
          <source src="https://mitwpu.edu.in/uploads/banner/banner_video_desktop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* About Us Section */}
      <section id="about" className="section about" ref={aboutRef}>
  <animated.div style={aboutAnimation}>
    <h2>About Event Hub</h2>
    <p className="section-description">
      Discover and participate in exciting events across various categories. Whether it's tech, career, culture, or sports, 
      we've got something for everyone!
    </p>

    <div className="about-container">
      {/* Left Side - About Info */}
      <div className="about-left">
        <div className="about-card">
          <h3>🎯 Our Mission</h3>
          <p>Connecting students with events that inspire, educate, and entertain.</p>
        </div>
        <div className="about-card">
          <h3>🚀 Our Vision</h3>
          <p>Building a dynamic student community that fosters learning, networking, and growth.</p>
        </div>
      </div>

      {/* Right Side - Event Categories */}
      <div className="about-right">
        <div className="category-card">
          <h3>💻 Tech & Innovation</h3>
          <p>Hackathons, coding workshops, and tech talks.</p>
        </div>
        <div className="category-card">
          <h3>🎭 Cultural & Arts</h3>
          <p>Music festivals, art exhibitions, and cultural fests.</p>
        </div>
        <div className="category-card">
          <h3>🏆 Sports & Fitness</h3>
          <p>Sports tournaments, fitness challenges, and yoga sessions.</p>
        </div>
      </div>
    </div>
  </animated.div>
</section>



      {/* Events Section */}
      <section id="events" className="section events">
      <h2 className="events-title">Upcoming Events</h2>
      <p className="section-description">
        Explore a wide range of events tailored for students. From tech workshops to cultural fests, there's
        something for everyone!
      </p>

      {loading ? ( 
        <Loader /> 
      ) : error ? ( 
        <p className="error-message">Error: {error}</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.slice(0, showAll ? filteredEvents.length : 3).map((event) => (
            <div key={event.id} className="event-card">
              {event.event_image && (
                <img
                  src={`http://localhost:5000${event.event_image}`}
                  alt={event.event_name}
                  className="event-image"
                />
              )}
              <div className="event-info">
                <h3 className="event-name">{event.event_name}</h3>
                <p className="event-date">
                  📅 <strong>Date:</strong> {event.event_date}
                </p>
                <p className="event-description">
                  <strong>Description:</strong>{" "}
                  {event.event_description.length > 150
                    ? `${event.event_description.slice(0, 100)}...`
                    : event.event_description}
                </p>
                <button className="register-btn" onClick={() => handleRegister(event.id)}>Register</button>
              </div>
            </div>
          ))}
          <div className="showmoreSection">
            {!showAll && filteredEvents.length > 3 && (
              <button className="show-more-btn" onClick={handleShowMore}>
                <FaArrowRight /> {/* Arrow icon */}
              </button>
            )}
          </div>
        </div>
      )}
    </section>

      {/* Registered Events Section */}
    
     {/* Testimonials Section */}

      

      {/* New Section: Event Categories */}
   
     {/* New Section: Featured Speakers */}
{/* New Section: Featured Speakers */}
<section id="speakers" className="section speakers">
  <h2>Featured Speakers</h2>
  <p className="section-description">
    Meet the inspiring speakers who will be sharing their knowledge and experiences at our events.
  </p>
  <div className="speaker-grid">
    <div className="speaker-card">
      <img src={avatar1} alt="Speaker 1" className="speaker-image" />
      <div className="inner-speaker-card">
      <h3>John Doe</h3>
      <p>Tech Entrepreneur</p>
      </div>
    </div>
    <div className="speaker-card">
      <img src={avatar2} alt="Speaker 2" className="speaker-image" />
      <div className="inner-speaker-card">
      <h3>Jane Smith</h3>
      <p>Career Coach</p>
      </div>
    </div>
    <div className="speaker-card">
      <img src={avatar3} alt="Speaker 3" className="speaker-image" />
      <div className="inner-speaker-card">
      <h3>Alex Johnson</h3>
      <p>Artist & Innovator</p>
      </div>
    </div>
  </div>
</section>


<section id= "contact" className="footer">
  <div className="footer-container">
    <div className="footer-info">
      <p>&copy; 2025 MIT World Peace University</p>
      <p>All rights reserved</p>
    </div>
    <div className="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Contact Us</a>
    </div>
    <div className="footer-social">
      <a href="https://facebook.com" target="_blank">Facebook</a>
      <a href="https://twitter.com" target="_blank">Twitter</a>
      <a href="https://linkedin.com" target="_blank">LinkedIn</a>
    </div>
  </div>
</section>

    </div>
  );
};

export default Student;