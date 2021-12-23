import React from "react";
import Featured from "../../components/Featured/Featured";
import Matches from "../../components/Matches/Matches";
import MeetPlayers from "../../components/MeetPlayers/MeetPlayers";
import Promotion from "../../components/Promotion/Promotion";

const Home = () => {
  return (
    <div className="bck_blue">
      <Featured />
      <Matches />
      <MeetPlayers />
      <Promotion />
    </div>
  );
};

export default Home;
