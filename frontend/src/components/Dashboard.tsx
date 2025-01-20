import { useEffect, useState } from "react";
import { apiCallBody } from "../api/apiHelpers";

const Dashboard = () => {
  const [token, setToken] = useState('');
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
        if (tokens.ok) {
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
        console.log(access)
      } else {
        // TODO!: add refreshing access token route / functionality
        // let refresh = localStorage.getItem('refresh_token');
      }
    };
  }, []);
  return (
    <div>
      Dashboard
    </div>
  );
};

export default Dashboard;