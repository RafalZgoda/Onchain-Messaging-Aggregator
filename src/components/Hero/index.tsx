import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
} from "@mantine/core";
import { Dots } from "./Dots";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(120),
    paddingBottom: rem(80),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export function HeroText() {
  const router = useRouter();

  const { classes } = useStyles();
  const {
    connector: activeConnector,
    isConnected,
    isConnecting,
  } = useAccount({
    onConnect({ isReconnected }) {
      if (!isReconnected) router.push("/chat");
    },
  });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <Container className={classes.wrapper} size={1400} mt={120}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Connecting{" "}
          <Text component="span" className={classes.highlight} inherit>
            Web3
          </Text>{" "}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Never miss another message in the crypto seas.
            <br></br>
          </Text>
        </Container>

        <div className={classes.controls}>
          <Link href="settings">
            <Button className={classes.control} size="lg">
              Apps
            </Button>
          </Link>
          {isConnected ? (
            <Link href="chat">
              <Button className={classes.control} size="lg">
                Chat
              </Button>
            </Link>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <Button
                    className={classes.control}
                    size="lg"
                    loading={isConnecting}
                    onClick={show}
                  >
                    Get started
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          )}
        </div>
      </div>
    </Container>
  );
}
