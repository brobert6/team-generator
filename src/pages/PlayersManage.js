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
    history.replace(`/${params.team}-profile`);
  }

  const addPlayerHandler = (playerName) => {
    // Validate player name
    if (!playerName || playerName.trim() === "") {
      notifications.showNotification({
        title: "Error",
        message: "Player name cannot be empty",
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    // Generate a unique ID using timestamp and random number
    const playerId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Create a complete player object with all required fields
    const playerData = {
      attack: 0,
      defense: 0,
      id: playerId,
      imgSrc: "https://img.icons8.com/clouds/2x/user.png",
      name: playerName.trim(),
      stamina: 0,
      wins: 0,
    };

    let playersData = [...playersCtx.players];
    playersData.push(playerData);

    playersCtx.loadPlayers(playersData);

    // Save to Firebase with the playerId as the key
    fetch(
      getApiUrl(params.team).replace(".json", "") + "/" + playerId + ".json",
      {
        method: "PUT",
        body: JSON.stringify(playerData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((response) => {
        if (response.ok) {
          notifications.showNotification({
            title: "Success",
            message: `Player "${playerName}" added successfully`,
            color: "teal",
            autoClose: 3000,
          });
        } else {
          throw new Error("Failed to save player");
        }
      })
      .catch((error) => {
        notifications.showNotification({
          title: "Error",
          message: "Failed to add player to database",
          color: "red",
          autoClose: 3000,
        });
        console.error("Error adding player:", error);
      });
  };

  const deletePlayerHandler = (playerId, playerName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${playerName}"? This will remove all associated data including wins/losses.`,
    );

    if (!confirmDelete) return;

    // Remove from local state
    let playersData = playersCtx.players.filter((p) => p.id !== playerId);
    playersCtx.loadPlayers(playersData);

    const baseUrl = getApiUrl(params.team).replace(".json", "");

    // 1. Delete the player record
    fetch(baseUrl + "/" + playerId + ".json", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Error deleting player record:", error);
    });

    // 2. Delete player from all playerScores in other players' records
    playersData.forEach((player) => {
      if (player.playerScores && player.playerScores.length > 0) {
        const updatedScores = player.playerScores.filter(
          (score) => score.playerId !== playerId,
        );
        if (updatedScores.length !== player.playerScores.length) {
          fetch(baseUrl + "/" + player.id + "/playerScores.json", {
            method: "PUT",
            body: JSON.stringify(updatedScores),
            headers: {
              "Content-Type": "application/json",
            },
          }).catch((error) => {
            console.error("Error updating player scores:", error);
          });
        }
      }
    });

    // 3. Remove player from wins object
    fetch(baseUrl + "/wins.json")
      .then((response) => response.json())
      .then((wins) => {
        if (wins) {
          const updatedWins = {};
          for (const date in wins) {
            const updatedList = wins[date].filter((id) => id !== playerId);
            if (updatedList.length > 0) {
              updatedWins[date] = updatedList;
            }
          }
          return fetch(baseUrl + "/wins.json", {
            method: "PUT",
            body: JSON.stringify(updatedWins),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error updating wins:", error);
      });

    // 4. Remove player from losses object
    fetch(baseUrl + "/losses.json")
      .then((response) => response.json())
      .then((losses) => {
        if (losses) {
          const updatedLosses = {};
          for (const date in losses) {
            const updatedList = losses[date].filter((id) => id !== playerId);
            if (updatedList.length > 0) {
              updatedLosses[date] = updatedList;
            }
          }
          return fetch(baseUrl + "/losses.json", {
            method: "PUT",
            body: JSON.stringify(updatedLosses),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error updating losses:", error);
      });

    notifications.showNotification({
      title: "Success",
      message: `Player "${playerName}" and all related data deleted successfully`,
      color: "teal",
      autoClose: 3000,
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
      {profileId !== null && (
        <PlayerList onDeletePlayer={deletePlayerHandler} />
      )}
    </Fragment>
  );
}

export default PlayersManagePage;
