import { useEffect, useState } from "react";

import '../styles/userstatspage.css'
import StatCard from "./StatCard";
import { getTopStats } from "../../api/userUtils";
import { useNavigate } from "react-router-dom";

const TopStatsPage = () => {
  const [checked, setChecked] = useState('long_term');
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
          // TODO!: Finish this
          const b =  async () => {
            const statPromise = getTopStats(access, 'artists');
            statPromise.then((arr) => {
              for (const j of arr) {
                console.log(j['items'])
              }
            });
          }
          b();
          break;
        case "songs":
          console.log('songs')
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

  useEffect(() => {
    console.log(checked)
  }, [checked]);

  const test = Array(50).fill({
    'id': 'asd',
    'name': 'thee weekend',
    'artists': [],
    'spotifyUrl': 'www.spo',
    'imageUrl': 'https://cdn.sanity.io/images/7g6d2cj1/production/81b67e7af332ce7e4b971bad24c892a114f06448-1000x667.jpg?h=667&q=70&auto=format',
    'type': 'track',
  });

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
      <div id="items-container">
        {
          test.map((t)  => ( // TODO!: Split this
            <StatCard 
              key = {t.id}
              id = {t.id}
              name = {t.name}
              artists = {t.artists}
              spotifyUrl = {t.spotifyUrl}
              imageUrl = {t.imageUrl}
              type = 'track'  
          />
          ))

        }
      </div>
    </div>
  );
};

export default TopStatsPage;