import { useEffect, useState } from "react";
import { apiCallBody } from "../api/apiHelpers";

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [user, setUser]: any = useState({});
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let state = urlParams.get('state')
    if (code && state) {
      code = `?code=${code}`
      state = `?state=${state}`
      const getToken = async () => {
        let tokens = await apiCallBody('GET', '/callback' + code + '&' + state, undefined);
        // TODO!: Fix tokens.ok
        if (!tokens.error) {
          setToken(tokens.access_token);
          localStorage.setItem('access_token', tokens.access_token);
          let currDateTime = new Date();
          currDateTime.setSeconds(currDateTime.getSeconds() + tokens.expires_in)
          localStorage.setItem('access_token_expire', currDateTime.getTime().toString());
          localStorage.setItem('refresh_token', tokens.refresh_token);
        } else {
            // TODO!: Add proper error handling to frontend webpage
            console.log('Something went wrong', tokens);
        }
      };
      getToken();
    } else {
      console.log(localStorage)
      let access = localStorage.getItem('access_token');
      let expiry = localStorage.getItem('access_token_expire');
      if (access && expiry && parseInt(expiry) >= (new Date).getTime()) {
        setToken(access);
      } else {
        // TODO!: add refreshing access token route / functionality
        // let refresh = localStorage.getItem('refresh_token');
      }
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const access = `?access=${token}`
      let user = await apiCallBody('GET', '/me' + access);
      setUser(user);
    }
    getUser();
  }, [token]);

  return (
    <div>
      Dashboard
      <div>
        {user.display_name}
      </div>
      <div>
        <img src={user.images ? user.images[0].url : ''} alt="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" />
      </div>
    </div>
  );
};

export default Dashboard;