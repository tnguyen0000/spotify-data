import { useEffect, useState } from "react";
import { getRefresh, getToken } from "../api/auth";
import { getUserData } from "../api/userUtils";
import './styles/dashboard.css';

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [user, setUser]: any = useState({});
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let state = urlParams.get('state');
    if (code && state) {
      getToken(setToken, code, state);
    } else {
      console.log(localStorage)
      const access = localStorage.getItem('access_token');
      const expiry = localStorage.getItem('access_token_expire');
      const refresh = localStorage.getItem('refresh_token');
      if (access && expiry && parseInt(expiry) >= (new Date).getTime()) {
        setToken(access);
      } else if ((expiry && parseInt(expiry) < (new Date).getTime())) {
        if (refresh) {
          getRefresh(setToken, refresh);
        }
      } else {
        console.log('Something went wrong, no refresh or expiry token.');
      }
    };
  }, []);

  useEffect(() => {
    const userObj = localStorage.getItem('userData');
    if (!userObj) {
      getUserData(setUser, token);
    } else {
      const userParse = JSON.parse(userObj);
      if (userParse.error) {
        getUserData(setUser, token);
      } else { 
        setUser(userParse);
      }
    }
    
  }, []);

  return (
    <div id="dashboard">
      <div id="dashboard-top">
        <a className="profile-pic-link" href={user.uri ? user.uri : "#"}>
          <img className="profile-pic"
            src={user.images ? user.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} alt="Profile Pic" 
          />
        </a>
        <h1 id="username">
          {user.display_name ? user.display_name : "Error retrieving name"}
        </h1>
      </div>
      <div id="dashboard-bottom">
        <div id="song-artist-nav">
          <a className="dashboard-nav-button" href="/topstats?type=songs">
            <span>
              <h1>
                TOP SONGS
              </h1>
              <img src="https://cdn.pixabay.com/photo/2017/01/09/20/11/music-1967480_1280.png" alt="" />
            </span>
          </a>
          <a className="dashboard-nav-button" href="/topstats?type=artists">
            <span>
              <h1>
                TOP ARTISTS
              </h1>
              <img src="https://cdn-icons-png.freepik.com/512/199/199478.png" alt="" />
            </span>
          </a>
        </div>
        <div id="playlist-nav">
          <a className="dashboard-nav-button" href="/playliststats">
            <span>
              <h1>
                PLAYLIST DATA
              </h1>
              <img src="https://cdn-icons-png.freepik.com/256/6823/6823229.png?semt=ais_hybrid" alt="" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;