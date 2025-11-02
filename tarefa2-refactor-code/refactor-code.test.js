const { OrderProcessor } = require("./refactor-code");

describe("Sistema de E-commerce - Refatoração", () => {
  test("deve calcular total correto para pedido simples", () => {
  const orderData = { items: [{ price: 50, quantity: 2 }, { price: 30, quantity: 1 }] };
  const userInfo = { type: "VIP", state: "NY" };
  const paymentInfo = { method: "CREDIT_CARD" };
  const shippingInfo = { type: "STANDARD" };
  const promoInfo = {};

  const total = OrderProcessor.processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoInfo);
  expect(total).toBeCloseTo(137.54, 2);
});


  test("deve calcular total com produtos e descontos", () => {
    const order = { products: [{ cost: 100, count: 1 }, { cost: 50, count: 2 }] };
    const customer = { level: "PREMIUM", location: "USA" };
    const payment = { type: "CARD" };
    const delivery = { speed: "FAST" };
    const coupon = { discount: 0.2 };

    const total = OrderProcessor.calculateOrderTotal(order, customer, payment, delivery, coupon);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(200);
  });

  test("deve validar pedido com dados corretos", () => {
    const order = { items: [{ id: 1, price: 10, quantity: 2 }] };
    const user = { id: 5, email: "teste@exemplo.com", address: "Rua A" };
    const payment = { method: "CREDIT_CARD", amount: 100 };

    const result = OrderProcessor.validateAndProcessOrder(order, user, payment);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  test("deve processar pedido completo VIP com cupom", () => {
    const orderData = { items: [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }, { price: 20, quantity: 3 }] };
    const userInfo = { type: "VIP", state: "CA" };
    const paymentInfo = { method: "CREDIT_CARD" };
    const shippingInfo = { type: "EXPRESS" };
    const promoInfo = { code: "SAVE20" };

    const total = OrderProcessor.processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoInfo);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(400);
  });

  test("deve lidar com pedido inválido", () => {
    const order = { items: [] };
    const user = { id: null, email: "", address: "" };
    const payment = { method: "", amount: -10 };

    const result = OrderProcessor.validateAndProcessOrder(order, user, payment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Pedido sem itens"),
        expect.stringContaining("ID do usuário"),
        expect.stringContaining("Email do usuário"),
      ])
    );
  });
});
