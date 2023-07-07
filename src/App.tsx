import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useState } from "react";
import Video from "./pages/Video";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Create from "./pages/Create";
import Search from "./pages/Search";
import Subscriptions from "./pages/Subscriptions";
import MyVideos from "./pages/MyVideos";
import LikedVideos from "./pages/LikedVideos";
import ChannelProfile from "./pages/ChannelProfile";

function App() {
  const [sideMenu, setSideMenu] = useState(false);
  return (
    <>
      <Router>
        <Header sideMenu={sideMenu} setSideMenu={setSideMenu} />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} index={true} />
          <Route path="/videos/:videoid" element={<Video />} />
          <Route path="/search/:q" element={<Search />} />
          <Route path="" element={<PrivateRoute />}>
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/myvideos" element={<MyVideos />} />
            <Route path="/likedvideos" element={<LikedVideos />} />
          </Route>
          <Route path="/users/:userId" element={<ChannelProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
