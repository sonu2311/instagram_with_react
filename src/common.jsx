import Example1 from './example1';
import Example2 from './example2';
import Example3 from './example3_image_upload';
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
          <Route path="/example2" element={<Example2 />} />
          <Route path="/example3" element={<Example3 />} />
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
