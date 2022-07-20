import './library.css';
import React from 'react';
import './main.css';

export function Header() {
  return (
    <div className="hsplit" >
      <div>
        <a href="#/example1">
          <div className="link_box" >Example1</div>
        </a>
      </div>
      <div>
        <a href="#/login">
          <div className="link_box" >Login</div>
        </a>
      </div>
      <div>
        <a href="#/signup_url">
          <div className="link_box" >Signup</div>
        </a>
      </div>
      <div>
        <a href="#/home_url">
          <div className="link_box" >Home</div>
        </a>
      </div>
    </div>
  );
}
