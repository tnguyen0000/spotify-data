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
      const error = {
        message: 'Failed to fetch',
        status: 503,
      };
      const errorResponse = [
        {
          time_range: 'short_term',
          error,
        },
        {
          time_range: 'medium_term',
          error,
        },
        {
          time_range: 'long_term',
          error,
        },
      ];
      switch (type) {
        case 'artists':
          const getArtistStats =  async () => {
            const statPromise = getTopStats(access, 'artists');
            statPromise.then((stats) => {
              setStatData(stats)
            }).catch(() => {
              setStatData(errorResponse); 
            });
          }
          getArtistStats();
          break;
        case 'songs':
          const getSongStats =  async () => {
            const statPromise = getTopStats(access, 'tracks');
            statPromise.then((stats) => {
              setStatData(stats)
            }).catch(() => {
              setStatData(errorResponse);
            });
          }
          getSongStats();
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, []);

  useEffect(() => {
    console.log(123, statData)
  }, [statData]);
  
  return (
    <div id='statspage-container'>
      <StatOptions
        setOption={setChecked}
      />
      {
        (() => {
          if (statData.length > 0) {
            return statData.map((s: any) => (
              <StatCardContainer 
                key = {s.time_range}
                stat = {s}
                checked = {checked}
              />
            ));
          } else if (statData.length == 0) {
            return ('Loading...');
          }
        })()
      }
    </div>
  );
};

export default TopStatsPage;