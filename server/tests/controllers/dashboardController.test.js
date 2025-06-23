import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";
import { getSummary } from "../../controllers/dashboardController.js";
import * as ProductModule from "../../models/Product.js";
import * as OrderModule from "../../models/Order.js";

describe("getSummary", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 200 com os dados do dashboard", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    jest.spyOn(ProductModule.default, "countDocuments").mockResolvedValue(10);
    jest.spyOn(ProductModule.default, "aggregate").mockResolvedValue([{ totalStock: 50 }]);
    jest.spyOn(OrderModule.default, "countDocuments").mockResolvedValue(5);

    jest.spyOn(ProductModule.default, "find").mockImplementation((query) => {
      if (query.stock === 0) {
        return {
          select: () => ({
            populate: () => [
              { name: "Produto 1", stock: 0, category: { name: "Categoria A" } },
            ],
          }),
        };
      }

      if (query.stock?.$gt === 0 && query.stock?.$lt === 5) {
        return {
          select: () => ({
            populate: () => [
              { name: "Produto 2", stock: 2, category: { name: "Categoria B" } },
            ],
          }),
        };
      }

      return {};
    });

    jest.spyOn(OrderModule.default, "aggregate").mockResolvedValue([
      {
        name: "Produto Campeão",
        category: "Categoria Top",
        totalQuantity: 15,
      },
    ]);

    await getSummary(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      totalProducts: 10,
      totalStock: 50,
      ordersToday: 5,
      outOfStock: [
        { name: "Produto 1", stock: 0, category: { name: "Categoria A" } },
      ],
      highestSaleProduct: {
        name: "Produto Campeão",
        category: "Categoria Top",
        totalQuantity: 15,
      },
      lowStock: [
        { name: "Produto 2", stock: 2, category: { name: "Categoria B" } },
      ],
    });
  });

  it("deve retornar 500 se ocorrer erro em qualquer chamada", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    jest.spyOn(ProductModule.default, "countDocuments").mockRejectedValue(new Error("Erro"));

    await getSummary(req, res);

    expect(res.statusCode).toBe(500);
    const json = res._getJSONData();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/Erro ao buscar dados do dashboard/i);
  });

  it("deve retornar totalStock 0 se aggregate vier vazio", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    jest.spyOn(ProductModule.default, "countDocuments").mockResolvedValue(0);
    jest.spyOn(ProductModule.default, "aggregate").mockResolvedValue([]); 
    jest.spyOn(OrderModule.default, "countDocuments").mockResolvedValue(0);

    jest.spyOn(ProductModule.default, "find").mockImplementation(() => ({
      select: () => ({ populate: () => [] }),
    }));

    jest.spyOn(OrderModule.default, "aggregate").mockResolvedValue([]); // 

    await getSummary(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();

    expect(data.totalProducts).toBe(0);
    expect(data.totalStock).toBe(0);
    expect(data.ordersToday).toBe(0);
    expect(data.outOfStock).toEqual([]);
    expect(data.lowStock).toEqual([]);
    expect(data.highestSaleProduct).toEqual({ message: 'Sem dados de pedidos' });
  });
});
