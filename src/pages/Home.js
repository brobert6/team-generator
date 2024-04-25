import { Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ paddingTop: "100px" }}>
      <center>
        Contact site administrator (
        <a href="mailto:brobert6@gmail.com?subject=Teams generator">
          brobert6@gmail.com
        </a>
        ) to set up your teams
        <Anchor component={Link} to="/waldorf">
          Waldorf
        </Anchor>
        |
        <Anchor component={Link} to="/scoala18">
          The boys
        </Anchor>
        |
        <Anchor component={Link} to="/montran">
          Montran
        </Anchor>
      </center>
    </div>
  );
};

export default HomePage;
