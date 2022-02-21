import { useContext, useEffect, useState } from "react";
import PlayerList from "../components/players/PlayerList";
import PlayersContext from "../store/player-context";
import { API_URL } from "../config";

//const players = require("../components/players.json");

function PlayersPage() {
  const playersCxt = useContext(PlayersContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const playersData = [];
        for (const key in data) {
          const playedData = {
            id: key,
            ...data[key],
          };
          playersData.push(playedData);
        }

        setIsLoading(false);
        playersCxt.loadPlayers(playersData);
      });
  }, [isLoading]);

  if (isLoading) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <PlayerList
        players={playersCxt.players}
        selectedPlayers={playersCxt.selectedPlayers}
      />
    </section>
  );
}

export default PlayersPage;
