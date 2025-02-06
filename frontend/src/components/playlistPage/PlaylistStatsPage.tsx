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
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
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
          selectedPlaylist={selectedPlaylist} 
          setSelectedPlaylist={setSelectedPlaylist}
        />
        <div id='confirm-btn-container'>
          <button
            id='confirm-btn'
            disabled={selectedPlaylist ? false : true}
            onClick={(b) => {
              b.preventDefault();
              // TODO!: Functionality
            }}
          >
            { selectedPlaylist ? 'Get Stats!' : 'Select A Playlist' }
          </button>
        </div>
    </div>
  );
};

export default PlaylistPage;