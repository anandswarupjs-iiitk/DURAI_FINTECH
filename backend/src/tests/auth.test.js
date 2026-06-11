const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../app");
const User = require("../src/models/User");

const TEST_USER = {
  name: "Test User",
  email: "testuser@fraudguard.dev",
  password: "TestPass123!",
};

let accessToken;
let refreshToken;

// ========================
// DB SETUP
// ========================
beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb://localhost:27017/fraudguard_test"
  );

  await User.deleteMany({ email: TEST_USER.email });
});

afterAll(async () => {
  await User.deleteMany({ email: TEST_USER.email });
  await mongoose.connection.close();
});


// ========================
// REGISTER
// ========================
describe("POST /api/auth/register", () => {
  it("should register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it("should reject duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER);

    expect(res.status).toBe(409);
  });

  it("should reject weak password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "X",
        email: "x@test.com",
        password: "123",
      });

    expect(res.status).toBe(400);
  });
});


// ========================
// LOGIN
// ========================
describe("POST /api/auth/login", () => {
  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: TEST_USER.email,
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
  });
});


// ========================
// PROFILE
// ========================
describe("GET /api/auth/me", () => {
  it("should return user profile", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it("should block without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});


// ========================
// REFRESH TOKEN
// ========================
describe("POST /api/auth/refresh-token", () => {
  it("should return new access token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});


// ========================
// FORGOT PASSWORD
// ========================
describe("POST /api/auth/forgot-password", () => {
  it("should always return 200", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "fake@test.com" });

    expect(res.status).toBe(200);
  });
});