import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";
import {
  addCategory,
  getCategorys,
  updateCategory,
  deleteCategory,
} from "../../controllers/categoryController.js";
import * as CategoryModule from "../../models/Category.js";
import * as ProductModule from "../../models/Product.js";

describe("categoryController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addCategory", () => {
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

      jest.spyOn(CategoryModule.default, "findOne").mockResolvedValue(null);
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

    it("deve retornar 500 se falhar ao salvar nova categoria", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          formCategory: "Games",
          formDescription: "Jogos e consoles",
        },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(CategoryModule.default, "findOne").mockResolvedValue(null);
      jest
        .spyOn(CategoryModule.default.prototype, "save")
        .mockRejectedValue(new Error("Erro ao salvar"));

      await addCategory(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        success: false,
        error: "Erro no servidor",
      });
    });
  });

  describe("getCategorys", () => {
    it("deve retornar 201 com as categorias", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest
        .spyOn(CategoryModule.default, "find")
        .mockResolvedValue([{ name: "A" }, { name: "B" }]);

      await getCategorys(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
      expect(res._getJSONData().categories.length).toBe(2);
    });

    it("deve retornar 500 se falhar ao buscar categorias", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      jest
        .spyOn(CategoryModule.default, "find")
        .mockRejectedValue(new Error("DB error"));

      await getCategorys(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData().success).toBe(false);
    });
  });


  describe("updateCategory", () => {
    it("deve retornar 404 se a categoria não existir", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1" },
        body: { formCategory: "Nova", formDescription: "Desc" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(CategoryModule.default, "findById").mockResolvedValue(null);

      await updateCategory(req, res);

      expect(res.statusCode).toBe(404);
    });

    it("deve atualizar e retornar 201 se existir", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1" },
        body: { formCategory: "Nova", formDescription: "Desc" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(CategoryModule.default, "findById").mockResolvedValue({
        _id: "1",
      });

      jest
        .spyOn(CategoryModule.default, "findByIdAndUpdate")
        .mockResolvedValue({ name: "Nova", description: "Desc" });

      await updateCategory(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
    });

    it("deve retornar 500 se ocorrer erro", async () => {
      const req = httpMocks.createRequest({
        params: { id: "1" },
        body: { formCategory: "Nova", formDescription: "Desc" },
      });
      const res = httpMocks.createResponse();

      jest
        .spyOn(CategoryModule.default, "findById")
        .mockRejectedValue(new Error("Erro"));

      await updateCategory(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe("deleteCategory", () => {
    it("deve retornar 400 se houver produtos associados", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, "countDocuments")
        .mockResolvedValue(2);

      await deleteCategory(req, res);

      expect(res.statusCode).toBe(400);
    });

    it("deve retornar 404 se categoria não for encontrada", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, "countDocuments")
        .mockResolvedValue(0);
      jest
        .spyOn(CategoryModule.default, "findByIdAndDelete")
        .mockResolvedValue(null);

      await deleteCategory(req, res);

      expect(res.statusCode).toBe(404);
    });

    it("deve deletar e retornar 201 com sucesso", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, "countDocuments")
        .mockResolvedValue(0);
      jest
        .spyOn(CategoryModule.default, "findByIdAndDelete")
        .mockResolvedValue({ _id: "1", name: "Deletada" });

      await deleteCategory(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData().success).toBe(true);
    });

    it("deve retornar 500 se erro ocorrer", async () => {
      const req = httpMocks.createRequest({ params: { id: "1" } });
      const res = httpMocks.createResponse();

      jest
        .spyOn(ProductModule.default, "countDocuments")
        .mockRejectedValue(new Error("Erro simulado"));

      await deleteCategory(req, res);

      expect(res.statusCode).toBe(500);
    });
  });
});
