import { Badge, Card, Grid, Group, useMantineTheme } from "@mantine/core";
import { Fragment } from "react/cjs/react.development";
import PlayerItem from "./PlayerItem";
import classes from "./PlayerList.module.css";

const PlayerList = (props) => {
  const theme = useMantineTheme();

  const allPlayers = props.players;

  const teamA = [];
  const teamB = [];

  let i = 1;
  for (const player of props.selectedPlayers) {
    const currentPlayer = allPlayers.find((p) => p.id === player.id);
    if (i % 2 === 0) {
      teamA.push(currentPlayer);
    } else {
      teamB.push(currentPlayer);
    }
    i++;
  }

  return (
    <Fragment>
      <ul className={classes.list}>
        {allPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            id={player.id}
            name={player.name}
            imgSrc={player.imgSrc}
            activeClass="info"
          />
        ))}
      </ul>

      <Grid>
        <Grid.Col md={6}>
          <Card shadow="sm" padding="lg">
            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Badge color="green" variant="filled">
                Team A
              </Badge>
              <ul className={classes.list}>
                {teamA.map((player) => (
                  <PlayerItem
                    key={player.id}
                    id={player.id}
                    name={player.name}
                    imgSrc={player.imgSrc}
                    hideCheckbox={true}
                    activeClass="teama"
                  />
                ))}
              </ul>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col md={6}>
          <Card shadow="sm" padding="lg">
            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Badge color="yellow" variant="filled">
                Team B
              </Badge>
              <ul className={classes.list}>
                {teamB.map((player) => (
                  <PlayerItem
                    key={player.id}
                    id={player.id}
                    name={player.name}
                    imgSrc={player.imgSrc}
                    hideCheckbox={true}
                    activeClass="teamb"
                  />
                ))}
              </ul>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Fragment>
  );
};

export default PlayerList;
