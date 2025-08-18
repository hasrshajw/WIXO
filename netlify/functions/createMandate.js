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

    // ✅ Instead of creating a plan every time, just create once in dashboard
    // and use its plan_id directly
    const subscription = await razorpay.subscriptions.create({
      plan_id: "plan_R6hsImxfDwwzPr", // replace with your actual plan_id from Razorpay dashboard
      customer_notify: 1,
      total_count: 12,
      notes: { purpose: "UPI Autopay Setup" }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: subscription.id })
    };
  } catch (error) {
    console.error("Razorpay Function Error:", error); // logs in Netlify function logs
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
