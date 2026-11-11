import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    // 1. Format phone to international format (+256...)
    let formattedPhone = phone.trim().replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+256" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    // 2. Generate unique reference (REQUIRED)
    const reference = `MZ-${Date.now()}`;

    // 3. Basic Auth
    const authString = Buffer.from(
      `${process.env.MARZPAY_API_KEY}:${process.env.MARZPAY_API_SECRET}`
    ).toString("base64");

    // 4. Make the request with ALL required fields
    const collectRes = await fetch("https://wallet.wearemarz.com/api/v1/collect-money", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        phone_number: formattedPhone,
        description: description,
        country: "UG",
        reference: reference,
      }),
    });

    const collectData = await collectRes.json();

    if (collectRes.ok) {
      return NextResponse.json({ success: true, data: collectData });
    } else {
      // This will show us exactly what MarzPay is complaining about
      return NextResponse.json({ success: false, error: `MarzPay: ${collectData.message || JSON.stringify(collectData)}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Server: ${error.message}` }, { status: 500 });
  }
}
