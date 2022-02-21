import { Group, Avatar, Text, Select } from "@mantine/core";
import { forwardRef, Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PlayersContext from "../../store/player-context";
import EditPlayerForm from "./EditPlayerForm";
import { API_URL } from "../../config";

const Profile = () => {
  const playersCxt = useContext(PlayersContext);

  const [playerId, setPlayerId] = useState(localStorage.getItem("PlayerId"));

  const history = useHistory();
  if (playersCxt.players === null || playersCxt.players.length === 0)
    history.replace("/");

  const selectData = playersCxt.players.map((player) => {
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
    setPlayerId(value);
    localStorage.setItem("PlayerId", value);
  };

  const onProfileChanged = (newName, imgSrc) => {
    const currentPlayer = playersCxt.players.find((x) => x.id === playerId);
    const updatedPlayer = { ...currentPlayer, name: newName, imgSrc: imgSrc };

    fetch(API_URL.replace(".json", "") + "/" + updatedPlayer.id + ".json", {
      method: "PUT",
      body: JSON.stringify(updatedPlayer),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("submitted...");

      const allPlayersUpdated = [
        ...playersCxt.players.filter((p) => p.id !== playerId),
        updatedPlayer,
      ];

      playersCxt.loadPlayers(allPlayersUpdated);
      //setIsLoading(true);
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
        searchable
        maxDropdownHeight={400}
        nothingFound="Nobody here"
        filter={(value, item) =>
          item.label.toLowerCase().includes(value.toLowerCase().trim())
        }
        onChange={onProfileIdChanged}
        clearable
      />

      {playerId !== null && (
        <EditPlayerForm id={playerId} onUpdatePlayer={onProfileChanged} />
      )}
    </Fragment>
  );
};

export default Profile;
