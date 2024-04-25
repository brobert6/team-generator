import { useCallback, useContext, useEffect, useState } from "react";
import PlayerList from "../components/players/PlayerList";
import PlayersContext from "../store/player-context";
import { getApiUrl, getPlayerScore } from "../general/helpers";
import { useParams } from "react-router-dom";
import { WINS_MULTIPLIER } from "../config";

//const players = require("../components/players.json");

function PlayersPage() {
  const playersCtx = useContext(PlayersContext);
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const winsMultiplier = WINS_MULTIPLIER;

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

      const playerWins = data.wins === undefined ? [] : data.wins;
      const playerLosses = data.losses === undefined ? [] : data.losses;

      const playersData = [];
      for (const key in data) {
        //add wins and losses
        const nrWins = Object.values(playerWins).filter(
          (x) => x.indexOf(key) >= 0
        ).length;
        const nrLosses = Object.values(playerLosses).filter(
          (x) => x.indexOf(key) >= 0
        ).length;

        const playerData = {
          ...data[key],
          wins: (nrWins - nrLosses) * winsMultiplier,
        };
        if (playerData.name !== undefined) playersData.push(playerData);
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
            a.attack +
            a.defense +
            a.stamina +
            a.wins -
            b.attack -
            b.defense -
            b.stamina -
            b.wins
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
        team={params.team}
      />
    </section>
  );
}

export default PlayersPage;
