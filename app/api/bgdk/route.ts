import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
) {

  try {

    const body = await req.json(); // รับจาก frontend

    console.log(process.env.HPTC)

    const res = await fetch(`${process.env.TOKEN_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // ส่งต่อ
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Error forwarding request" },
      { status: 500 }
    );
  }

}