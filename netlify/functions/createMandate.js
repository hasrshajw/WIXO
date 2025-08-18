const Razorpay = require("razorpay");

exports.handler = async function (event, context) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay API Keys in Netlify Environment Variables");
    }

    // Step 1: Create a Plan (₹100 monthly)
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "₹100 Monthly Subscription",
        amount: 10000, // paise → ₹100
        currency: "INR"
      }
    });

    // Step 2: Create Subscription (start after 10 days)
    const startAt = Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60); // 10 days later

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12, // 12 months
      start_at: startAt,
      notes: { purpose: "Monthly Subscription ₹100 starting after 10 days" }
    });

    // Step 3: Add a ₹5 Addon immediately
    await razorpay.subscription.addAddon(subscription.id, {
      item: {
        name: "Initial Setup Fee",
        amount: 100, // paise → ₹1
        currency: "INR"
      },
      quantity: 1
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: subscription.id })
    };
  } catch (error) {
    console.error("Razorpay Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
