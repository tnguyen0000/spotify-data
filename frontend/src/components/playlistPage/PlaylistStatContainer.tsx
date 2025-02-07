import '../styles/userstatspage.css';
import '../styles/playliststatspage.css';
import { PlaylistStatContainerProps } from '../../types';

const PlaylistStatContainer = (props: PlaylistStatContainerProps) => {
  const {stats, statName} = props;

  return (
    <div>
      {
        (() => {
          if (stats.length > 0) {
            return 'ads';
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