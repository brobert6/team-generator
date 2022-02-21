import { Group, Avatar, Text, Accordion, Slider } from "@mantine/core";
import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

const PlayerList = (props) => {
  const getAttackScore = (scoredPlayerId, type) => {
    const currentPlayerData = props.players.find((p) => p.id == props.playerId);
    if (
      currentPlayerData !== undefined &&
      currentPlayerData.playerScores !== undefined
    ) {
      const playerScoreObj = currentPlayerData.playerScores.find(
        (score) => score.playerId === scoredPlayerId
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
        }
      }
    }
    return 0;
  };

  const [initialItemIndex, setInitialItemIndex] = useState(0);

  const onAccordionChanged = (state) => {
    for (let i = 0; i < props.players.length; i++) {
      if (state[i] === true) {
        setInitialItemIndex(i);
        break;
      }
    }
  };

  return (
    <Accordion
      initialItem={initialItemIndex}
      iconPosition="right"
      onChange={onAccordionChanged}
    >
      {props.players
        .filter((p) => p.id !== props.playerId)
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
          >
            <Text>Atac</Text>
            <Slider
              color="red"
              min={11}
              defaultValue={getAttackScore(player.id, "attack")}
            />
            <Text>Defense</Text>
            <Slider
              color="green"
              min={11}
              defaultValue={getAttackScore(player.id, "defense")}
            />
            <Text>Stamina</Text>
            <Slider
              min={10}
              defaultValue={getAttackScore(player.id, "stamina")}
            />
          </Accordion.Item>
        ))}
    </Accordion>
  );
};

export default PlayerList;
