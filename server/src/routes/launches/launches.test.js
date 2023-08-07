const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    console.log("Hello Connect");
    await mongoConnect();
    await loadPlanetsData()
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    test("It should respond with 201 Created", async () => {
      const completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        launchDate: "January 4, 2028",
        target: "Kepler-62 f",
      };

      const launchDataWithoutrate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        target: "Kepler-62 f",
      };

      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestrate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestrate);
      expect(response.body).toMatchObject(launchDataWithoutrate);
    });
    test("It should catch missing required properties", () => {});
    test("It should catch invalid dates", () => {});

    afterAll(async () => {
      console.log("Hello Disconnect");
      await mongoDisconnect().then((res) => {
        console.log("Terminated");
      });
    });
  });
});
