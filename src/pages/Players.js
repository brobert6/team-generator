import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerList from "../components/players/PlayerList";
import PlayersContext from "../store/player-context";
import { getApiUrl, getPlayerScore } from "../general/helpers";

//const players = require("../components/players.json");

function PlayersPage() {
  const playersCtx = useContext(PlayersContext);

  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayersHandler = useCallback(async () => {
    console.log(`fetching data for ${params.team} ...`);
    setIsLoading(true);
    setError(null);
    try {
      playersCtx.loadGroupName(params.team);
      const response = await fetch(getApiUrl(params.team));
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const playersData = [];
      for (const key in data) {
        const playedData = {
          id: key,
          ...data[key],
        };
        playersData.push(playedData);
      }

      //calculate player scores
      for (const player of playersData) {
        for (const type of ["attack", "defense", "stamina"]) {
          let initialValue = 0;
          let sum = playersData.reduce(function (previousValue, currentValue) {
            return (
              previousValue +
              getPlayerScore(currentValue.playerScores, player.id, type)
            );
          }, initialValue);
          let count = playersData.reduce(function (
            previousValue,
            currentValue
          ) {
            return (
              previousValue +
              (getPlayerScore(currentValue.playerScores, player.id, type) > 0
                ? 1
                : 0)
            );
          },
          initialValue);
          player[type] = Math.floor(sum / count);
        }
      }

      //sort by score and load
      playersCtx.loadPlayers(
        playersData.sort(
          (b, a) =>
            a.attack + a.defense + a.stamina - b.attack - b.defense - b.stamina
        )
      );

      if (localStorage.getItem("PlayerId") !== null) {
        const currentPlayer = playersData.find(
          (p) => p.id === localStorage.getItem("PlayerId")
        );
        if (currentPlayer !== undefined) {
          playersCtx.loadProfilePlayerScores(currentPlayer.playerScores);
          playersCtx.updateProfileName(currentPlayer.name);
          playersCtx.updateProfileImgSrc(currentPlayer.imgSrc);
        }
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [params.team]);

  useEffect(() => {
    if (playersCtx.players.length === 0) {
      fetchPlayersHandler();
    } else {
      setIsLoading(false);
    }
  }, [fetchPlayersHandler, playersCtx.players.length]);

  if (isLoading) {
    return <section>Loading...</section>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <PlayerList
        players={playersCtx.players}
        selectedPlayers={playersCtx.selectedPlayers}
      />
    </section>
  );
}

export default PlayersPage;
