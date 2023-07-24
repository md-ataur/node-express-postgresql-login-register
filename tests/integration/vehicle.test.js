const request = require("supertest");
const app = require("../../src/app");
const DB = require("../../src/config/sequelize.config");

describe("Vehicle routes", () => {
  beforeAll(async () => {
    await DB;
  });

  afterAll(async () => {
    await DB.close();
  });

  describe("POST /v1/vehicles/add", () => {
    const fakeData = {
      licenseNumber: "5248",
      firstName: "Karim",
      phone: "+87878",
      vehicleType: "car",
      charge: 500,
      entryDate: "2023-02-17",
      exitDate: "2023-02-17",
      entryTime: "11:00",
      exitTime: "12:00",
      status: "in",
      address: "Khulna",
    };

    test("should return 201 if successfully data inserted", async () => {
      const res = await request(app).post("/v1/vehicles/add").send(fakeData);
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toMatchObject({
        id: expect.anything(),
        licenseNumber: fakeData.licenseNumber,
        firstName: fakeData.firstName,
        phone: fakeData.phone,
        vehicleType: fakeData.vehicleType,
        charge: fakeData.charge,
        entryDate: expect.any(String),
        exitDate: expect.any(String),
        entryTime: expect.any(String),
        exitTime: expect.any(String),
        status: fakeData.status,
        address: fakeData.address,
      });
    });
  });

  describe("GET /v1/vehicles", () => {
    test("should return an array if data is found", async () => {
      const res = await request(app).get("/v1/vehicles").send();
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /v1/vehicles/:id", () => {
    test("should return a specific data by id", async () => {
      const id = 4;
      const res = await request(app).get(`/v1/vehicles/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toMatchObject({
        id: expect.anything(),
        licenseNumber: expect.any(String),
        firstName: expect.any(String),
        phone: expect.any(String),
        vehicleType: expect.any(String),
        charge: expect.any(Number),
        entryDate: expect.any(String),
        exitDate: expect.any(String),
        entryTime: expect.any(String),
        exitTime: expect.any(String),
        status: expect.any(String),
        address: expect.any(String),
      });
    });

    test("should return an empty object if data is not found", async () => {
      const id = 28;
      const res = await request(app).get(`/v1/vehicles/${id}`);
      expect(res.body.data).not.toHaveProperty("id");
      expect(res.body.data).toMatchObject({});
    });
  });

  describe("PATCH /v1/vehicles/update/:id", () => {
    const fakeData = {
      licenseNumber: "8787",
      firstName: "Steeve",
      phone: "+87878",
      vehicleType: "car",
      charge: 500,
      entryDate: "2023-02-17",
      exitDate: "2023-02-17",
      entryTime: "11:00",
      exitTime: "12:00",
      status: "in",
      address: "Khulna",
    };

    test("should success true if data is updated", async () => {
      const id = 3;
      const res = await request(app).patch(`/v1/vehicles/update/${id}`).send(fakeData);
      expect(res.body.data).toContain(1);
      expect(res.body.success).toBe(true);
    });

    test("should return 500 if data is not found to update", async () => {
      const id = 8;
      const res = await request(app).patch(`/v1/vehicles/${id}`);
      expect(res.statusCode).toBe(500);
    });
  });

  describe("DELETE /v1/vehicles/:id", () => {
    test("should success true if data is deleted", async () => {
      const id = 6;
      const res = await request(app).delete(`/v1/vehicles/${id}`);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBe(1);
    });

    test("should return an empty object if data is not found to delete", async () => {
      const id = 30;
      const res = await request(app).delete(`/v1/vehicles/${id}`);
      expect(res.body.data).not.toHaveProperty("id");
      expect(res.body.data).toMatchObject({});
    });
  });
});
