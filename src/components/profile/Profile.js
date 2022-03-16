import { Group, Avatar, Text, Select, CheckboxIcon } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { forwardRef, Fragment, useContext } from "react";
import PlayersContext from "../../store/player-context";
import EditPlayerForm from "./EditPlayerForm";
import { useParams, useHistory } from "react-router-dom";
import { getApiUrl } from "../../general/helpers";

const Profile = () => {
  const playersCtx = useContext(PlayersContext);
  const notifications = useNotifications();
  const params = useParams();
  const history = useHistory();

  const playerId = playersCtx.profileId;

  if (playersCtx.players === null || playersCtx.players.length === 0)
    history.replace(`/${params.team}/`);

  const selectData = playersCtx.players
    .map((player) => {
      return {
        id: player.id,
        image: player.imgSrc,
        label: player.name,
        value: player.id,
      };
    })
    .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));

  const SelectItem = forwardRef(({ id, image, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  ));

  const onProfileIdChanged = (value) => {
    if (value !== null) {
      debugger;
      //save prev scores to context:players
      const prevPlayer = playersCtx.players.find(
        (x) => x.id === playersCtx.profileId
      );
      const updatedPrevPlayer = {
        ...prevPlayer,
        playerScores: playersCtx.profilePlayerScores,
      };
      const allPlayersUpdated = [
        ...playersCtx.players.filter((p) => p.id !== playersCtx.profileId),
        updatedPrevPlayer,
      ];
      playersCtx.loadPlayers(allPlayersUpdated);

      playersCtx.updateProfileId(value);
      localStorage.setItem("PlayerId", value);

      const currentPlayer = playersCtx.players.find((x) => x.id === value);
      playersCtx.updateProfileName(currentPlayer.name);
      playersCtx.updateProfileImgSrc(currentPlayer.imgSrc);

      //load new scores
      console.log(
        value,
        playersCtx.players.find((p) => p.id === value).playerScores
      );
      playersCtx.loadProfilePlayerScores(
        playersCtx.players.find((p) => p.id === value).playerScores
      );
    }
  };

  const onProfileChanged = (newName, imgSrc) => {
    const currentPlayer = playersCtx.players.find((x) => x.id === playerId);
    const updatedPlayer = { ...currentPlayer, name: newName, imgSrc: imgSrc };

    playersCtx.updateProfileName(updatedPlayer.name);
    playersCtx.updateProfileImgSrc(updatedPlayer.imgSrc);

    fetch(
      getApiUrl(params.team).replace(".json", "") +
        "/" +
        updatedPlayer.id +
        ".json",
      {
        method: "PUT",
        body: JSON.stringify(updatedPlayer),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      const allPlayersUpdated = [
        ...playersCtx.players.filter((p) => p.id !== playerId),
        updatedPlayer,
      ];

      playersCtx.loadPlayers(allPlayersUpdated);

      notifications.showNotification({
        title: "Profile update",
        message: "Data was saved",
        color: "teal",
        icon: <CheckboxIcon />,
        autoClose: 2000,
      });

      history.push(`/${params.team}-manage`);
    });
  };

  return (
    <Fragment>
      <Select
        label="Choose profile"
        placeholder="Identify yourself"
        itemComponent={SelectItem}
        data={selectData}
        value={playerId}
        //searchable
        maxDropdownHeight={400}
        nothingFound="Nobody here"
        // filter={(value, item) =>
        //   item.label.toLowerCase().includes(value.toLowerCase().trim())
        // }
        onChange={onProfileIdChanged}
        //clearable
      />

      {playerId !== null && (
        <EditPlayerForm id={playerId} onUpdatePlayer={onProfileChanged} />
      )}
    </Fragment>
  );
};

export default Profile;
