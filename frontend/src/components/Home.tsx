import { apiCallBody } from "../api/apiHelpers";

import './styles/home.css';

const Home = () => {
  return (
    <div id="home">
      <h1>
        Home
      </h1>
      <p>
        This is my app which allows you to check interesting stats about your Spotify account.
      </p>
      <button
        onClick={(e) => {
          e.preventDefault();
          const executeAuth = async () => {
            try {
              const redirect_url = await apiCallBody('GET', '/get_auth', undefined);
              window.location.href = redirect_url
            } catch (error) {
              console.log('Error:', error);
            }            
          }
          executeAuth();
      }}>
          Sign in with Spotify
      </button>
    </div>
  );
};

export default Home;