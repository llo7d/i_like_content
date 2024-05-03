import React from 'react';
import './toggle.css';

const Toggle = ({ value, handleToggle }) => {
  return (
    <div>
      <input
        type="checkbox"
        id="switch"
        className="switch-input"
        checked={!!value}
        onChange={(e) => handleToggle && handleToggle(e)}
      />
      <label htmlFor="switch" className="switch">
        <span className="switch-text"> {value ? 'On' : 'Off'} </span>
      </label>
    </div>
  );
};

export default Toggle;
