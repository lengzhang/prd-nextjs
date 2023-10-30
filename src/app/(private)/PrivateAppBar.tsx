import { useAuthContext } from "@/context/AuthContext";
import {
  AppBar,
  Box,
  ButtonBase,
  IconButton,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import IconImage from "@/components/IconImage";

const PrivateAppBar = () => {
  const { handleSignOut } = useAuthContext();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: { mode: "dark", primary: { main: "#1976d2" } },
      })}
    >
      <AppBar position="static">
        <Toolbar>
          <Stack width="100%" direction="row" justifyContent="space-between">
            <ButtonBase LinkComponent={Link} href="/home">
              <IconImage width={40} />
            </ButtonBase>
            <Box>
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
          </Stack>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default PrivateAppBar;
