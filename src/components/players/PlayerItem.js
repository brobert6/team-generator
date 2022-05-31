import { useContext } from "react";
import PlayersContext from "../../store/player-context";
import { Checkbox, Group, Avatar, Text, Card, Indicator } from "@mantine/core";
import classes from "./PlayerItem.module.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { WINS_MULTIPLIER } from "../../config";

const PlayerItem = (props) => {
  const playersCxt = useContext(PlayersContext);

  const playerIsSelected = playersCxt.itemIsSelectedPlayer(props.id);

  const attack = Number.isNaN(props.attack) ? 0 : props.attack;
  const defense = Number.isNaN(props.defense) ? 0 : props.defense;
  const stamina = Number.isNaN(props.stamina) ? 0 : props.stamina;
  const wins = Number.isNaN(props.wins) ? 0 : props.wins;

  const winsMultiplier = WINS_MULTIPLIER;

  function toggleSelectedPlayerHandler() {
    if (props.hideCheckbox) return;
    if (playerIsSelected) {
      playersCxt.removeSelectedPlayer(props.id);
    } else {
      playersCxt.addSelectedPlayer({
        id: props.id,
        name: props.name,
        imgSrc: props.imgSrc,
        attack: attack,
        defense: defense,
        stamina: stamina,
        wins: wins,
      });
    }
  }

  return (
    <li
      className={
        playerIsSelected
          ? props.activeClass === "teama"
            ? classes.teama
            : props.activeClass === "teamb"
            ? classes.teamb
            : classes.info
          : classes.light
      }
      onClick={toggleSelectedPlayerHandler}
    >
      <Card
        shadow="sm"
        bg={playerIsSelected ? props.activeClass : "light"}
        text={playerIsSelected ? props.activeClass : "light"}
        style={{
          width: "100%",
          marginBottom: "10px",
          cursor: props.hideCheckbox ? "default" : "pointer",
        }}
        className="mb-1"
        padding="sm"
      >
        <Group
          noWrap
          style={{ height: "25px", gap: "0px", marginLeft: "-10px" }}
        >
          <Indicator
            inline
            offset={7}
            styles={{
              root: { color: props.wins >= 0 ? "green" : "red" },
              indicator: {
                color: props.wins >= 0 ? "green" : "red",
                fontWeight: 600,
              },
            }}
            label={props.wins / winsMultiplier}
          >
            <Avatar src={props.imgSrc} radius="xl" size="lg" />
          </Indicator>
          <div style={{ flex: 1, width: "100%" }}>
            <Text size="sm" weight={500} style={{ float: "left" }}>
              {props.name}
            </Text>
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
          {props.hideCheckbox !== true && (
            <Checkbox
              checked={playerIsSelected}
              onChange={() => {}}
              tabIndex={-1}
              style={{ marginLeft: "16px" }}
              // sx={{ pointerEvents: "none" }}
            />
          )}
        </Group>
      </Card>
    </li>
  );
};
export default PlayerItem;
