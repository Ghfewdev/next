import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
) {

  try {

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (token !== process.env.TOKEN_B) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 403 }
      );
    }

    const body2 = await req.json();

    // console.log(body2)

    const body = {
      "hptcode": process.env.HPTC,
      "username": process.env.USER,
      "password": process.env.PASS
    }

    const res = await fetch(`${process.env.TOKEN_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // ส่งต่อ
    });

    const data = await res.json();

    

    const res2 = await fetch(`${process.env.API_URL2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data}`,
      },
      body: JSON.stringify(body2), // ส่งต่อ
    });

    const data2 = await res2.json();



    return NextResponse.json(data2);
  } catch (err) {
    return NextResponse.json(
      { error: "Error forwarding request" },
      { status: 500 }
    );
  }

}