const { Client, Environment } = require("square");

// Create Square client
const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SANDBOX_ACCESS_TOKEN
});
exports.createCheckout = async (req, res, next) => {
  try {
    console.log("body data", req.body);
    // Validate request body
    const { nonce, totalAmount } = req.body;
    if (!nonce || !totalAmount || isNaN(parseFloat(totalAmount))) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log("Received payment request:", req.body);
    const sourceId = nonce;
    const amountInDollars = parseFloat(totalAmount);
    const amountInCents = Math.floor(amountInDollars * 100); // Convert dollars to cents without rounding
    console.log("amountInCents", amountInCents, "amountInDollars", amountInDollars);
    // Create payment request
    const params = {
      sourceId,
      amountMoney: {
        amount: amountInCents,
        currency: "USD"
      },
      idempotencyKey: generateIdempotencyKey()
    };

    // Send payment request to Square API
    const response = await squareClient.paymentsApi.createPayment(params);
    req.payment = response.result;
    console.log("paymentResult", req.payment);
    next();
  } catch (error) {
    console.error("Error processing payment:", error);
    if (error.response) {
      // Handle Square API errors
      const { status, errors } = error.response;
      res.status(status).json({ errors });
    } else {
      res.status(500).json({ status: 500, error: "Error processing payment" });
    }
  }
};
// Generate idempotency key (unique identifier for each request)
function generateIdempotencyKey () {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
}
