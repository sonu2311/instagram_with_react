import './library.css';
import React from 'react';
import './main.css';
import {SessionContext} from './library';


export function Header() {
  const {session, setSession} = React.useContext(SessionContext)
  const name = session.login_key.name || "ABC"
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
      <div>
        <a >
          <div className="link_box" >Name={name}</div>
        </a>
      </div>
    </div>
  );
}
