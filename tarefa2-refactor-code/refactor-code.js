console.log("Início Tarefa 3 - ['SEM IA']");
/**
 * @file refactor-code.js
 * @description Refatoração da classe LegacyOrderProcessor com código limpo e modular.
 */

// ====================== 🔹 CONSTANTES ======================
const USER_DISCOUNTS = {
  VIP: 0.15,
  GOLD: 0.1,
  SILVER: 0.05,
  BRONZE: 0.02,
  REGULAR: 0,
  PREMIUM: 0.2,
  STANDARD: 0.1,
  BASIC: 0.05,
};

const PROMO_CODES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3,
  SAVE50: 0.5,
  BOGO: 0.5,
  FREESHIP: "FREESHIP",
};

const SHIPPING_COSTS = {
  EXPRESS: 25,
  STANDARD: 15,
  ECONOMY: 8,
  PICKUP: 0,
  FAST: 30,
  MEDIUM: 15,
  SLOW: 5,
};

const TAX_RATES = {
  CA: 0.0875,
  NY: 0.08,
  TX: 0.0625,
  FL: 0,
  EUROPE: 0.2,
  USA: 0.1,
  ASIA: 0.15,
  DEFAULT: 0.05,
};

const PAYMENT_FEES = {
  CREDIT_CARD: 0.029,
  DEBIT_CARD: 0.015,
  PAYPAL: 0.034,
  BANK_TRANSFER: 0,
  CRYPTO: 0.01,
  CARD: 0.03,
  BANK: 0,
  DIGITAL: 0.02,
};

// ====================== 🔹 FUNÇÕES AUXILIARES ======================

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Pedido inválido: deve conter pelo menos um item.");
  }
  for (const item of items) {
    if (!item || item.price <= 0 || item.quantity <= 0) {
      throw new Error("Item inválido: preço e quantidade devem ser positivos.");
    }
  }
}

function calcSubtotal(items) {
  return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
}

function calcUserDiscount(subtotal, userType) {
  return subtotal * (USER_DISCOUNTS[userType] || 0);
}

function calcPromoDiscount(subtotal, promoCode) {
  const promo = PROMO_CODES[promoCode];
  if (!promo) return 0;
  if (promo === "FREESHIP") return "FREESHIP";
  return subtotal * promo;
}

function calcShippingCost(type, hasFree) {
  if (hasFree) return 0;
  return SHIPPING_COSTS[type] ?? SHIPPING_COSTS.STANDARD;
}

function calcTax(subtotal, discount, state) {
  const rate = TAX_RATES[state] ?? TAX_RATES.DEFAULT;
  return (subtotal - discount) * rate;
}

function calcPaymentFee(subtotal, discount, method) {
  const fee = PAYMENT_FEES[method] ?? 0;
  return (subtotal - discount) * fee;
}

// ====================== 🔹 CLASSE PRINCIPAL ======================
class OrderProcessor {
  /**
   * Processa um pedido completo aplicando regras de negócio.
   */
  static processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoInfo) {
    validateItems(orderData.items);

    const subtotal = calcSubtotal(orderData.items);
    const userDiscount = calcUserDiscount(subtotal, userInfo?.type);
    const promoResult = calcPromoDiscount(subtotal, promoInfo?.code);
    const hasFreeShipping = promoResult === "FREESHIP";
    const promoDiscount = typeof promoResult === "number" ? promoResult : 0;

    const totalDiscount = userDiscount + promoDiscount;
    const shippingCost = calcShippingCost(shippingInfo?.type, hasFreeShipping);
    const tax = calcTax(subtotal, totalDiscount, userInfo?.state);
    const paymentFee = calcPaymentFee(subtotal, totalDiscount, paymentInfo?.method);

    let total = subtotal - totalDiscount + tax + shippingCost + paymentFee;
    if (total < 0) total = 0;

    return Math.floor(total * 100) / 100;
  }

  /**
   * Calcula total com base em produtos e descontos genéricos.
   */
  static calculateOrderTotal(order, customer, payment, delivery, coupon) {
    validateItems(order.products);

    const subtotal = calcSubtotal(order.products.map(p => ({ price: p.cost, quantity: p.count })));
    const userDiscount = calcUserDiscount(subtotal, customer?.level);
    const couponDiscount = subtotal * (coupon?.discount || 0);
    const totalDiscount = userDiscount + couponDiscount;

    const deliveryCost = calcShippingCost(delivery?.speed);
    const tax = calcTax(subtotal, totalDiscount, customer?.location);
    const paymentFee = calcPaymentFee(subtotal, totalDiscount, payment?.type);

    let total = subtotal - totalDiscount + deliveryCost + tax + paymentFee;
    if (total < 0) total = 0;

    return Math.round(total * 100) / 100;
  }

  /**
   * Valida o pedido e retorna erros e status de validade.
   */
  static validateAndProcessOrder(order, user, payment) {
    const errors = [];

    // Pedido
    if (!order || !Array.isArray(order.items) || order.items.length === 0)
      errors.push("Pedido sem itens.");
    else {
      order.items.forEach((item) => {
        if (!item.id) errors.push("ID do item não informado");
        if (!item.price) errors.push(`Preço não informado para item ${item.id || "?"}`);
        if (!item.quantity) errors.push(`Quantidade não informada para item ${item.id || "?"}`);
        if (item.price <= 0) errors.push(`Preço inválido para item ${item.id}`);
        if (item.quantity <= 0) errors.push(`Quantidade inválida para item ${item.id}`);
      });
    }

    // Usuário
    if (!user?.id) errors.push("ID do usuário não informado");
    if (!user?.email) errors.push("Email do usuário não informado");
    if (!user?.address) errors.push("Endereço do usuário não informado");

    // Pagamento
    if (!payment?.method) errors.push("Método de pagamento não informado");
    if (!payment?.amount || payment.amount <= 0)
      errors.push("Valor do pagamento inválido");

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = { OrderProcessor };
