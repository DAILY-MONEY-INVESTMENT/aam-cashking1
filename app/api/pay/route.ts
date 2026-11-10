import { NextResponse } from "next/server";
import MarzPay from "marzpay-js";

const marzpay = new MarzPay({
  apiKey: process.env.MARZPAY_API_KEY!,
  apiSecret: process.env.MARZPAY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { phone, amount, description } = await req.json();

    const collection = await marzpay.collections.collectMoney({
      amount: amount,
      phoneNumber: phone,
      description: description,
    });

    return NextResponse.json({ success: true, reference: collection.data.reference });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
