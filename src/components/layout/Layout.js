import MainNavigation from "./MainNavigation";

import classes from "./Layout.module.css";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Title,
  useMantineTheme,
} from "@mantine/core";

import { useState } from "react";

const Layout = (props) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      padding="md"
      header={
        <Header height={70} padding="md" style={{ backgroundColor: "#e7e7e7" }}>
          {/* Handle other responsive styles with MediaQuery component or createStyles function */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Title order={3} style={{ color: "#777" }}>
              Balanced Team Generator
            </Title>
          </div>
        </Header>
      }
      navbar={
        <Navbar
          padding="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          hidden={!opened}
          // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          // viewport size > theme.breakpoints.sm – width is 300px
          // viewport size > theme.breakpoints.lg – width is 400px
          width={{ sm: 300, lg: 400 }}
        >
          <MainNavigation />
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <main className={classes.main}>{props.children}</main>
    </AppShell>
  );
};

export default Layout;
