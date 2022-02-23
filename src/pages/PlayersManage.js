import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Fragment } from "react/cjs/react.development";
import NewPlayerForm from "../components/playersmanage/NewPlayerForm";
import PlayerList from "../components/playersmanage/PlayerList";
import { API_URL } from "../config";
import PlayersContext from "../store/player-context";

function PlayersManagePage() {
  const playersCtx = useContext(PlayersContext);

  const profileId = playersCtx.profileId;

  const history = useHistory();
  if (playersCtx.players === null || playersCtx.players.length === 0) {
    history.replace("/");
  }
  if (profileId === 0 || profileId === null) {
    history.replace("/profile");
  }

  const addPlayerHandler = (playerName) => {
    const playerData = {
      id: Math.max.apply(
        Math,
        playersCtx.players.map(function (o) {
          return o.y;
        })
      ),
      name: playerName,
    };

    let playersData = [...playersCtx.players];
    playersData.push(playerData);

    playersCtx.loadPlayers(playersData);

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(playerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("submitted...");
    });
  };

  return (
    <Fragment>
      <h2>Manage players</h2>
      {profileId !== null && <PlayerList />}
      <NewPlayerForm onAddPlayer={addPlayerHandler} />
    </Fragment>
  );
}

export default PlayersManagePage;
