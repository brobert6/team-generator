import { useContext } from "react";
import PlayersContext from "../../store/player-context";
import { Checkbox, Group, Avatar, Text, Card } from "@mantine/core";
import classes from "./PlayerItem.module.css";

const PlayerItem = (props) => {
  const playersCxt = useContext(PlayersContext);

  const playerIsSelected = playersCxt.itemIsSelectedPlayer(props.id);

  function toggleSelectedPlayerHandler() {
    if (playerIsSelected) {
      playersCxt.removeSelectedPlayer(props.id);
    } else {
      playersCxt.addSelectedPlayer({
        id: props.id,
        name: props.name,
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
        <Group noWrap style={{ height: "25px" }}>
          <Avatar
            src="https://img.icons8.com/clouds/256/000000/futurama-bender.png"
            radius="xl"
            size="lg"
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {props.name}
            </Text>
          </div>
          {props.hideCheckbox !== true && (
            <Checkbox
              checked={playerIsSelected}
              onChange={() => {}}
              tabIndex={-1}
              // sx={{ pointerEvents: "none" }}
            />
          )}
        </Group>
      </Card>
    </li>
  );
};
export default PlayerItem;
