import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token = body.token;

    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    const googleRes = await fetch(verifyURL, {
      method: "POST",
    });

    const data = await googleRes.json();

    return NextResponse.json({
      success: data.success,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}