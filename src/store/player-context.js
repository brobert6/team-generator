import { createContext } from "react";
import { useState } from "react/cjs/react.development";
import { API_URL } from "../config";

const PlayersContext = createContext({
  groupName: "",
  players: [],
  selectedPlayers: [],
  profilePlayerScores: [],
  totalSelectedPlayers: 0,
  profileId: 0,
  profileName: "",
  profileImgSrc: "",
  loadPlayers: (players) => {},
  updatePlayers: (player) => {},
  loadProfilePlayerScores: (playerScores) => {},
  updateProfilePlayerScore: (playerScore) => {},
  addSelectedPlayer: (selectedPlayer) => {},
  removeSelectedPlayer: (playerId) => {},
  itemIsSelectedPlayer: (playerId) => {},
  updateProfileId: (playerId) => {},
  updateProfileName: (name) => {},
  updateProfileImgSrc: (imgSrc) => {},
  updateInitialItemIndex: (initialItemIndex) => {},
});

export function PlayersContextProvider(props) {
  const [groupName, setGroupName] = useState(null);
  const [players, setPlayers] = useState([]);
  const [userSelectedPlayers, setUserSelectedPlayers] = useState([]);
  const [profilePlayerScores, setProfilePlayerScores] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [profileImgSrc, setProfileImgSrc] = useState(null);
  const [initialItemIndex, setInitialItemIndex] = useState(0);

  function loadGroupNameHandler(newGroupName) {
    setGroupName((prevGroupName) => {
      return newGroupName;
    });
  }

  function getApiURL() {
    return API_URL; // + "/" + groupName;
  }

  function loadPlayersHandler(players) {
    if (profileId === null && localStorage.getItem("PlayerId") !== null) {
      setProfileId((prevProfileId) => {
        return localStorage.getItem("PlayerId");
      });
    }

    setPlayers((prevPlayers) => {
      return players;
    });
  }

  function loadProfilePlayerScoresHandler(playerScores) {
    setProfilePlayerScores((prevPlayerScores) => {
      return playerScores;
    });
  }

  function updatePlayerHandler(player) {
    setPlayers((prevPlayers) => {
      //add update player data logic
      return prevPlayers;
    });
  }

  function updateProfilePlayerScoreHandler(playerId, type, value) {
    setProfilePlayerScores((prevPlayerScores) => {
      if (prevPlayerScores == null) {
        prevPlayerScores = [];
      }

      let currentScore = prevPlayerScores.find((s) => s.playerId === playerId);
      prevPlayerScores = prevPlayerScores.filter(
        (s) => s.playerId !== playerId
      );

      if (currentScore === undefined) {
        currentScore = {
          attack: 0,
          defense: 0,
          stamina: 0,
          playerId: playerId,
        };
      }

      switch (type) {
        case "attack":
          currentScore.attack = value;
          break;
        case "defense":
          currentScore.defense = value;
          break;
        case "stamina":
          currentScore.stamina = value;
          break;
        default:
          break;
      }
      prevPlayerScores.push(currentScore);
      return prevPlayerScores;
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

  function updateProfileIdHandler(playerid) {
    return setProfileId((prevProfileId) => {
      return playerid;
    });
  }

  function updateProfileNameHandler(name) {
    return setProfileName((prevProfileName) => {
      return name;
    });
  }

  function updateProfileImgSrcHandler(imgSrc) {
    return setProfileImgSrc((prevProfileImgSrc) => {
      return imgSrc;
    });
  }

  function updateInitialItemIndexHandler(initialItemIndex) {
    return setInitialItemIndex((prevInitialItemIndex) => {
      return initialItemIndex;
    });
  }

  const context = {
    groupName: groupName,
    players: players,
    profileId: profileId,
    profileName: profileName,
    profileImgSrc: profileImgSrc,
    initialItemIndex: initialItemIndex,
    selectedPlayers: userSelectedPlayers,
    profilePlayerScores: profilePlayerScores,
    totalSelectedPlayers: userSelectedPlayers.length,
    loadGroupName: loadGroupNameHandler,
    loadPlayers: loadPlayersHandler,
    updatePlayer: updatePlayerHandler,
    addSelectedPlayer: addSelectedPlayerHandler,
    removeSelectedPlayer: removeSelectedPlayerHandler,
    itemIsSelectedPlayer: itemIsSelectedPlayerHandler,
    loadProfilePlayerScores: loadProfilePlayerScoresHandler,
    updateProfilePlayerScore: updateProfilePlayerScoreHandler,
    updateProfileId: updateProfileIdHandler,
    updateProfileName: updateProfileNameHandler,
    updateProfileImgSrc: updateProfileImgSrcHandler,
    updateInitialItemIndex: updateInitialItemIndexHandler,
  };

  return (
    <PlayersContext.Provider value={context}>
      {props.children}
    </PlayersContext.Provider>
  );
}

export default PlayersContext;
