const express = require("express");
const app = express();

app.use(express.json());

let servers = [
  {
    id: 1,
    name: "Minecraft Server",
    status: "offline"
  }
];

app.get("/", (req, res) => {
  res.send(`
    <h1>Simple Server Panel</h1>
    <ul>
      ${servers.map(s => `
      <li>
        ${s.name} - ${s.status}
      </li>`).join("")}
    </ul>
  `);
});

app.get("/api/servers", (req, res) => {
  res.json(servers);
});

app.post("/api/start/:id", (req, res) => {
  const server = servers.find(s => s.id == req.params.id);

  if (!server)
    return res.status(404).json({ error: "Server tidak ditemukan" });

  server.status = "online";

  res.json({
    success: true,
    server
  });
});

app.post("/api/stop/:id", (req, res) => {
  const server = servers.find(s => s.id == req.params.id);

  if (!server)
    return res.status(404).json({ error: "Server tidak ditemukan" });

  server.status = "offline";

  res.json({
    success: true,
    server
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server berjalan di port", PORT);
});
