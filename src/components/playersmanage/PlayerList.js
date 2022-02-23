import {
  Group,
  Avatar,
  Text,
  Accordion,
  Slider,
  CheckboxIcon,
  Button,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Fragment, useContext } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react/cjs/react.development";
import { API_URL } from "../../config";
import PlayersContext from "../../store/player-context";

import classes from "./PlayerList.module.css";

const AccordionLabel = ({ label, image, attack, defense, stamina }) => {
  return (
    <Group noWrap>
      <Avatar src={image} radius="xl" size="lg" />
      <div style={{ width: "100%" }}>
        <Text style={{ float: "left" }}>{label}</Text>
        <div className={classes.divcircle}>
          <CircularProgressbar
            value={stamina}
            text={`${stamina}`}
            styles={buildStyles({
              pathColor: `rgba(34, 139, 230, ${stamina / 100})`,
              textColor: "#228be6",
              textSize: "40px",
            })}
          />
        </div>
        <div className={classes.divcircle}>
          <CircularProgressbar
            value={defense}
            text={`${defense}`}
            styles={buildStyles({
              pathColor: `rgba(64, 192, 87, ${defense / 100})`,
              textColor: "#40c057",
              textSize: "40px",
            })}
          />
        </div>
        <div className={classes.divcircle}>
          <CircularProgressbar
            value={attack}
            text={`${attack}`}
            styles={buildStyles({
              pathColor: `rgba(250, 82, 82, ${attack / 100})`,
              textColor: "#fa5252",
              textSize: "40px",
            })}
          />
        </div>
      </div>
    </Group>
  );
};

const PlayerList = () => {
  const playersCtx = useContext(PlayersContext);
  const notifications = useNotifications();

  const profileId = playersCtx.profileId;
  const players = playersCtx.players;
  const profilePlayerScores = playersCtx.profilePlayerScores;
  const initialItemIndex = playersCtx.initialItemIndex;

  const [accItemScoresUpdated, setAccItemScoresUpdated] = useState(false);

  //this shuld not run
  if (
    (playersCtx.profilePlayerScores === undefined ||
      playersCtx.profilePlayerScores.length === 0) &&
    playersCtx.players.find((p) => p.id === profileId).playerScores != null
  ) {
    playersCtx.loadProfilePlayerScores(
      playersCtx.players.find((p) => p.id === profileId).playerScores
    );
  }

  const saveClickHandler = () => {
    saveScore();
  };

  const onAccordionChanged = (state) => {
    for (let i = 0; i < players.length; i++) {
      if (state[i] === true) {
        playersCtx.updateInitialItemIndex(i);
        break;
      }
    }

    //save to database
    if (accItemScoresUpdated) {
      saveScore();
    }
  };

  const saveScore = () => {
    fetch(
      API_URL.replace(".json", "") + "/" + profileId + "/playerScores.json",
      {
        method: "PUT",
        body: JSON.stringify(profilePlayerScores),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      notifications.showNotification({
        title: "Scores update",
        message: "Data was saved",
        color: "teal",
        icon: <CheckboxIcon />,
        autoClose: 2000,
      });
      setAccItemScoresUpdated(false);
    });
  };

  const updateScoreItem = (playerId, type, value) => {
    setAccItemScoresUpdated(true);
    playersCtx.updateProfilePlayerScore(playerId, type, value);
  };

  const getAttackScore = (scoredPlayerId, type) => {
    if (profilePlayerScores != null) {
      const playerScoreObj = profilePlayerScores.find(
        (s) => s.playerId === scoredPlayerId
      );
      if (playerScoreObj !== undefined) {
        switch (type) {
          case "attack":
            return playerScoreObj.attack <= 10
              ? playerScoreObj.attack * 10
              : playerScoreObj.attack;
          case "defense":
            return playerScoreObj.defense <= 10
              ? playerScoreObj.defense * 10
              : playerScoreObj.defense;
          case "stamina":
            if (playerScoreObj.stamina !== undefined)
              return playerScoreObj.stamina;
            else if (playerScoreObj.construction !== undefined)
              return Math.ceil(
                ((playerScoreObj.construction +
                  playerScoreObj.resistence +
                  playerScoreObj.technique) *
                  10) /
                  3
              );
            break;
          default:
            break;
        }
      }
    }
    return 0;
  };

  return (
    <Fragment>
      <Accordion
        initialItem={initialItemIndex}
        iconPosition="right"
        onChange={onAccordionChanged}
      >
        {players
          .filter((p) => p.id !== profileId)
          .map((player) => (
            <Accordion.Item
              key={player.id}
              label={
                <AccordionLabel
                  image={player.imgSrc}
                  attack={getAttackScore(player.id, "attack")}
                  defense={getAttackScore(player.id, "defense")}
                  stamina={getAttackScore(player.id, "stamina")}
                  label={player.name}
                />
              }
              onToggle
            >
              <Text>Atac</Text>
              <Slider
                color="red"
                min={11}
                defaultValue={getAttackScore(player.id, "attack")}
                onChange={(value) =>
                  updateScoreItem(player.id, "attack", value)
                }
              />
              <Text>Defense</Text>
              <Slider
                color="green"
                min={11}
                defaultValue={getAttackScore(player.id, "defense")}
                onChange={(value) =>
                  updateScoreItem(player.id, "defense", value)
                }
              />
              <Text>Stamina</Text>
              <Slider
                min={11}
                defaultValue={getAttackScore(player.id, "stamina")}
                onChange={(value) =>
                  updateScoreItem(player.id, "stamina", value)
                }
              />
            </Accordion.Item>
          ))}
      </Accordion>
      {accItemScoresUpdated && (
        <div className={classes.actions}>
          <Button
            type="button"
            color="indigo"
            ml={10}
            onClick={saveClickHandler}
          >
            Save
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default PlayerList;
