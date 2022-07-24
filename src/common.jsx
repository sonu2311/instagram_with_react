import Example1 from './example1';
import Login from './login';
import Signup from './singup';
import Home from './home';
import {Routes, Route, HashRouter} from "react-router-dom"
import React from 'react';
import ProfilePage from './profile_page';
import { Header } from './header';
import { EditProfile } from './edit_profile';

function MainFunc() {
  return (
    <HashRouter>
      <Routes>
        <Route >
          <Route path="/"element={<Home/>} />
          <Route path="/example1" element={<Example1 />} />
          <Route path="/header" element={<Header/>} />
          <Route path="/edit_profile" element={<EditProfile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup_url" element={<Signup/>} />
          <Route path="/home_url" element={<Home/>} />
          <Route path="/profile/:id" element={<ProfilePage/>} />
          <Route path="*" element={<h1>Invalid</h1>} />
        </Route>
      </Routes>
    </HashRouter>);
}

export default MainFunc;
