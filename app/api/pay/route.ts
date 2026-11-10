import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    // 1. Get Access Token from MarzPay
    const authString = Buffer.from(
      `${process.env.MARZPAY_API_KEY}:${process.env.MARZPAY_API_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://api.marzpay.com/v1/auth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenRes.ok) {
      // Return the exact error from MarzPay
      return NextResponse.json({ success: false, error: `Auth Error: ${tokenData.message || tokenRes.statusText}` }, { status: 400 });
    }

    // 2. Request Collection (Sends PIN Prompt)
    const collectRes = await fetch("https://api.marzpay.com/v1/collections/collect-money", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        phone_number: phone,
        description: description,
      }),
    });

    const collectData = await collectRes.json();

    if (collectRes.ok) {
      return NextResponse.json({ success: true, data: collectData });
    } else {
      // Return the exact error from MarzPay
      return NextResponse.json({ success: false, error: `Collect Error: ${collectData.message || collectRes.statusText}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Server: ${error.message}` }, { status: 500 });
  }
}
