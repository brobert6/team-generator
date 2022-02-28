import { useNotifications } from "@mantine/notifications";
import { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Fragment } from "react";
import NewPlayerForm from "../components/playersmanage/NewPlayerForm";
import PlayerList from "../components/playersmanage/PlayerList";
import { getApiUrl } from "../general/helpers";
import PlayersContext from "../store/player-context";

function PlayersManagePage() {
  const playersCtx = useContext(PlayersContext);
  const params = useParams();
  const notifications = useNotifications();

  const profileId = playersCtx.profileId;

  const history = useHistory();
  if (playersCtx.players === null || playersCtx.players.length === 0) {
    history.replace(`/${params.team}/`);
  }
  if (profileId === 0 || profileId === null) {
    notifications.showNotification({
      title: "Choose profile",
      message: "You must choose your profile to score other players...",
      color: "teal",
      autoClose: 4000,
    });
    history.replace(`/${params.team}/profile`);
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

    fetch(getApiUrl(params.team), {
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
      {playersCtx.players !== undefined && playersCtx.players.length < 15 && (
        <p>
          <i>Make sure all playes are added to list</i>
        </p>
      )}
      <NewPlayerForm onAddPlayer={addPlayerHandler} />
      {profileId !== null && <PlayerList />}
    </Fragment>
  );
}

export default PlayersManagePage;
