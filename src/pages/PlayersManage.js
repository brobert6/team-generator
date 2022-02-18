import { useContext } from "react";
import { Fragment } from "react/cjs/react.development";
import PlayerList from "../components/playersmanage/PlayerList";
import PlayersContext from "../store/player-context";

function PlayersManagePage() {
  const players = useContext(PlayersContext).players;

  return (
    <Fragment>
      <h2>Manage players</h2>
      <PlayerList players={players} />
    </Fragment>
  );
}

export default PlayersManagePage;
