import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Fragment, useState } from "react/cjs/react.development";
import { getCombinations } from "../../general/helpers";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import PlayerItem from "./PlayerItem";
import classes from "./PlayerList.module.css";

const PlayerList = (props) => {
  const theme = useMantineTheme();
  const [matchNumber, setMatchNumber] = useState(1);
  const [bestMatchups, setBestMatchups] = useState([]);

  const allPlayers = props.players;

  useEffect(() => {
    let n = props.selectedPlayers.length;
    let r = Math.floor(n / 2);
    let teamCombinations = [];
    getCombinations(props.selectedPlayers, n, r, teamCombinations);

    let sortedTeamCombinations = teamCombinations.map((team) => ({
      ...team,
      difference: Math.abs(
        team.attackA +
          team.defenseA +
          team.staminaA -
          team.attackB -
          team.defenseB -
          team.staminaB
      ),
    }));
    sortedTeamCombinations = sortedTeamCombinations
      .sort((a, b) => parseFloat(a.difference) - parseFloat(b.difference))
      .slice(0, 5);

    setBestMatchups(sortedTeamCombinations);
    setMatchNumber(1);
  }, [props.selectedPlayers]);

  let matchTeam = bestMatchups[matchNumber - 1];
  if (matchTeam !== undefined) {
    matchTeam.teamAtotalScore =
      matchTeam.attackA + matchTeam.defenseA + matchTeam.staminaA;
    matchTeam.teamBtotalScore =
      matchTeam.attackB + matchTeam.defenseB + matchTeam.staminaB;
  }

  const teamA = props.selectedPlayers.filter(
    (p) => matchTeam.teamAIds.indexOf(p.id) >= 0
  );

  const teamB = props.selectedPlayers.filter(
    (p) => matchTeam.teamBIds.indexOf(p.id) >= 0
  );

  if (bestMatchups.length >= matchNumber) {
    teamA.attack = Math.floor(
      bestMatchups[matchNumber - 1].attackA /
        bestMatchups[matchNumber - 1].teamAIds.length
    );
    teamA.defense = Math.floor(
      bestMatchups[matchNumber - 1].defenseA /
        bestMatchups[matchNumber - 1].teamAIds.length
    );
    teamA.stamina = Math.floor(
      bestMatchups[matchNumber - 1].staminaA /
        bestMatchups[matchNumber - 1].teamAIds.length
    );

    teamB.attack = Math.floor(
      bestMatchups[matchNumber - 1].attackB /
        bestMatchups[matchNumber - 1].teamBIds.length
    );
    teamB.defense = Math.floor(
      bestMatchups[matchNumber - 1].defenseB /
        bestMatchups[matchNumber - 1].teamBIds.length
    );
    teamB.stamina = Math.floor(
      bestMatchups[matchNumber - 1].staminaB /
        bestMatchups[matchNumber - 1].teamBIds.length
    );
  }

  const onNextHandler = () => {
    setMatchNumber(matchNumber + 1);
  };

  const onPrevHandler = () => {
    setMatchNumber(matchNumber - 1);
  };

  const getMatchPercentage = () => {
    return (
      matchTeam.teamAtotalScore < matchTeam.teamBtotalScore
        ? (matchTeam.teamAtotalScore / matchTeam.teamBtotalScore) * 100
        : (matchTeam.teamBtotalScore / matchTeam.teamAtotalScore) * 100
    ).toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Fragment>
      <ul className={classes.list}>
        {allPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            id={player.id}
            name={player.name}
            attack={player.attack}
            defense={player.defense}
            stamina={player.stamina}
            imgSrc={player.imgSrc}
            activeClass="info"
          />
        ))}
      </ul>

      {teamA.length > 1 && (
        <Grid>
          <Grid.Col md={12}>
            <Divider
              my="xs"
              label="Generated teams"
              labelPosition="center"
              variant="dashed"
            />
            <Box
              sx={(theme) => ({
                textAlign: "center",
                padding: "10px 0 0 0",
                fontWeight: "bold",
              })}
            >
              <ActionIcon
                onClick={onPrevHandler}
                disabled={matchNumber === 1}
                style={{ float: "left", marginLeft: "10px" }}
              >
                <BsFillArrowLeftCircleFill
                  size="40"
                  color={matchNumber === 1 ? "#ced4da" : "#228be6"}
                />
              </ActionIcon>
              #{matchNumber} Best matchup {getMatchPercentage()}%
              <ActionIcon
                onClick={onNextHandler}
                disabled={matchNumber >= 5}
                style={{ float: "right", marginRight: "10px" }}
              >
                <BsFillArrowRightCircleFill
                  size="40"
                  color={matchNumber >= 5 ? "#ced4da" : "#228be6"}
                />
              </ActionIcon>
            </Box>
          </Grid.Col>
          <Grid.Col md={6}>
            <Card shadow="sm" padding="lg" style={{ paddingTop: 0 }}>
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <div style={{ width: "100%" }}>
                  <Badge
                    variant="filled"
                    style={{
                      backgroundColor: "#bfefe1",
                      padding: "18px 6px 18px 7px",
                      float: "right",
                    }}
                  >
                    <Text
                      size="md"
                      weight={700}
                      style={{ float: "left" }}
                      color="black"
                      styles={{ textTransform: "none !important" }}
                    >
                      Team A <small>({matchTeam.teamAtotalScore})</small>
                    </Text>
                    <div className={classes.divcircle}>
                      <CircularProgressbar
                        value={teamA.stamina}
                        text={`${teamA.stamina}`}
                        styles={buildStyles({
                          pathColor: `rgba(34, 139, 230, ${
                            teamA.stamina / 100
                          })`,
                          textColor: "#228be6",
                          textSize: "40px",
                        })}
                      />
                    </div>
                    <div className={classes.divcircle}>
                      <CircularProgressbar
                        value={teamA.defense}
                        text={`${teamA.defense}`}
                        styles={buildStyles({
                          pathColor: `rgba(64, 192, 87, ${
                            teamA.defense / 100
                          })`,
                          textColor: "#40c057",
                          textSize: "40px",
                        })}
                      />
                    </div>
                    <div className={classes.divcircle}>
                      <CircularProgressbar
                        value={teamA.attack}
                        text={`${teamA.attack}`}
                        styles={buildStyles({
                          pathColor: `rgba(250, 82, 82, ${teamA.attack / 100})`,
                          textColor: "#fa5252",
                          textSize: "40px",
                        })}
                      />
                    </div>
                  </Badge>
                </div>
                <ul className={classes.list}>
                  {teamA.map((player) => (
                    <PlayerItem
                      key={player.id}
                      id={player.id}
                      name={player.name}
                      attack={player.attack}
                      defense={player.defense}
                      stamina={player.stamina}
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
            <Card shadow="sm" padding="lg" style={{ paddingTop: 0 }}>
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <Badge
                  color="yellow"
                  variant="filled"
                  size="lg"
                  style={{
                    backgroundColor: "#f7e5b0",
                    padding: "18px 6px 18px 7px",
                  }}
                >
                  <Text
                    size="md"
                    weight={700}
                    style={{ float: "left" }}
                    color="black"
                  >
                    Team B <small>({matchTeam.teamBtotalScore})</small>
                  </Text>
                  <div className={classes.divcircle}>
                    <CircularProgressbar
                      value={teamB.stamina}
                      text={`${teamB.stamina}`}
                      styles={buildStyles({
                        pathColor: `rgba(34, 139, 230, ${teamB.stamina / 100})`,
                        textColor: "#228be6",
                        textSize: "40px",
                      })}
                    />
                  </div>
                  <div className={classes.divcircle}>
                    <CircularProgressbar
                      value={teamB.defense}
                      text={`${teamB.defense}`}
                      styles={buildStyles({
                        pathColor: `rgba(64, 192, 87, ${teamB.defense / 100})`,
                        textColor: "#40c057",
                        textSize: "40px",
                      })}
                    />
                  </div>
                  <div className={classes.divcircle}>
                    <CircularProgressbar
                      value={teamB.attack}
                      text={`${teamB.attack}`}
                      styles={buildStyles({
                        pathColor: `rgba(250, 82, 82, ${teamB.attack / 100})`,
                        textColor: "#fa5252",
                        textSize: "40px",
                      })}
                    />
                  </div>
                </Badge>

                <ul className={classes.list}>
                  {teamB.map((player) => (
                    <PlayerItem
                      key={player.id}
                      id={player.id}
                      name={player.name}
                      attack={player.attack}
                      defense={player.defense}
                      stamina={player.stamina}
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
      )}
    </Fragment>
  );
};

export default PlayerList;
