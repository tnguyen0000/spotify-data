import { useEffect, useState } from 'react';

import '../styles/userstatspage.css';
import { getTopStats } from '../../api/userUtils';
import { useNavigate } from 'react-router-dom';
import StatCardContainer from './StatCardContainer';
import StatOptions from './StatsOptions';

const TopStatsPage = () => {
  const [checked, setChecked] = useState('long_term');
  const [statData, setStatData] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    const access = localStorage.getItem('access_token');
    if (!access) {
      navigate('/');
    } else {
      switch (type) {
        case 'artists':
          const getArtistStats =  async () => {
            const statPromise = getTopStats(access, 'artists');
            statPromise.then((stats) => {
              setStatData(stats)
            }).catch((err) => {
              console.log(err);  
            });
          }
          getArtistStats();
          break;
        case 'songs':
          const getSongStats =  async () => {
            const statPromise = getTopStats(access, 'tracks');
            statPromise.then((stats) => {
              setStatData(stats)
            }).catch((err) => {
              console.log(err);  
            });
          }
          getSongStats();
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, []);
  
  return (
    <div id='statspage-container'>
      <StatOptions
        setOption={setChecked}
      />
      {
        statData.map((s: any) => (
          <StatCardContainer 
            key = {s.time_range}
            stat = {s}
            checked = {checked}
          />
        ))
      }
    </div>
  );
};

export default TopStatsPage;