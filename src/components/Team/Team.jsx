import { useEffect, useState } from "react";
import PlayerCard from "../utils/PlayerCard";
import { Slide } from "react-awesome-reveal";
import { getDocs, collection, DB } from "../../firebase";
import { CircularProgress } from "@mui/material";

const Team = () => {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    if (!players) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(DB, "players"));
          const players = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPlayers(players);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      };
      fetchData();
    }
  }, [players]);

  console.log(players);

  const showPlayerByCategory = (category) =>
    players
      ? players.map((player, index) =>
          player.position === category ? (
            <Slide left key={player.id} triggerOnce>
              <div className="item">
                <PlayerCard
                  number={player.number}
                  name={player.name}
                  lastname={player.lastname}
                />
              </div>
            </Slide>
          ) : null
        )
      : null;
  return (
    <div className="the_team_container">
      {loading ? (
        <div className="progress">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="team_category_wrapper">
            <div>Keepers</div>
            <div className="team_cards">{showPlayerByCategory("Keeper")}</div>
          </div>
          <div className="team_category_wrapper">
            <div>Midfield</div>
            <div className="team_cards">{showPlayerByCategory("Midfield")}</div>
          </div>
          <div className="team_category_wrapper">
            <div>Defence</div>
            <div className="team_cards">{showPlayerByCategory("Defence")}</div>
          </div>
          <div className="team_category_wrapper">
            <div>Striker</div>
            <div className="team_cards">{showPlayerByCategory("Striker")}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
