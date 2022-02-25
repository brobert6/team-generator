import { useContext } from "react";
import PlayersContext from "../../store/player-context";
import { Checkbox, Group, Avatar, Text, Card } from "@mantine/core";
import classes from "./PlayerItem.module.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

const PlayerItem = (props) => {
  const playersCxt = useContext(PlayersContext);

  const playerIsSelected = playersCxt.itemIsSelectedPlayer(props.id);
  const attack = props.attack;
  const defense = props.defense;
  const stamina = props.stamina;

  function toggleSelectedPlayerHandler() {
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
        style={{ width: "100%", marginBottom: "10px", cursor: "pointer" }}
        className="mb-1"
        padding="sm"
      >
        <Group
          noWrap
          style={{ height: "25px", gap: "0px", marginLeft: "-10px" }}
        >
          <Avatar src={props.imgSrc} radius="xl" size="lg" />
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
