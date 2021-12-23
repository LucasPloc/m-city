import { useState, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import { getDocs, collection, DB } from "../../firebase";
import MatchesBlock from "../utils/matches-blocks";

const Blocks = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!matches.length > 0) {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(DB, "matches"));
          const matches = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatches(matches);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [matches]);

  const showMatches = () =>
    matches
      ? matches.map((match) => (
          <Slide bottom key={match.id} className="item" triggerOnce>
            <div>
              <div className="wrapper">
                <MatchesBlock match={match} />
              </div>
            </div>
          </Slide>
        ))
      : null;
  return <div className="home_matches">{showMatches()}</div>;
};

export default Blocks;
