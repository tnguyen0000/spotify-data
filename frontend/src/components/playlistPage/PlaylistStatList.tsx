import '../styles/userstatspage.css';
import '../styles/playliststatspage.css';
import { PlaylistStatContainerProps } from '../../types';

const PlaylistStatList = (props: PlaylistStatContainerProps) => {
  const {stats, statName} = props;

  const statPrint = () => {
    if (statName == 'fav_artist') {
      return (
        <>
          {stats.map((s: any) => (
            <li key={s.id}>
              <span className='emphasis-name'>'{s.name}'</span> was found <span className='emphasis-name'>'{s.count}'</span> times
            </li>
          ))}
        </>
      );
    } else if (statName == 'fav_genre') {
      return (
        <>
          {stats.map((s: any) => (
            <li key={s.genre}>
              <span className='emphasis-name'>'{s.genre}'</span> was found <span className='emphasis-name'>'{s.count}'</span> times
            </li>
          ))}
        </>
      );
    } else if (statName == 'fav_year') {
      return (
        <>
          {stats.map((s: any) => (
            <li key={s.year}>
              <span className='emphasis-name'>'{s.year}'</span> was found <span className='emphasis-name'>'{s.count}'</span> times
            </li>
          ))}
        </>
      );
    } else if (statName == 'popularity') {
      return (
        <>
          {stats.map((s: any) => (
            <li key={s.name}>
              <span className='emphasis-name'>'{s.name}'</span> has a popularity score of <span className='emphasis-name'>'{s.popularity}'</span>!
            </li>
          ))}
        </>
      );
    }

    return (<>{'Broken'}</>);
  }

  return (
    <ul>
      {statPrint()}
    </ul>
  );
};

export default PlaylistStatList;