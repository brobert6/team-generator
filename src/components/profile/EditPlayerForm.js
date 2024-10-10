import { Button, TextInput } from "@mantine/core";
import { Fragment, useContext, useEffect, useState } from "react";
import PlayersContext from "../../store/player-context";
import Card from "../ui/Card";
import classes from "./EditPlayerForm.module.css";
import ProfileIcon from "./ProfileIcon";

const ICONS_LIST = [
  "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
  "https://img.icons8.com/clouds/2x/homer-simpson.png",
  "https://img.icons8.com/clouds/256/000000/futurama-mom.png",
  "https://img.icons8.com/clouds/2x/spongebob-squarepants.png",
  "https://img.icons8.com/clouds/2x/mando.png",
  "https://img.icons8.com/clouds/2x/stormtrooper.png",
  "https://img.icons8.com/clouds/2x/kokichi.png",
  "https://img.icons8.com/clouds/2x/Bakugou.png",
  "https://img.icons8.com/bubbles/2x/walter-white.png",
  "https://img.icons8.com/clouds/2x/super-mario.png",
  "https://img.icons8.com/clouds/2x/anonymous-mask.png",
  "https://img.icons8.com/clouds/2x/jake.png",
  "https://img.icons8.com/clouds/2x/nurse-female.png",
  "https://img.icons8.com/clouds/2x/camo-cream.png",
  "https://img.icons8.com/clouds/2x/user-female.png",
  "https://img.icons8.com/clouds/2x/user-male.png",
  "https://img.icons8.com/clouds/2x/winner.png",
  "https://img.icons8.com/clouds/2x/gender-neutral-user.png",
  "https://img.icons8.com/clouds/2x/santa.png",
  "https://img.icons8.com/clouds/2x/champagne-bottle.png",
  "https://img.icons8.com/clouds/2x/edvard-munch.png",
  "https://img.icons8.com/clouds/2x/frida-kahlo.png",
  "https://img.icons8.com/clouds/2x/fraud.png",
  "https://img.icons8.com/clouds/2x/comedy.png",
  "https://img.icons8.com/clouds/2x/cocktail.png",
  "https://img.icons8.com/clouds/2x/coconut-cocktail.png",
  "https://img.icons8.com/clouds/2x/moonshine-jug.png",
  "https://img.icons8.com/clouds/2x/the-toast.png",
  "https://img.icons8.com/clouds/2x/bar.png",
  "https://img.icons8.com/clouds/2x/mate.png",
  "https://img.icons8.com/clouds/2x/beer.png",
  "https://img.icons8.com/clouds/2x/milk-bottle--v1.png",
  "https://img.icons8.com/clouds/2x/milkshake.png",
  "https://img.icons8.com/clouds/2x/tea-cup.png",
  "https://img.icons8.com/clouds/2x/drink-time.png",
  "https://img.icons8.com/clouds/2x/energy-drink.png",
];

const EditPlayerForm = (props) => {
  const playersCxt = useContext(PlayersContext);

  useEffect(() => {
    const currentPlayer = playersCxt.players.find((p) => p.id === props.id);
    setName(currentPlayer === undefined ? "" : currentPlayer.name);
    setImgSrc(currentPlayer === undefined ? "" : currentPlayer.imgSrc);
  }, [props.id, playersCxt.players]);

  const [name, setName] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const onAvatarClickedHandler = (value) => {
    setImgSrc(value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    props.onUpdatePlayer(name, imgSrc);
  };

  return (
    <Fragment>
      <hr style={{ marginBottom: "20px" }} />
      <Card>
        <form className={classes.form} onSubmit={submitHandler}>
          <TextInput
            required
            label="Name"
            placeholder="Player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {ICONS_LIST.map((item) => (
            <ProfileIcon
              key={item}
              imgSrc={item}
              isSelected={item === imgSrc}
              onAvatarClicked={onAvatarClickedHandler}
            />
          ))}

          <div className={classes.actions}>
            <Button type="submit" color="indigo" ml={10}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default EditPlayerForm;
