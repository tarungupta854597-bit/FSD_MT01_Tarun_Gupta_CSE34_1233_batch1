const http = require("http");
const app = require("./expressApp");
const PORT = 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
