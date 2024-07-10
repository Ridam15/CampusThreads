// HeaderOption.jsx

import React from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';

const HeaderOption = ({ Icon, avatar, title, active }) => {
  return (
    <div className={`headerOption ${active ? 'active' : ''}`}>
      {Icon && <Icon className="headerOption__icon" />}
      {avatar && <Avatar className="headerOption__icon" src={avatar} alt={title} />}
      <NavLink to={`/${title}`} className="headerOption__title" activeClassName="activeLink">
        <h3>{title}</h3>
      </NavLink>
    </div>
  );
};

export default HeaderOption;
