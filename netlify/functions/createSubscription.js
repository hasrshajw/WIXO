const Razorpay = require("razorpay");

exports.handler = async function (event, context) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Missing Razorpay API Keys in Netlify Environment Variables");
    }

    // Current time in seconds
    const now = Math.floor(Date.now() / 1000);

    // Subscription should start NOW (for trial)
    // First billing after 10 days
    const firstChargeAt = now + 10 * 24 * 60 * 60; // 10 days later

    // Create a Plan ₹100 per month (only create once in dashboard ideally)
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Monthly ₹100 Subscription",
        amount: 10000, // ₹100 in paise
        currency: "INR",
      },
    });

    // Create subscription with TRIAL (₹1–₹5 initial debit)
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      total_count: 12, // 1 year subscription
      customer_notify: 1,
      start_at: firstChargeAt, // actual first billing date
      addons: [
        {
          item: {
            name: "Trial Setup Fee",
            amount: 500, // ₹5 in paise (can change 100–500)
            currency: "INR",
          },
        },
      ],
      notes: {
        purpose: "UPI Autopay Subscription ₹100/month",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: subscription.id }),
    };
  } catch (error) {
    console.error("Razorpay Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
