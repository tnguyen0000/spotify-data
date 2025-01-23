import { useEffect } from "react";

const TopStatsPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let type = urlParams.get('type');
    switch (type) {
      case "artists":
        console.log("TODO!: ARTISTS");
        break;
      case "songs":
        console.log("TODO!: SONGS");
        break;
      default:
        console.log("TODO!: ERROR CHECL")
    }
  });

    return (
      <>
          TODO!
      </>
    );
  };
  
  export default TopStatsPage;