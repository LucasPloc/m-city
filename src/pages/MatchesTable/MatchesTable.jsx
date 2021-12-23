import { useEffect, useState, useReducer } from "react";
import { showToastError } from "../../components/utils/tools";
import { CircularProgress } from "@mui/material";
import { query, collection, getDocs, DB } from "../../firebase";

import Table from "./Table";
import List from "./List";

const MatchesTable = () => {
  const [matches, setMatches] = useState(null);
  const [state, dispatch] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { filterMatches: null, playedFilter: "All", resultFilter: "All" }
  );

  useEffect(() => {
    if (!matches) {
      const takeMatches = async () => {
        try {
          const q = await query(collection(DB, "matches"));
          const querySnapshot = await getDocs(q);
          const matches = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatches(matches);
          dispatch({ ...state, filterMatches: matches });
        } catch (err) {
          showToastError(err);
        }
      };
      takeMatches();
    }
  }, [matches, state]);

  const showPlayed = (played) => {
    const list = matches.filter((match) => match.final === played);
    dispatch({
      ...state,
      filterMatches: played === "All" ? matches : list,
      playedFilter: played,
      resultFilter: "All",
    });
  };

  const showResult = (result) => {
    const list = matches.filter((match) => match.result === result);
    dispatch({
      ...state,
      filterMatches: result === "All" ? matches : list,
      playedFilter: "All",
      resultFilter: result,
    });
  };

  console.log(state.filterMatches);

  return (
    <div>
      {matches ? (
        <div className="the_matches_container">
          <div className="the_matches_wrapper">
            <div className="left">
              <div className="match_filters">
                <div className="match_filters_box">
                  <div className="tag">Show matches</div>
                  <div className="cont">
                    <div
                      className={`option ${
                        state.playedFilter === "All" ? "active" : ""
                      }`}
                      onClick={() => showPlayed("All")}
                    >
                      All
                    </div>
                    <div
                      className={`option ${
                        state.playedFilter === "Yes" ? "active" : ""
                      }`}
                      onClick={() => showPlayed("Yes")}
                    >
                      Played
                    </div>
                    <div
                      className={`option ${
                        state.playedFilter === "No" ? "active" : ""
                      }`}
                      onClick={() => showPlayed("No")}
                    >
                      Not Played
                    </div>
                  </div>
                </div>
                <div className="match_filters_box">
                  <div className="tag">Result games</div>
                  <div className="cont">
                    <div
                      className={`option ${
                        state.resultFilter === "All" ? "active" : ""
                      }`}
                      onClick={() => showResult("All")}
                    >
                      All
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === "W" ? "active" : ""
                      }`}
                      onClick={() => showResult("W")}
                    >
                      W
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === "L" ? "active" : ""
                      }`}
                      onClick={() => showResult("L")}
                    >
                      L
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === "D" ? "active" : ""
                      }`}
                      onClick={() => showResult("D")}
                    >
                      D
                    </div>
                  </div>
                </div>
              </div>
              <List matches={state.filterMatches} />
            </div>
            <div className="right">
              <Table></Table>
            </div>
          </div>
        </div>
      ) : (
        <div className="progress">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default MatchesTable;
