import { useState } from 'react';
import { PlayListCardProps } from '../../types';
import '../styles/playliststatspage.css';

const PlaylistCard = (props: PlayListCardProps) => {
  const {id, name, imageUrl, selectedPlaylists, setSelectedPlaylists} = props;
  const [selected, setSelected] = useState(false);

  return (
    <div className='stat-card'
      onClick={() => {
        setSelected(!selected)
        if (selectedPlaylists.includes(id)) {
          setSelectedPlaylists(selectedPlaylists.filter((x) => x != id));
        } else {
          selectedPlaylists.push(id);
          setSelectedPlaylists(selectedPlaylists);
        }
      }}
    >
      <img src={imageUrl ? imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'} alt='' 
        style={{opacity: selected ? 1 : 0.4}}
      />
        <h2 className='card-name'
        style={{opacity: selected ? 1 : 0.4}}
        >
          {name}
        </h2>
    </div>
  );
};

export default PlaylistCard;