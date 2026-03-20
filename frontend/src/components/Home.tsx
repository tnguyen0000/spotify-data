import { useEffect } from 'react';
import { apiCallBody } from '../api/apiHelpers';
import { useNavigate } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
      const access = localStorage.getItem('access_token');
      const refresh = localStorage.getItem('refresh_token');
      if (access && refresh) {
        navigate('/dashboard')
      } else {
        
      };
    }, []);

  return (
    <div id='home'>
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