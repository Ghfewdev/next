"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Captcha from "../../components/Captcha";

export default function LoginPage() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        if (!captchaToken) {
            alert("กรุณายืนยัน CAPTCHA");
            return;
        }

        setLoading(true);

        try {
            // verify captcha
            const captchaRes = await fetch("/next/api/verify-captcha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: captchaToken,
                }),
            });

            const captchaData = await captchaRes.json();

            if (!captchaData.success) {
                alert("CAPTCHA ไม่ผ่าน");
                setLoading(false);
                return;
            }

            // login
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (res?.ok) {
                router.push("/bgdk");
                router.refresh();
            } else {
                alert("Username หรือ Password ไม่ถูกต้อง");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-100">
            <div className="grid min-h-screen lg:grid-cols-2">
                
                {/* LEFT */}
                <div className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-900 p-16 text-white">
                    
                    {/* Background */}
                    <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-300/10 blur-3xl" />

                    <div className="relative z-10 max-w-xl">
                        
                        {/* Logo */}
                        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur">
                            <span className="text-5xl">🏢</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl font-bold leading-tight">
                            BGDK
                        </h1>

                        <h2 className="mt-4 text-2xl font-semibold text-emerald-100">
                            ระบบข้อมูลคู่ค้าภาครัฐ
                        </h2>

                        <p className="mt-6 text-lg leading-relaxed text-green-100">
                            ระบบบริหารจัดการข้อมูลคู่ค้าภาครัฐ
                            สำหรับหน่วยงานกรุงเทพมหานคร
                            รองรับการตรวจสอบข้อมูล จัดเก็บเอกสาร
                            และติดตามสถานะได้อย่างมีประสิทธิภาพ
                        </p>

                        {/* Features */}
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-3 w-3 rounded-full bg-white" />
                                <span>จัดการข้อมูลคู่ค้า</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-3 w-3 rounded-full bg-white" />
                                <span>รองรับเอกสารภาครัฐ</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-3 w-3 rounded-full bg-white" />
                                <span>ปลอดภัย รองรับทุกอุปกรณ์</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
                    <div className="w-full max-w-md">
                        
                        {/* MOBILE HEADER */}
                        <div className="mb-8 text-center lg:hidden">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-2xl">
                                <span className="text-5xl">🏢</span>
                            </div>

                            <h1 className="text-4xl font-bold text-emerald-900">
                                BGDK
                            </h1>

                            <p className="mt-2 text-green-700">
                                ระบบข้อมูลคู่ค้าภาครัฐ
                            </p>
                        </div>

                        {/* CARD */}
                        <div className="rounded-3xl border border-green-100 bg-white/90 shadow-2xl backdrop-blur-xl">
                            
                            {/* TOP */}
                            <div className="rounded-t-3xl bg-gradient-to-r from-emerald-700 to-green-700 px-8 py-8 text-white">
                                <h2 className="text-3xl font-bold">
                                    เข้าสู่ระบบ
                                </h2>

                                <p className="mt-2 text-green-100">
                                    กรุงเทพมหานคร (BMA Government Partner System)
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 p-6 sm:p-8"
                            >
                                {/* Username */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="กรอก Username"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        placeholder="กรอก Password"
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>

                                {/* CAPTCHA */}
                                <div className="flex justify-center overflow-auto">
                                    <Captcha onChange={setCaptchaToken} />
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-green-700 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "กำลังเข้าสู่ระบบ..."
                                        : "เข้าสู่ระบบ"}
                                </button>
                            </form>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            © 2026 IT (MSD) - BGDK System
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}