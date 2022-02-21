import { Button, TextInput } from "@mantine/core";
import { Fragment, useRef, useState } from "react";
import Card from "../ui/Card";
import classes from "./NewPlayerForm.module.css";
import { AiOutlineUserAdd } from "react-icons/ai";

const NewPlayerForm = (props) => {
  const [addingPlayer, setAddingPlayer] = useState(false);

  const nameInputRef = useRef();

  const addNewPlayerHandler = (event) => {
    setAddingPlayer(true);
  };

  const cancelHandler = (event) => {
    setAddingPlayer(false);
    nameInputRef.current.value = "";
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;

    props.onAddPlayer(enteredName);

    setAddingPlayer(false);
  };

  return (
    <Fragment>
      {!addingPlayer && (
        <Button
          leftIcon={<AiOutlineUserAdd />}
          onClick={addNewPlayerHandler}
          style={{ margin: "20px" }}
        >
          Add New Player
        </Button>
      )}

      {addingPlayer && (
        <Card>
          <form className={classes.form} onSubmit={submitHandler}>
            <TextInput
              required
              label="Name"
              placeholder="Player name"
              ref={nameInputRef}
            />

            {/* <div className={classes.control}>
              <label htmlFor="name">Name</label>
              <input type="text" required id="name" ref={nameInputRef} />
            </div> */}
            <div className={classes.actions}>
              <Button type="button" color="gray" onClick={cancelHandler}>
                Cancel
              </Button>
              <Button type="submit" color="indigo" ml={10}>
                Save
              </Button>
            </div>
          </form>
        </Card>
      )}
    </Fragment>
  );
};

export default NewPlayerForm;
