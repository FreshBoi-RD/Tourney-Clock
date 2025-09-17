import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function App() {
  const [group, setGroup] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dateTime, setDateTime] = useState(dayjs());
  const [scheduled, setScheduled] = useState([]);

  // Load existing scheduled messages on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then((res) => res.json())
      .then((data) => setScheduled(data))
      .catch((err) => console.error("Failed to load messages:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      group,
      message,
      dateTime: dateTime.toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setScheduled((prev) => [...prev, data]);
      setGroup("");
      setMessage("");
      setImage(null);
      setDateTime(dayjs());
      alert("Message Scheduled Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule message");
    }
  };

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: "DELETE",
      });
      setScheduled((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel message");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Poker Notifications Admin Panel
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              select
              label="Select Group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
            >
              <MenuItem value="Group A">Sliver Coin - Hamilton</MenuItem>
              <MenuItem value="Group B">Lucky Fox - Florence</MenuItem>
              <MenuItem value="Group C">Rustic Hut - Florence</MenuItem>
            </TextField>

            <TextField
              label="Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button variant="outlined" component="label">
              {image ? "Image Selected" : "Upload Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Button>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Send Date & Time"
                value={dateTime}
                onChange={(newValue) => setDateTime(newValue)}
              />
            </LocalizationProvider>

            <Button type="submit" variant="contained" color="primary">
              Schedule Message
            </Button>
          </Stack>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Scheduled Messages
      </Typography>

      <Stack spacing={2}>
        {scheduled.map((m) => (
          <Paper key={m.id} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1">{m.group}</Typography>
            <Typography>{m.message}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(m.dateTime).toLocaleString()}
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={() => handleCancel(m.id)}
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
export default App;