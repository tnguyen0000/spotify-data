import { useEffect } from "react";
import { SetOptionProps } from "../../types";
import '../styles/userstatspage.css';

const StatOptions = (props: SetOptionProps) => {
  const {setOption} = props;

  useEffect(() => {
    const radio = document.getElementsByName('category');
    for (const input of radio) {
      input.addEventListener('change', () => {
        setOption((input as HTMLInputElement).value);
      });
    }
  }, []);
  
  return (
    <div id='category-container'>
    <label className='category-label' htmlFor='last-year'>
      <input type='radio' id='last-year' name='category' value={'long_term'} 
        defaultChecked
      />
      <span className='category-select-btn'>
        Last Year
      </span>
    </label>
    <label className='category-label' htmlFor='last-6-months'>
      <input type='radio' id='last-6-months' name='category' value={'medium_term'} />
      <span className='category-select-btn'>
        Last 6 Months
      </span>
    </label>
    <label className='category-label' htmlFor='last-4-wks'>
      <input type='radio' id='last-4-wks' name='category' value={'short_term'} />
      <span className='category-select-btn'>
        Last 4 Weeks
      </span>
    </label>
  </div>
  );
};

export default StatOptions;