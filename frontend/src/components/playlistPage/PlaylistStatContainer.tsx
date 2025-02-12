import '../styles/userstatspage.css';
import '../styles/playliststatspage.css';
import { PlaylistStatContainerProps, StatNamesObject } from '../../types';
import PlaylistStatList from './PlaylistStatList';

const PlaylistStatContainer = (props: PlaylistStatContainerProps) => {
  const {stats, statName, playlistName} = props;
  const statNameObj: StatNamesObject = {
    'fav_artist': 'Favourite Artists',
    'fav_genre': 'Favourite Genres',
    'fav_year': 'Favourite Years',
    'popularity': 'Most Popular Songs'
  };
  const statNameString: string = statNameObj[statName as keyof typeof statNameObj];

  return (
    <div id='stat-container'>
      {
        (() => {
          if (stats.length > 0) {
            return (
            <>
              <div id='statlist-title'>
                <h3>Your Top {stats.length} <span className='emphasis-heading'>{statNameString}</span> on <span className='emphasis-heading'>{playlistName}</span>!</h3>
              </div>
              <PlaylistStatList
                stats={stats}
                statName={statName}
                playlistName={playlistName}
              />
            </>
            );
          } else if (stats.length == 0) {
            return 'Loading...';
          } else if (stats.error) {
            return stats.error.message;
          }
        })()
      }
    </div>
  );
};

export default PlaylistStatContainer;