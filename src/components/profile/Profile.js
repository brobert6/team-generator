import { Group, Avatar, Text, Select, CheckboxIcon } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { forwardRef, Fragment, useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PlayersContext from "../../store/player-context";
import EditPlayerForm from "./EditPlayerForm";
import { API_URL } from "../../config";

const Profile = () => {
  const playersCtx = useContext(PlayersContext);
  const notifications = useNotifications();

  const playerId = playersCtx.profileId;

  const history = useHistory();
  if (playersCtx.players === null || playersCtx.players.length === 0)
    history.replace("/");

  const selectData = playersCtx.players.map((player) => {
    return {
      id: player.id,
      image: player.imgSrc,
      label: player.name,
      value: player.id,
    };
  });

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
      playersCtx.updateProfileId(value);
      localStorage.setItem("PlayerId", value);

      const currentPlayer = playersCtx.players.find((x) => x.id === value);
      playersCtx.updateProfileName(currentPlayer.name);
      playersCtx.updateProfileImgSrc(currentPlayer.imgSrc);

      //save prev scores to context:players
      const updatedPlayer = {
        ...currentPlayer,
        playerScores: playersCtx.playerScores,
      };
      const allPlayersUpdated = [
        ...playersCtx.players.filter((p) => p.id !== value),
        updatedPlayer,
      ];
      playersCtx.loadPlayers(allPlayersUpdated);

      //load new scores
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

    fetch(API_URL.replace(".json", "") + "/" + updatedPlayer.id + ".json", {
      method: "PUT",
      body: JSON.stringify(updatedPlayer),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
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
