import { useContext, useEffect, useState } from "react";
import NewPlayerForm from "../components/players/NewPlayerForm";
import PlayerList from "../components/players/PlayerList";
import PlayersContext from "../store/player-context";

//const players = require("../components/players.json");
const apiURL = "https://udemy-ng-http-5d0d5.firebaseio.com/playersv2.json";

function PlayersPage() {
  const playersCxt = useContext(PlayersContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(apiURL)
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

  const addPlayerHandler = (playerName) => {
    const playerData = {
      name: playerName,
    };

    fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(playerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("submitted...");
      setIsLoading(true);
    });
  };

  if (isLoading) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <h1>All players</h1>
      <NewPlayerForm onAddPlayer={addPlayerHandler} />
      <PlayerList
        players={playersCxt.players}
        selectedPlayers={playersCxt.selectedPlayers}
      />
    </section>
  );
}

export default PlayersPage;
