'use strict';

const stripe = require("stripe")("sk_test_51IYvQiBXx641g2rsye3ubJZedjBqTc34vDY8QlS2EabDmOKA7uFySMsHrPdK3AJAha8x8VEn6qKicNyyMT4MDqc70029H7cXWx")
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
 module.exports = {
    async create(ctx) {
      const { token, products, idUser, addressShipping } = ctx.request.body;
      let totalPayment = 0;
      products.forEach((product) => {
        totalPayment = totalPayment + product.price;
      });
  
      const charge = await stripe.charges.create({
        amount: totalPayment * 100,
        currency: "eur",
        source: token.id,
        description: `ID Usuario: ${idUser}`,
      });
  
      const createOrder = [];
      for await (const product of products) {
        const data = {
          game: product.id,
          user: idUser,
          totalPayment,
          idPayment: charge.id,
          addressShipping,
        };
        const validData = await strapi.entityValidator.validateEntity(
          strapi.models.order,
          data
        );
        const entry = await strapi.query("order").create(validData);
        createOrder.push(entry);
      }
      return createOrder;
    },
  };