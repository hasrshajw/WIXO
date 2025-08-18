const Razorpay = require("razorpay");

exports.handler = async function (event, context) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,      // set in Netlify dashboard
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create a plan (₹1) if you don’t already have one
    const plan = await razorpay.plans.create({
      period: "monthly",     // repeat cycle
      interval: 1,
      item: {
        name: "UPI Autopay Setup Plan",
        amount: 100,          // amount in paise (₹1 = 100p)
        currency: "INR"
      }
    });

    // Create subscription using the plan
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12, // 12 months (1 year mandate)
      notes: { purpose: "UPI Autopay Setup" }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: subscription.id })
    };
  } catch (error) {
    console.error("Error creating mandate:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
