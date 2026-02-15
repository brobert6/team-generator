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
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getApiUrl, getPlayerScore } from "../../general/helpers";
import PlayersContext from "../../store/player-context";

import classes from "./PlayerList.module.css";

const AccordionLabel = ({
  label,
  image,
  attack,
  defense,
  stamina,
  onDelete,
  playerId,
  profileName,
}) => {
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
        {profileName === "Robert" && (
          <Button
            size="xs"
            color="red"
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(playerId, label);
            }}
            style={{ marginLeft: "auto" }}
          >
            Delete
          </Button>
        )}
      </div>
    </Group>
  );
};

const PlayerList = (props) => {
  const playersCtx = useContext(PlayersContext);
  const notifications = useNotifications();
  const params = useParams();

  const profileId = playersCtx.profileId;
  const players = playersCtx.players;
  const profilePlayerScores = playersCtx.profilePlayerScores;
  const initialItemIndex = playersCtx.initialItemIndex;

  const [accItemScoresUpdated, setAccItemScoresUpdated] = useState(false);

  const today = new Date().getDay();
  const disableScoring =
    playersCtx.groupName === "scoala18" && (today === 4 || today === 1);
  console.log("Disabling", disableScoring, playersCtx.groupName);

  //this shuld not run
  if (
    (playersCtx.profilePlayerScores === undefined ||
      playersCtx.profilePlayerScores.length === 0) &&
    playersCtx.players.find((p) => p.id === profileId).playerScores != null
  ) {
    playersCtx.loadProfilePlayerScores(
      playersCtx.players.find((p) => p.id === profileId).playerScores,
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
      getApiUrl(params.team).replace(".json", "") +
        "/" +
        profileId +
        "/playerScores.json",
      {
        method: "PUT",
        body: JSON.stringify(profilePlayerScores),
        headers: {
          "Content-Type": "application/json",
        },
      },
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
                  attack={getPlayerScore(
                    profilePlayerScores,
                    player.id,
                    "attack",
                  )}
                  defense={getPlayerScore(
                    profilePlayerScores,
                    player.id,
                    "defense",
                  )}
                  stamina={getPlayerScore(
                    profilePlayerScores,
                    player.id,
                    "stamina",
                  )}
                  label={player.name}
                  playerId={player.id}
                  onDelete={props.onDeletePlayer}
                  profileName={playersCtx.profileName}
                />
              }
              onToggle
            >
              <Text>Atac</Text>
              <Slider
                color="red"
                min={11}
                defaultValue={getPlayerScore(
                  profilePlayerScores,
                  player.id,
                  "attack",
                )}
                disabled={disableScoring}
                onChange={(value) =>
                  updateScoreItem(player.id, "attack", value)
                }
              />
              <Text>Defense</Text>
              <Slider
                color="green"
                min={11}
                defaultValue={getPlayerScore(
                  profilePlayerScores,
                  player.id,
                  "defense",
                )}
                disabled={disableScoring}
                onChange={(value) =>
                  updateScoreItem(player.id, "defense", value)
                }
              />
              <Text>Stamina</Text>
              <Slider
                min={11}
                defaultValue={getPlayerScore(
                  profilePlayerScores,
                  player.id,
                  "stamina",
                )}
                disabled={disableScoring}
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
