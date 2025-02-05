import { useEffect } from 'react';
import { SetOptionProps } from '../../types';
import '../styles/userstatspage.css';

const PlayListOptions = (props: SetOptionProps) => {
  const {setOption} = props;

  useEffect(() => {
    const radio = document.getElementsByName('categoryPlaylist');
    for (const input of radio) {
      input.addEventListener('change', () => {
        setOption((input as HTMLInputElement).value);
      });
    }
  }, []);
  
  return (
  <div id='category-container'>
    <label className='category-label' htmlFor='artist'>
      <input type='radio' id='artist' name='categoryPlaylist' value={'fav_artist'} 
      defaultChecked
      />
        <span className='category-select-btn'>
        Favourite Artists
        </span>
    </label>
    <label className='category-label' htmlFor='genre'>
      <input type='radio' id='genre' name='categoryPlaylist' value={'fav_genre'} />
        <span className='category-select-btn'>
          Favourite Genres
        </span>
    </label>
    <label className='category-label' htmlFor='year'>
      <input type='radio' id='year' name='categoryPlaylist' value={'fav_year'} />
        <span className='category-select-btn'>
          Favourite Years
        </span>
    </label>
    <label className='category-label' htmlFor='popularity'>
      <input type='radio' id='popularity' name='categoryPlaylist' value={'popularity'} />
        <span className='category-select-btn'>
          Popular Songs
        </span>
    </label>
  </div>
  );
};

export default PlayListOptions;