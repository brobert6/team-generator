import { Anchor, List, ThemeIcon } from "@mantine/core";
import { SiMicrosoftteams } from "react-icons/si";
import { RiTeamLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const MainNavigation = () => {
  return (
    <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <SiMicrosoftteams size={12} />
        </ThemeIcon>
      }
    >
      <List.Item>
        <Anchor component={Link} to="/">
          Generate teams
        </Anchor>
      </List.Item>
      <List.Item
        icon={
          <ThemeIcon color="blue" size={24} radius="xl">
            <RiTeamLine size={12} />
          </ThemeIcon>
        }
      >
        <Anchor component={Link} to="/manage">
          Score teammates
        </Anchor>
      </List.Item>
      <List.Item
        icon={
          <ThemeIcon color="blue" size={24} radius="xl">
            <CgProfile size={12} />
          </ThemeIcon>
        }
      >
        <Anchor component={Link} to="/profile">
          My Profile
        </Anchor>
      </List.Item>
    </List>
  );
};

export default MainNavigation;
