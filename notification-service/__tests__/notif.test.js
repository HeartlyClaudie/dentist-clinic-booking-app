// __tests__/notif.test.js
const request = require("supertest");
const app = require("../src/app"); // ✅ FIXED import

describe("Notification Service", () => {
  test("should respond to health check", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Notification Service is up");
  });

  test("should send a notification successfully", async () => {
    const res = await request(app)
      .post("/notify")
      .send({ userId: 123, message: "Your booking is confirmed!" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toMatch(/notification sent to user 123/i);
  });

  test("should return 400 if userId or message is missing", async () => {
    const res = await request(app)
      .post("/notify")
      .send({ userId: 123 }); // missing message

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing userId or message");
  });
});
