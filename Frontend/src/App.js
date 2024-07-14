import {
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getNote } from "./api/getNote";

function App() {
  const [notes, setNotes] = useState("");
  const inputRef = useRef(null);

  const updateNotes = () => {
    getNote(inputRef.current.value).then((response) => {
      setNotes((prev) => prev + "\n" + response.data);
      inputRef.current.value = "";
    });
  };

  const submitCommand = (e) => {
    e.preventDefault();
    updateNotes();
  };
  return (
    <Stack
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#1C1C1E",
        color: "#ffffff",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          minWidth: "25vw",
          gap: 3,
          px: 7,
          py: 5,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
          bgcolor: "#000000",
          color: "#ffffff",
        }}
      >
        <Stack
          component="form"
          onSubmit={submitCommand}
          spacing={3}
          sx={{ flexGrow: 1 }}
        >
          <Typography variant="h5">Enter your command</Typography>
          <TextField
            sx={{
              // Root class for the input field
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                // Class for the border around the input field
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2e2e2e",
                  borderWidth: "2px",
                },
                "&.Mui-focused": {
                  color: "#fff",
                },
              },

              // Class for the label of the input field
              "& .MuiInputLabel-outlined": {
                color: "#2e2e2e",
                fontWeight: "bold",
              },
            }}
            label="Enter Your Commands & Notes"
            size="small"
            multiline={true}
            rows={5}
            inputRef={inputRef}
          />
          <Button type="submit" sx={{ bgcolor: "#D3B014" }} variant="contained">
            Add to Notes
          </Button>
          {notes && <Button onClick={() => setNotes("")}>Clear</Button>}
        </Stack>
        {notes && (
          <>
            <Divider orientation="vertical" sx={{ bgcolor: "white" }} />
            <Paper
              sx={{ width: "50vw", maxHeight: "80vh", p: 3, overflow: "auto" }}
            >
              <Typography variant="h6">My Notes</Typography>
              <ReactMarkdown>{notes}</ReactMarkdown>
            </Paper>
          </>
        )}
      </Paper>
    </Stack>
  );
}

export default App;
