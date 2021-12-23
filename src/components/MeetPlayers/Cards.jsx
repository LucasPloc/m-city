import React from "react";
import { Animate } from "react-move";
import { easePolyOut } from "d3-ease";
import PlayerCard from "../utils/PlayerCard";

import Otamendi from "../../resources/images/players/Otamendi.png";
import Sterling from "../../resources/images/players/Raheem_Sterling.png";
import Kompany from "../../resources/images/players/Vincent_Kompany.png";

let cards = [
  {
    bottom: 90,
    left: 300,
    player: Kompany,
  },
  {
    bottom: 60,
    left: 200,
    player: Sterling,
  },
  {
    bottom: 30,
    left: 100,
    player: Otamendi,
  },
  {
    bottom: 0,
    left: 0,
    player: Kompany,
  },
];

const HomeCards = (props) => {
  const showAnimateCards = () =>
    cards.map((card, i) => (
      <Animate
        key={i}
        show={props.show}
        start={{
          bottom: 0,
          left: 0,
        }}
        enter={{
          bottom: [card.bottom],
          left: [card.left],
          timing: { delay: 500, duration: 500, ease: easePolyOut },
        }}
      >
        {({ left, bottom }) => (
          <div
            style={{
              position: "absolute",
              left,
              bottom,
            }}
          >
            <PlayerCard
              number="30"
              name="Nicolas"
              lastName="Otamendi"
              bck={card.player}
            />
          </div>
        )}
      </Animate>
    ));
  return <div>{showAnimateCards()}</div>;
};

export default HomeCards;
