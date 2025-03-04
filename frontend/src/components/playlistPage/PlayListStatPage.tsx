import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaylistStat } from "../../api/userUtils";
import '../styles/userstatspage.css';
import '../styles/playliststatspage.css';
import PlaylistStatContainer from "./PlaylistStatContainer";


const PlaylistStatPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>([]);
  const [statName, setStatName] = useState<string>('');
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('playlistId') as string;
    const statType = urlParams.get('statType') as string;
    const selectedPlaylistName = urlParams.get('playlistName') as string;
    const access = localStorage.getItem('access_token');
    if (!access || !statType || !playlistId || !selectedPlaylistName) {
      navigate('/dashboard');
    } else {
      setStatName(statType);
      setPlaylistName(selectedPlaylistName);
      const fetchedStats = getPlaylistStat(access, playlistId, statType);
      fetchedStats.then((s) => {
        setStats(s);
      }).catch(() => {
        setStats({
          error: {
            message: 'Failed to fetch',
            status: 503
          }
        });
      })
    }
  }, []);

  return (
    <div id='playlistpage-container'>
      <div id="category-container">
        <button
          id='confirm-btn'
          onClick={(b) => {
            b.preventDefault();
            navigate('/playliststats');
          }}
        >
          Go Back
        </button>
      </div>
      <PlaylistStatContainer
        stats={stats}
        statName={statName}
        playlistName={playlistName}
      />
    </div>
  );
};

export default PlaylistStatPage;