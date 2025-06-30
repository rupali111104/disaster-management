import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const LandingPage = () => {
  return (
    <div className="landing-bg">
      <header style={{width: '100%', background: 'none', boxShadow: 'none', padding: '32px 0 32px 0', position: 'relative', zIndex: 10, textAlign: 'center'}}>
        <h1 className="landing-title" style={{margin: 0, fontSize: '2.4rem', color: '#111', fontWeight: 900, letterSpacing: '1.5px', background: 'none', boxShadow: 'none'}}>Disaster Management Platform</h1>
      </header>
      <div className="landing-spread-content">
        <div className="landing-spread-row" style={{flexDirection: 'row-reverse', gap: 64}}>
          <img src="/img2.jpg" alt="Disaster management" className="landing-spread-img" />
          <div style={{flex: 1, minWidth: 220, maxWidth: 520, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'none', boxShadow: 'none', padding: '0 8px'}}>
            <div className="landing-section-title" style={{color: '#111', fontWeight: 700, fontSize: '1.3rem', background: 'none', boxShadow: 'none', padding: 0}}>Real time disaster updates now</div>
            <div className="landing-section-content" style={{color: '#111', fontSize: '1.1rem', marginBottom: 18, background: 'none', boxShadow: 'none', padding: 0}}>
              Stay ahead of disasters :  join our live chat for immediate assistance and updates. Act now, Stay safe!
            </div>
            <Link to="/login" className="landing-btn primary" style={{alignSelf: 'flex-end', marginRight: '1in', marginBottom: 32}}>Join Chat</Link>
          </div>
        </div>
        <div className="landing-spread-row">
          <div className="landing-spread-section">
            <div className="landing-section-title">Empowering Communities in Crisis personal use</div>
            <div className="landing-section-content">
              At personal use, located in the vibrant city of Vijayawada, India, we are dedicated to providing vital disaster management services through innovative technology. Our platform offers a unique chat room feature that connects individuals, families, and communities during emergencies, ensuring timely communication and support. By fostering a reliable network of information and resources, personal use aims to empower people to better prepare for and respond to disasters, ultimately enhancing community resilience and safety.
            </div>
          </div>
          <img src="/img4.jpg" alt="Empowering Communities" className="landing-spread-img" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
