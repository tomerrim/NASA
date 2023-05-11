const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");

const defaultFlightNumber = 100;

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);
//launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesDataBase
  .find({},{"_id": 0, "__v": 0});
}

async function getLatestFlightNumber(){
  const latestLaunch = await launchesDataBase
  .findOne()
  .sort('-flightNumber');

  if(!latestLaunch){
    return defaultFlightNumber;
  }

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet){
    throw new Error("No matching planet found")
  }

  await launchesDataBase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  },launch,{
    upsert: true,
  });
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch,{
    success: true,
    upcoming: true,
    customers: ['ZTM','NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
