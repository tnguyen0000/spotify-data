import { useEffect, useState } from "react";

import './styles/userstatspage.css'

const TopStatsPage = () => {
  const [checked, setChecked] = useState('long_term');
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    switch (type) {
      case "artists":
        console.log("TODO!: ARTISTS");
        break;
      case "songs":
        console.log("TODO!: SONGS");
        break;
      default:
        console.log("TODO!: ERROR CHECL")
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
            Songs
          </div>
      </div>
    );
  };
  
  export default TopStatsPage;