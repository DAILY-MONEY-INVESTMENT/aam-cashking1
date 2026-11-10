import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    // MarzPay requires Basic Auth directly on the request
    const authString = Buffer.from(
      `${process.env.MARZPAY_API_KEY}:${process.env.MARZPAY_API_SECRET}`
    ).toString("base64");

    // Correct MarzPay Endpoint for Collections
    const collectRes = await fetch("https://wallet.wearemarz.com/api/v1/collect-money", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        phone_number: phone,
        description: description,
        country: "UG",
      }),
    });

    const collectData = await collectRes.json();

    if (collectRes.ok) {
      return NextResponse.json({ success: true, data: collectData });
    } else {
      return NextResponse.json({ success: false, error: `MarzPay Error: ${collectData.message || collectRes.statusText}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
