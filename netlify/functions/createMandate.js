const Razorpay = require("razorpay");

exports.handler = async function (event, context) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create a mandate (₹1 test payment)
    const mandate = await razorpay.subscriptions.create({
      plan_id: "plan_R6hsImxfDwwzPr", // Create a ₹1 plan in Razorpay dashboard
      customer_notify: 1,
      total_count: 999, // how many cycles
      start_at: Math.floor(Date.now() / 1000) + 60, // start 1 min later
      expire_by: Math.floor(Date.now() / 1000) + 86400 * 30, // expires in 30 days
      addons: [],
      notes: {
        purpose: "UPI Autopay Setup",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: mandate.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
