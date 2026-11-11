import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    // 1. Force the format to +256XXXXXXXXX (the format MarzPay SDKs expect)
    let formattedPhone = phone.trim().replace(/\s+/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+256" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("256")) {
      formattedPhone = "+" + formattedPhone;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    // 2. Generate a unique reference (some MarzPay endpoints require this)
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
      // Return the exact error text so we can see what MarzPay says
      return NextResponse.json({ success: false, error: `MarzPay: ${collectData.message || JSON.stringify(collectData)}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: `Server: ${error.message}` }, { status: 500 });
  }
}
