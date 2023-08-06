const express = require("express");
const launchRouter = require("./launches/launches.router");
const planetsRouter = require("./planets/planets.router");

const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchRouter);

module.exports = api;
