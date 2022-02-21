import { ActionIcon, Avatar } from "@mantine/core";

import classes from "./ProfileIcon.module.css";

const ProfileIcon = (props) => {
  const onClickHandler = () => {
    return props.onAvatarClicked(props.imgSrc);
  };

  return (
    <ActionIcon onClick={onClickHandler} className={classes.actionicon}>
      <Avatar
        src={props.imgSrc}
        radius="xl"
        size="lg"
        style={{
          backgroundColor: props.isSelected ? "#5481a9" : "transparent",
        }}
      />
    </ActionIcon>
  );
};

export default ProfileIcon;
