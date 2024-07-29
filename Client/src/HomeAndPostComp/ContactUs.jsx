import React from 'react';
import { Avatar, Typography } from "@mui/material";

const TeamMemberCard = ({ name, imageUrl, email, openLink, nameFontSize, photoSize }) => {
  const cardStyle = {
    border: '2px solid #ccc',
    width: '200px',
    padding: '10px',
    // margin: '7px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
  };

  const imgStyle = {
    width: photoSize || 140,
    height: photoSize || 140,
  };

  const nameStyle = {
    fontSize: nameFontSize || '1.5rem',
  };

  return (
    <div className="card" style={cardStyle} onClick={openLink}>
      <div className="card-img">
        <Avatar alt={name} src={imageUrl} sx={imgStyle} />
      </div>
      <div className="card-info" style={{ marginTop: '10px' }}>
        <Typography variant="h4" className="card-name" style={nameStyle}>{name}</Typography>
        <Typography variant="body1" className="card-email">{email}</Typography>
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers = [

    { name: 'Ridam chapiya', imageUrl: 'https://res.cloudinary.com/dkpznoy8d/image/upload/v1718826048/sndymypsbhyxxalzxyzk.jpg', email: '202101113@daiict.ac.in', openLink: () => window.open('https://www.youtube.com/watch?v=IUSyV2BVh4A', '_blank') },
    { name: 'Deven Patel', imageUrl: 'https://res.cloudinary.com/dkpznoy8d/image/upload/v1719311530/uiqsa1y0tiyytptcoydq.png', email: '202101264@daiict.ac.in', openLink: () => window.open('https://www.youtube.com/watch?v=IUSyV2BVh4A', '_blank') },


    // Add other team members
  ];

  return (
    <section className="team" style={{ padding: '30px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Meet Our Team</h1>
      <div className="team-cards" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} {...member} />
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  const email = 'campusthreads676@gmail.com';
  const phoneNumber = '+919587828713';

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    transition: 'border-bottom 0.3s ease',
    margin: '0 10px',
  };

  return (
    <footer style={{ background: '#333', color: '#fff', padding: '20px', textAlign: 'center' }}>
      <p>Contact us:</p>
      <p>Email: <a href={`mailto:${email}`} style={linkStyle}>{email}</a></p>
      <p>Phone: <a href={`tel:${phoneNumber}`} style={linkStyle}>{phoneNumber}</a></p>
      <p>Provide Feedback: <a href="mailto:campusthreads676@gmail.com?subject=Feedback" style={linkStyle}>Send Feedback</a></p>
    </footer>
  );
};


const AboutUsPage = () => {
  return (
    <div>
      {/* Include your header component here */}
      {/* ... */}
      {/* About Us Section */}
      <section className="about" style={{ background: 'linear-gradient(360deg, rgb(245, 255, 245) 0%, rgb(54, 181, 227) 100%)', padding: '100px 0 20px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>About Us</h1>
        <p style={{ fontSize: '1rem', color: '#323030', maxWidth: '800px', margin: '0 auto' }}>Feel free to reach out to any of the team members</p>
        {/* Add the rest of the about section JSX */}
      </section>

      {/* Team Section */}
      <Team />

      {/* Include your footer component here */}
      {/* ... */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;