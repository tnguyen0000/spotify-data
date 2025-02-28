import { PlayListCardProps } from '../../types';
import '../styles/playliststatspage.css';

const PlaylistCard = (props: PlayListCardProps) => {
  const {id, name, imageUrl, selectedPlaylist, setSelectedPlaylist, setSelectedPlaylistName} = props;

  return (
    <div className='playlist-card'
      onClick={() => {
        setSelectedPlaylist(id);
        setSelectedPlaylistName(name);
      }}
    >
      <img src={imageUrl ? imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'} alt='' 
        style={{opacity: id === selectedPlaylist ? 1 : 0.4}}
      />
        <h2 className='card-name'
        style={{opacity: id === selectedPlaylist ? 1 : 0.4}}
        >
          {name}
        </h2>
    </div>
  );
};

export default PlaylistCard;