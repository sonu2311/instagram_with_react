import Example1 from './example1';
import Login from './login';
import Signup from './singup';
import Home from './home';


import {Routes, Route, HashRouter} from "react-router-dom"
import React from 'react';

function MainFunc() {
  return (
    <HashRouter>
      <Routes>
        <Route >
          <Route path="/" element={<Example1 />} />
          <Route path="/example1" element={<Example1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup_url" element={<Signup/>} />
          <Route path="/home_url" element={<Home/>} />
          <Route path="*" element={<h1>Invalid</h1>} />
        </Route>
      </Routes>
    </HashRouter>);
}

export default MainFunc;
