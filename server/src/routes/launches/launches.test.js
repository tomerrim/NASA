const request = require("supertest");
const app = require("../../app");

describe("TEST GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("TEST POST /launches", () => {

  const completeLaunchData = {
    mission: "IL Enterprise",
    rocket: "IL 2000-A",
    target: "Kepler-186 f",
    launchDate: "April 28, 2024",
  };

  const launchDataWithoutDate = {
    mission: "IL Enterprise",
    rocket: "IL 2000-A",
    target: "Kepler-186 f",
  };

  const launchDataWithInvalidDate = {
    mission: "IL Enterprise",
    rocket: "IL 2000-A",
    target: "Kepler-186 f",
    launchDate: "not a valid date",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
       .post("/launches")
       .send(launchDataWithoutDate)
       .expect("Content-Type", /json/)
       .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing Required launch property",
    });   
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    }); 
  });
});
