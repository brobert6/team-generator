import { useRef, useState } from "react";
import Card from "../ui/Card";
import classes from "./NewPlayerForm.module.css";

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

    console.log(enteredName);
    setAddingPlayer(false);
  };

  return (
    <Card>
      {!addingPlayer && (
        <button onClick={addNewPlayerHandler}>Add New Player</button>
      )}

      {addingPlayer && (
        <section>
          <h3>Add New Player</h3>

          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
              <label htmlFor="name">Name</label>
              <input type="text" required id="name" ref={nameInputRef} />
            </div>
            <div className={classes.actions}>
              <button onClick={cancelHandler}>Cancel</button>
              <button>Save</button>
            </div>
          </form>
        </section>
      )}
    </Card>
  );
};

export default NewPlayerForm;
