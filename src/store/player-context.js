import { createContext } from "react";
import { useState } from "react/cjs/react.development";

const PlayersContext = createContext({
  players: [],
  selectedPlayers: [],
  totalSelectedPlayers: 0,
  loadPlayers: (players) => {},
  updatePlayers: (player) => {},
  addSelectedPlayer: (selectedPlayer) => {},
  removeSelectedPlayer: (playerId) => {},
  itemIsSelectedPlayer: (playerId) => {},
});

export function PlayersContextProvider(props) {
  const [players, setPlayers] = useState([]);
  const [userSelectedPlayers, setUserSelectedPlayers] = useState([]);

  function loadPlayersHandler(players) {
    setPlayers((prevPlayers) => {
      return players;
    });
  }

  function updatePlayerHandler(player) {
    setPlayers((prevPlayers) => {
      //add update player data logic
      return prevPlayers;
    });
  }

  function addSelectedPlayerHandler(selectedPlayer) {
    setUserSelectedPlayers((prevUserSelectedPlayers) => {
      return prevUserSelectedPlayers.concat(selectedPlayer);
    });
  }

  function removeSelectedPlayerHandler(playerId) {
    setUserSelectedPlayers((prevUserSelectedPlayers) => {
      return prevUserSelectedPlayers.filter((player) => player.id !== playerId);
    });
  }

  function itemIsSelectedPlayerHandler(playerId) {
    return userSelectedPlayers.some((player) => player.id === playerId);
  }

  const context = {
    players: players,
    selectedPlayers: userSelectedPlayers,
    totalSelectedPlayers: userSelectedPlayers.length,
    loadPlayers: loadPlayersHandler,
    updatePlayer: updatePlayerHandler,
    addSelectedPlayer: addSelectedPlayerHandler,
    removeSelectedPlayer: removeSelectedPlayerHandler,
    itemIsSelectedPlayer: itemIsSelectedPlayerHandler,
  };

  return (
    <PlayersContext.Provider value={context}>
      {props.children}
    </PlayersContext.Provider>
  );
}

export default PlayersContext;
