import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";
import { addCategory } from "../../controllers/categoryController.js";
import * as CategoryModule from "../../models/Category.js";

describe("addCategory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 400 se a categoria já existir", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        formCategory: "Eletrônicos",
        formDescription: "Produtos eletrônicos",
      },
    });
    const res = httpMocks.createResponse();

    jest
      .spyOn(CategoryModule.default, "findOne")
      .mockResolvedValue({ name: "Eletrônicos" });

    await addCategory(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      success: false,
      error: "Categoria já existe",
    });
  });

  it("deve retornar 201 se a categoria for criada com sucesso", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        formCategory: "Roupas",
        formDescription: "Moda e vestuário",
      },
    });
    const res = httpMocks.createResponse();

    jest
      .spyOn(CategoryModule.default, "findOne")
      .mockResolvedValue(null);

    jest
      .spyOn(CategoryModule.default.prototype, "save")
      .mockResolvedValue({
        name: "Roupas",
        description: "Moda e vestuário",
      }); 

    await addCategory(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: "Categoria criada com sucesso!",
    });
  });

  it("deve retornar 500 em caso de erro inesperado", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        formCategory: "Brinquedos",
        formDescription: "Infantil",
      },
    });
    const res = httpMocks.createResponse();

    jest
      .spyOn(CategoryModule.default, "findOne")
      .mockRejectedValue(new Error("Erro simulado"));

    await addCategory(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      error: "Server error",
    });
  });
});
