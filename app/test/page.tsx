    "use client";

    import { useState } from "react";
    import Captcha from "../components/Captcha";

    export default function Home() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
        alert("กรุณายืนยัน CAPTCHA");
        return;
        }

        const res = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: captchaToken,
        }),
        });

        const data = await res.json();

        if (data.success) {
        alert("CAPTCHA ผ่าน");
        } else {
        alert("CAPTCHA ไม่ผ่าน");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <input
            type="text"
            placeholder="ชื่อ"
            className="border p-2"
        />

        <Captcha onChange={setCaptchaToken} />

        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2"
        >
            Submit
        </button>
        </form>
    );
    }