import { Link } from "react-router-dom";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Team generator</div>
      <nav>
        <li>
          <Link to="/manage">Team generator</Link>
        </li>
        <li>
          <Link to="/">Players</Link>
        </li>
      </nav>
    </header>
  );
};

export default MainNavigation;
