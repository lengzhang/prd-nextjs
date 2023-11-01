import { useAuthContext } from "@/context/AuthContext";
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  IconButton,
  ThemeProvider,
  Toolbar,
  Tooltip,
  createTheme,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import IconImage from "@/components/IconImage";
import { OnClickHandler } from "../types";
import { FC } from "react";
import { usePathname } from "next/navigation";

const PAGES = [
  { label: "Dashboard", href: "/" },
  { label: "Upload Reports", href: "/upload-reports" },
];

const PrivateAppBarAction: FC<{ handleSignOut: OnClickHandler }> = ({
  handleSignOut,
}) => {
  return (
    <Box marginLeft="auto">
      <Tooltip title="Profile">
        <IconButton LinkComponent={Link} href="/profile">
          <AccountBoxIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Sign out">
        <IconButton onClick={handleSignOut}>
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const PrivateAppBar = () => {
  const pathname = usePathname();
  const { handleSignOut } = useAuthContext();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: { mode: "dark", primary: { main: "#1976d2" } },
        typography: { button: { textTransform: "none" } },
      })}
    >
      <AppBar position="static" color="default">
        <Toolbar>
          <ButtonBase LinkComponent={Link} href="/home">
            <IconImage width={40} />
          </ButtonBase>
          <Box boxSizing="border-box">
            {PAGES.map(({ label, href }, index) => {
              const isCurrentPath = pathname === href;
              return (
                <Button
                  key={index + href}
                  color="inherit"
                  size="large"
                  LinkComponent={Link}
                  href={href}
                  style={{
                    borderWidth: 1,
                    borderBottom: "solid",
                    borderColor: isCurrentPath ? "inherit" : "transparent",
                    borderRadius: 0,
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
          <PrivateAppBarAction handleSignOut={handleSignOut} />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default PrivateAppBar;
