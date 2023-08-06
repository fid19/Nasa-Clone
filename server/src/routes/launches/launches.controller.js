const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}
async function httpAbortLaunch(req, res) {
  const launchId = req.params.id;
  const existingLaunch = await existsLaunchWithId(launchId);

  if (!existingLaunch) {
    return res.status(404).json({
      err: "Launch not found",
    });
  }

  //if launch does exit
  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log(launch);
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    console.log("Error");
    return res.status(400).json({
      err: "incomplete field",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch Date",
    });
  }

  scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
