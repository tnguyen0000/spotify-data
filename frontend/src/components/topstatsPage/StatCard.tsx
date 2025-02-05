import { StatProps } from '../../types'

const StatCard = (props: StatProps) => {
  const {name, artists, spotifyUrl, imageUrl} = props;
  
  return (
    <div className='stat-card'>
      <img src={imageUrl} alt='' />
      <a 
        href={spotifyUrl}
        target='_blank'
        rel='noopener'
      >
        <h2 className='card-name'>
          {name}
        </h2>
      </a>
      <a href={artists ? artists[0].spotifyUrl : ''}><h2 className='card-artists'>{artists ? artists[0].name : null}</h2></a>
    </div>
  );
};

export default StatCard