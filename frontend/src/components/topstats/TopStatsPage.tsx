import { useEffect, useState } from "react";

import '../styles/userstatspage.css'
import { getTopStats } from "../../api/userUtils";
import { useNavigate } from "react-router-dom";
import StatCardContainer from "./StatCardContainer";

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
        case "artists":
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
        case "songs":
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
          console.log("TODO!: ERROR CHECK")
      }
    }
  }, []);

  useEffect(() => {
    const radio = document.getElementsByName('category');
    for (const input of radio) {
      input.addEventListener('change', () => {
        setChecked((input as HTMLInputElement).value);
      });
    }
  }, []);

  
  
  return (
    <div id="statspage-container">
      <div id="category-container">
        <label className="category-label" htmlFor="last-year">
          <input type="radio" id="last-year" name="category" value={'long_term'} 
            defaultChecked
          />
          <span className="category-select-btn">
            Last Year
          </span>
        </label>
        <label className="category-label" htmlFor="last-6-months">
          <input type="radio" id="last-6-months" name="category" value={'medium_term'} />
          <span className="category-select-btn">
            Last 6 Months
          </span>
        </label>
        <label className="category-label" htmlFor="last-4-wks">
          <input type="radio" id="last-4-wks" name="category" value={'short_term'} />
          <span className="category-select-btn">
            Last 4 Weeks
          </span>
        </label>
      </div>
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