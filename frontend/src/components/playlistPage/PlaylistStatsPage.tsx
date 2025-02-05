import { useEffect, useState } from 'react';
import '../styles/playliststatspage.css';
import '../styles/userstatspage.css';
import PlayListOptions from './PlaylistOptions';
import { getPlaylists } from '../../api/userUtils';
import { useNavigate } from 'react-router-dom';
import PlaylistsContainer from './PlaylistsContainer';

const PlaylistPage = () => {
  const [option, setOption] = useState('fav_artist');
  const [playlists, setPlaylists] = useState<any>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const userObj = localStorage.getItem('userData') as string;
    const userParse = JSON.parse(userObj);
    if (!access) {
      navigate('/');
    }
    const p = getPlaylists(access as string, userParse.user_id);
    p.then((resolved) => {
      setPlaylists(resolved);
    }).catch(() => {
      setPlaylists({
        error: {
          message: 'Failed to fetch',
          status: 503
        }
      });
    });
  }, []);
    
  return (
    <div id='playlistpage-container'>
        <PlayListOptions
          setOption={setOption}
        />
        <PlaylistsContainer
          playlists={playlists}
          selectedPlaylists={selectedPlaylists} 
          setSelectedPlaylists={setSelectedPlaylists}
        />
        <div id='confirm-btn-container'>
          TODO!
        </div>
    </div>
  );
};

export default PlaylistPage;