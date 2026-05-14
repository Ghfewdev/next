import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
) {

  try {
    const body = {
      "hptcode":process.env.HPTC,
      "username":process.env.USER,
      "password":process.env.PASS
    }

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