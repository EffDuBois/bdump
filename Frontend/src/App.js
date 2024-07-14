import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

function App() {
  return (
    <Stack
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#000000",
        color: "#ffffff",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          px: 7,
          py: 5,
          height: "30vh",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "space-between",
          bgcolor: "#1C1C1E",
          color: "#ffffff",
        }}
      >
        <Typography>Enter your command</Typography>
        <TextField
          color=""
          label="Enter Your Command"
          variant="filled"
          size="small"
        />
        <Button sx={{ bgcolor: "#D3B014" }} variant="contained">
          Submit
        </Button>
      </Paper>
    </Stack>
  );
}

export default App;
