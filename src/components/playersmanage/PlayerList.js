import classes from "./PlayerList.module.css";

import { Checkbox, Group, Avatar, Text } from "@mantine/core";

const PlayerList = (props) => {
  return (
    <ul className={classes.list}>
      {props.players.map((player) => (
        <Group noWrap>
          <Avatar
            src="https://img.icons8.com/clouds/256/000000/futurama-bender.png"
            radius="xl"
            size="lg"
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {player.name}
            </Text>
            {/* <Text size="xs" color="dimmed" weight={400}>
            {data.description}
          </Text> */}
            <Checkbox
              checked={false}
              onChange={() => {}}
              tabIndex={-1}
              sx={{ pointerEvents: "none" }}
            />
          </div>
        </Group>
      ))}
    </ul>
  );
};

export default PlayerList;
