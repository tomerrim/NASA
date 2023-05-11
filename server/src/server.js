const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const port = process.env.PORT || 8000;

//const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL = "mongodb://127.0.0.1:27017/nasa";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log(`MongoDB connection ready`);
});

mongoose.connection.on("error", (err) => {
  console.error(`Error: ${err}`);
});

async function startServer(){
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

startServer();