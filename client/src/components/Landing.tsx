import { useState, useEffect } from 'react';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/App.css';
import { Link } from 'react-router-dom';

const App = () => {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: "img/sits1.jpg",
      caption: "Our modern campus facilities"
    },
    {
      img: "img/collage3.PNG",
      caption: "Vibrant campus life with various activities"
    },
    {
      img: "img/collage1.PNG",
      caption: "State-of-the-art research laboratories"
    },
    {
      img: "img/collage2.jpg",
      caption: "Industry interactions and placement activities"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="app-container">
      {/* Social Icons */}
      <div className="social-bar">
        <a href="https://www.facebook.com/sitsinstitutions?rdid=1KGt8vHi2ELuqCm8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1F7ibBTzJG%2F#" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="social-icon facebook">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="https://www.instagram.com/siddharthainstitutions/?igsh=aXEwcDRrMXp3MXJ0#" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="social-icon instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://www.youtube.com/@socialmediasiddhartha" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="social-icon youtube">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      </div>

      {/* Top Notice */}
      <div className="top-notice">
        {/* 2025 batch college code : <b>SISG</b> (EAMCET & ECET CODE) */}
      </div>

      {/* Header Logo Bar */}
      <div className="header-logo-bar">
        <div className="left-side">
          <img src="img/sitslogo.jpg" alt="Siddhartha Logo" className="siddhartha-logo"/>
          <div className="college-text">
            <h1>SIDDHARTHA</h1>
            <p>INSTITUTE OF TECHNOLOGY AND SCIENCE</p>
            <small>UGC - AUTONOMOUS</small><br/>
            <small>Affiliated to JNTUH, Approved by AICTE, Accredited by NBA & NAAC with A+ Grade, NIRF Ranked & An ISO Certified Institution</small>
          </div>
        </div>
        <div className="right-side">
          <img src="img/nbalogo.jpg" alt="NBA Logo" className="small-logo"/>
          <img src="img/nirflogo.jpg" alt="NIRF Logo" className="small-logo"/>
          <img src="img/aictelogo.jpg" alt="AICTE Logo" className="small-logo"/>
          <img src="img/ugc logo.jpg" alt="UGC Logo" className="small-logo"/>
          <img src="img/naaclogo.jpg" alt="NAAC A+ Logo" className="small-logo"/>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-navbar">
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Register / Signup</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="content">
          <h1>Siddhartha Institute of Technology and Sciences</h1>
          <p>"Shaping tomorrow's leaders with technology-driven assessments"</p>
        </div>
      </div>

      {/* About Section + Slider */}
      <div className="about-container">
        <div className="about-section">
          <h2>About Us</h2>
          <p>Siddhartha Institute of Technology and Science (SITS) is the first self-financing Engineering College established in Ghatkesar, Hyderabad in 2008 by the academic visionary Sri C.R.Jagadish.</p>
          <p>Our mission is to shape tomorrow's leaders through quality education and cutting-edge technology. We believe in creating an environment that fosters innovation, critical thinking, and practical skills development.</p>
          <p>With state-of-the-art facilities and dedicated faculty members, SITS has established itself as a premier institution for technical education with various accreditations including NBA, NAAC A+ Grade, and NIRF ranking.</p>
        </div>
        <div className="slider-container">
          <div className="slider">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img src={slide.img} alt={slide.caption} className="slider-img"/>
                <div className="caption">{slide.caption}</div>
              </div>
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>&#10094;</button>
          <button className="next" onClick={nextSlide}>&#10095;</button>
          <div className="dots">
            {slides.map((_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;