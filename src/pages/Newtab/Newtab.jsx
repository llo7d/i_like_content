import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Quiz yourself before you start browsing.
        </p>
        <h6>
          Change subjects you want to learn about in setting pages.</h6>
      </header>
    </div>
  );
};

export default Newtab;
