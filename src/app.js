const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Rowdy app is running successfully.\n");
});

server.listen(PORT, () => {
  console.log(`Rowdy app running on port ${PORT}`);
});