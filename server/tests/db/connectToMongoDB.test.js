import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToMongoDB from "../../db/connectToMongoDB.js";

describe("Conexão com MongoDB", () => {
  let mongoServer;
  const originalEnv = process.env;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_DB_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    process.env = originalEnv;
  });

  it("deve conectar ao MongoDB com sucesso", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await connectToMongoDB();
    expect(mongoose.connection.readyState).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith("Conectado ao BD MongoDB");
    consoleSpy.mockRestore();
  });

  it("deve capturar erro se URI estiver incorreta", async () => {
    process.env.MONGO_DB_URI = "mongodb://invalid:1234/test";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectToMongoDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Erro ao conectar com o MongoDB"),
      expect.any(String)
    );

    consoleSpy.mockRestore();
  });
});
