import '../styles/playliststatspage.css';
import PlaylistCard from './PlaylistCard';
import { PlaylistContainerProps } from '../../types';

const PlaylistsContainer = (props: PlaylistContainerProps) => {
  const {playlists, selectedPlaylist, setSelectedPlaylist, setSelectedPlaylistName} = props;
  
  return (
    <div id='playlists-container'>
      {
        (() => {
          if (playlists.length > 0) {
            return playlists.map((p: any) => (
              <PlaylistCard
                key={p.id}
                id={p.id}
                name={p.name}
                imageUrl={p.images ? p.images[0].url : ''}
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
                setSelectedPlaylistName={setSelectedPlaylistName}
              />
            ));
          } else if (playlists.length == 0) {
            return ('Loading...');
          } else {
            return (playlists.error.message)
          }
        })()
      }
    </div>
  );
};

export default PlaylistsContainer;