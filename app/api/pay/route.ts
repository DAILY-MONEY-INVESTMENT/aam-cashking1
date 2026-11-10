import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    // Format phone for MarzPay: 0707042220 -> 256707042220
    let formattedPhone = phone.trim().replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "256" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.slice(1);
    }

    // MarzPay requires a unique reference for every transaction
    const reference = `MZ-${Date.now()}`;

    const authString = Buffer.from(
      `${process.env.MARZPAY_API_KEY}:${process.env.MARZPAY_API_SECRET}`
    ).toString("base64");

    const collectRes = await fetch("https://wallet.wearemarz.com/api/v1/collect-money", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
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
      return NextResponse.json({ success: false, error: `MarzPay Error: ${collectData.message || collectRes.statusText}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
