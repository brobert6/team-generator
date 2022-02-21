import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Fragment } from "react/cjs/react.development";
import NewPlayerForm from "../components/playersmanage/NewPlayerForm";
import PlayerList from "../components/playersmanage/PlayerList";
import { API_URL } from "../config";
import PlayersContext from "../store/player-context";

function PlayersManagePage() {
  const playersCxt = useContext(PlayersContext);

  const playerId = localStorage.getItem("PlayerId");

  const history = useHistory();
  if (playersCxt.players === null || playersCxt.players.length === 0)
    history.replace("/");
  else if (playerId === null) history.replace("/profile");

  const addPlayerHandler = (playerName) => {
    const playerData = {
      id: Math.max.apply(
        Math,
        playersCxt.players.map(function (o) {
          return o.y;
        })
      ),
      name: playerName,
    };

    let playersData = [...playersCxt.players];
    playersData.push(playerData);

    playersCxt.loadPlayers(playersData);

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(playerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("submitted...");
      //setIsLoading(true);
    });
  };

  return (
    <Fragment>
      <h2>Manage players</h2>
      <PlayerList players={playersCxt.players} playerId={playerId} />
      <NewPlayerForm onAddPlayer={addPlayerHandler} />
    </Fragment>
  );
}

export default PlayersManagePage;
