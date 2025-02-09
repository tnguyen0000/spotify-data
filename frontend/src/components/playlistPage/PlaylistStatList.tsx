import '../styles/userstatspage.css';
import '../styles/playliststatspage.css';
import { PlaylistStatContainerProps } from '../../types';

const PlaylistStatList = (props: PlaylistStatContainerProps) => {
  const {stats} = props;
  return (
    <ul>
      {stats.map((s: any) => (
        <li key={s.id}> 
          <span className='emphasis-name'>'{s.name}'</span> was found <span className='emphasis-name'>'{s.count}'</span> times
        </li>
      ))}
    </ul>
  );
};

export default PlaylistStatList;