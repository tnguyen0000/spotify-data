import StatCard from "./StatCard";
import '../styles/userstatspage.css'

const StatCardContainer = (props: any) => {
  const {stat, checked} = props;
  return (
    <div id="items-container"
      style={{display: stat.time_range === checked ? "grid" : "none"}}
    >
      {
        !stat.error ?
          stat.items.map((s: any) => (
            <StatCard
              key = {s.id + checked}
              id = {s.id}
              name = {s.name}
              artists = {s.artists ? s.artists : null}
              spotifyUrl = {s.spotifyUrl}
              imageUrl = {s.imageUrl}
            /> 
          ))
        :
          'Error'
      }
    </div>
  )
};

export default StatCardContainer;