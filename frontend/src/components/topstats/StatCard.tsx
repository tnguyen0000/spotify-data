import { StatProps } from "../../types"

const StatCard = (props: StatProps) => {
  const {name, artists, spotifyUrl, imageUrl, type} = props;
  
  return (
    <div className="stat-card">
      <img src={imageUrl} alt="" />
      <h2 className="card-name">{name}</h2>
    </div>
  );
};

export default StatCard