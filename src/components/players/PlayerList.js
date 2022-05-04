import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxIcon,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useEffect } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Fragment, useState } from "react";
import { getApiUrl, getCombinations } from "../../general/helpers";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
} from "react-icons/hi";

import PlayerItem from "./PlayerItem";
import classes from "./PlayerList.module.css";
import { useNotifications } from "@mantine/notifications";

const PlayerList = (props) => {
  const theme = useMantineTheme();
  const [matchNumber, setMatchNumber] = useState(1);
  const [bestMatchups, setBestMatchups] = useState([]);
  const [teamWon, setTeamWon] = useState(null);
  const [skippedPlayerIds, setSkippedPlayerIds] = useState([]);
  const notifications = useNotifications();
  const [teamWinner, setTeamWinner] = useState([]);
  const [teamLooser, setTeamLooser] = useState([]);

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
          team.staminaA +
          team.winsA -
          team.attackB -
          team.defenseB -
          team.staminaB -
          team.winsB
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
      matchTeam.attackA +
      matchTeam.defenseA +
      matchTeam.staminaA +
      matchTeam.winsA;
    matchTeam.teamBtotalScore =
      matchTeam.attackB +
      matchTeam.defenseB +
      matchTeam.staminaB +
      matchTeam.winsB;
  }

  let teamA = [];
  let teamB = [];

  if (matchTeam !== undefined) {
    teamA = props.selectedPlayers.filter(
      (p) => matchTeam.teamAIds.indexOf(p.id) >= 0
    );
    teamB = props.selectedPlayers.filter(
      (p) => matchTeam.teamBIds.indexOf(p.id) >= 0
    );
  }

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
    teamA.wins = Math.floor(
      bestMatchups[matchNumber - 1].winsA /
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
    teamB.wins = Math.floor(
      bestMatchups[matchNumber - 1].winsB /
        bestMatchups[matchNumber - 1].teamBIds.length
    );
  }

  const onNextHandler = () => {
    setMatchNumber(matchNumber + 1);
  };

  const onPrevHandler = () => {
    setMatchNumber(matchNumber - 1);
  };

  const wonTeamMemberChanged = (playerId, checked) => {
    setSkippedPlayerIds((prevIds) => {
      if (checked) return prevIds.filter((p) => p !== playerId);
      else return [...prevIds, playerId];
    });
  };

  const updateTeamWon = (winnerTeam) => {
    setTeamWinner(winnerTeam === "A" ? teamA : teamB);
    setTeamLooser(winnerTeam === "B" ? teamA : teamB);
    setTeamWon(winnerTeam);
  };

  const moveMatchEndedPlayer = (playerId, won) => {
    if (won) {
      const playerToMove = teamWinner.find((p) => p.id === playerId);
      setTeamWinner(teamWinner.filter((p) => p.id !== playerId));
      let tmp = teamLooser;
      tmp.push(playerToMove);
      setTeamLooser(tmp);
    } else {
      const playerToMove = teamLooser.find((p) => p.id === playerId);
      setTeamLooser(teamLooser.filter((p) => p.id !== playerId));
      let tmp = teamWinner;
      tmp.push(playerToMove);
      setTeamWinner(tmp);
    }
  };

  const isPlayerSkipped = (playerId) => {
    return skippedPlayerIds.indexOf(playerId) >= 0;
  };

  const teamWonSubmitHandler = (event) => {
    event.preventDefault();
    const winnerPlayerIds = teamWinner
      .map((player) => {
        return player.id;
      })
      .filter((p) => skippedPlayerIds.indexOf(p) === -1);
    const loserPlayerIds = teamLooser
      .map((player) => {
        return player.id;
      })
      .filter((p) => skippedPlayerIds.indexOf(p) === -1);

    updateTeamWon(null);

    fetch(
      getApiUrl(props.team).replace(".json", "") +
        "/wins/" +
        new Date().toISOString().slice(0, 10) +
        ".json",
      {
        method: "PUT",
        body: JSON.stringify(winnerPlayerIds),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      fetch(
        getApiUrl(props.team).replace(".json", "") +
          "/losses/" +
          new Date().toISOString().slice(0, 10) +
          ".json",
        {
          method: "PUT",
          body: JSON.stringify(loserPlayerIds),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() => {
        notifications.showNotification({
          title: "Game registered",
          message: "Data was saved/overwritten",
          color: "teal",
          icon: <CheckboxIcon />,
          autoClose: 4000,
        });
      });
    });
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
            wins={player.wins}
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
              {teamA.length === teamB.length ? (
                <span>
                  #{matchNumber} Best matchup {getMatchPercentage()}%
                </span>
              ) : (
                <span>{`${teamA.length} vs ${teamB.length} team setup!`}</span>
              )}

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
            <Card
              shadow="sm"
              padding="lg"
              style={{ paddingTop: 0 }}
              className={teamA.length !== teamB.length ? classes.incorrect : ""}
            >
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <div style={{ width: "100%" }}>
                  <Tooltip label="Team won the match!" withArrow color="green">
                    <ActionIcon
                      onClick={() => {
                        updateTeamWon("A");
                      }}
                    >
                      <Avatar
                        src="https://img.icons8.com/color/72/man-winner.png"
                        radius="xl"
                        size="md"
                        style={{ float: "left" }}
                      />
                    </ActionIcon>
                  </Tooltip>

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
                      wins={player.wins}
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
            <Card
              shadow="sm"
              padding="lg"
              style={{ paddingTop: 0 }}
              className={teamA.length !== teamB.length ? classes.incorrect : ""}
            >
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <div style={{ width: "100%" }}>
                  <Badge
                    color="yellow"
                    variant="filled"
                    size="lg"
                    style={{
                      backgroundColor: "#f7e5b0",
                      padding: "18px 6px 18px 7px",
                      float: "left",
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
                          pathColor: `rgba(34, 139, 230, ${
                            teamB.stamina / 100
                          })`,
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
                          pathColor: `rgba(64, 192, 87, ${
                            teamB.defense / 100
                          })`,
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

                  <Tooltip
                    label="Team won the match!"
                    withArrow
                    color="green"
                    style={{ float: "right" }}
                  >
                    <ActionIcon
                      onClick={() => {
                        updateTeamWon("B");
                      }}
                    >
                      <Avatar
                        src="https://img.icons8.com/color/72/man-winner.png"
                        size="md"
                      />
                    </ActionIcon>
                  </Tooltip>
                </div>

                <ul className={classes.list}>
                  {teamB.map((player) => (
                    <PlayerItem
                      key={player.id}
                      id={player.id}
                      name={player.name}
                      attack={player.attack}
                      defense={player.defense}
                      stamina={player.stamina}
                      wins={player.wins}
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

      <Modal
        opened={teamWon !== null}
        onClose={() => updateTeamWon(null)}
        title="Match ended!"
      >
        <form className={classes.form} onSubmit={teamWonSubmitHandler}>
          <Card shadow="sm" padding="lg">
            <Card.Section>
              <Image
                src="https://ouch-cdn2.icons8.com/qy3WJCdPzSnwErRPWIiz0bIcJxJ3V5OWyCLRKAUazmc/rs:fit:512:512/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNDM2/L2Y1ZjA1ZGVkLTE4/OWYtNDIyZi1iNjc1/LWJhMjM0YTE3YWYz/NC5zdmc.png"
                height={200}
                fit="contain"
                alt="Winner"
              />
            </Card.Section>

            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Text weight={500}>Team {teamWon} won the match.</Text>
            </Group>

            <Text size="sm" style={{ lineHeight: 1.5 }}>
              By confirming you will register the result for these players that
              will slightly adjust their overall score!
            </Text>
            <Divider
              variant="dashed"
              label="Update scores"
              labelPosition="center"
              style={{ padding: "10px 0" }}
            />
            <div className={classes.row}>
              <div className={classes.col6}>
                <Text weight={500}>
                  Winners <HiOutlineChevronDoubleUp color="green" />
                </Text>
                <ul className={classes.list}>
                  {teamWinner.map((player) => (
                    <li
                      key={player.id}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Checkbox
                        key={player.id}
                        value={player.id}
                        label={player.name}
                        checked={!isPlayerSkipped(player.id)}
                        onChange={(event) => {
                          wonTeamMemberChanged(
                            player.id,
                            event.currentTarget.checked
                          );
                        }}
                        tabIndex={-1}
                        color="green"
                        style={{ padding: "5px 0 0 0" }}
                      />
                      <ActionIcon
                        onClick={() => {
                          moveMatchEndedPlayer(player.id, true);
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        <BsFillArrowRightCircleFill size="15" color="#fa5252" />
                      </ActionIcon>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={classes.col6}>
                <Text weight={500}>
                  Loosers <HiOutlineChevronDoubleDown color="red" />
                </Text>
                <ul className={classes.list}>
                  {teamLooser.map((player) => (
                    <li
                      key={player.id}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Checkbox
                        key={player.id}
                        value={player.id}
                        label={player.name}
                        checked={!isPlayerSkipped(player.id)}
                        onChange={(event) => {
                          wonTeamMemberChanged(
                            player.id,
                            event.currentTarget.checked
                          );
                        }}
                        tabIndex={-1}
                        color="red"
                        style={{ padding: "5px 0 0 0" }}
                      />
                      <ActionIcon
                        onClick={() => {
                          moveMatchEndedPlayer(player.id, false);
                        }}
                        style={{ marginLeft: "5px" }}
                      >
                        <BsFillArrowLeftCircleFill size="15" color="#40c057" />
                      </ActionIcon>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={classes.actions}>
              <Button type="submit" color="indigo" ml={10}>
                Save
              </Button>
            </div>
          </Card>
        </form>
      </Modal>
    </Fragment>
  );
};

export default PlayerList;
