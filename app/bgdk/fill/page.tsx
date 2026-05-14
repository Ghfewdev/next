"use client";

import React, { useRef, useEffect, useState } from "react";
import PaymentDetailForm from "../../components/PaymentDetailForm";
import Captcha from "@/app/components/Captcha";
import Image from "next/image";

type ApiResponse = {
    MessageCode: number;
    count: number;
    Result: any[];
};

const hospitalOptions = [
    // { value: "11537", label: "โรงพยาบาลกลาง" },
    { value: "14641", label: "โรงพยาบาลราชพิพัฒน์" },
    { value: "11539", label: "โรงพยาบาลตากสิน" },
    // { value: "11541", label: "โรงพยาบาลเจริญกรุงประชารักษ์" },
    // { value: "25060", label: "โรงพยาบาลผู้สูงอายุบางขุนเทียน" },
    // { value: "41582", label: "โรงพยาบาลบางนากรุงเทพมหานคร" },
    { value: "41522", label: "โรงพยาบาลรัตนประชารักษ์" },
    // { value: "11538", label: "โรงพยาบาลนคราภิบาล" },
    // { value: "11540", label: "โรงพยาบาลหลวงพ่อทวีศักดิ์ ชุตินธฺโร อุทิศ" },
    // { value: "11536", label: "โรงพยาบาลเวชการุณย์รัศมิ์" },
    // { value: "15049", label: "โรงพยาบาลสิรินธร" },
];

export default function Fill() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [hptcode, setHptcode] = useState("");
    const [taxno, setTaxno] = useState("");
    const [taxpay, setTaxpay] = useState("");

    const [invoice, setInvoice] = useState("");
    const [egp, setEgp] = useState("");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const [pin, setPin] = useState(["", "", "", ""]);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const fetchData = async (e: React.FormEvent) => {
        e.preventDefault();



        if (loading) return;

        // if (!captchaToken) {
        //     alert("กรุณายืนยัน CAPTCHA");
        //     return;
        // }

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

            // if (!captchaData.success) {
            //     alert("CAPTCHA ไม่ผ่าน");
            //     setLoading(false);
            //     return;
            // }

            setLoading(true);
            setError("");

            const response = await fetch("/next/api/bgdk/bg02", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN_B}`
                },
                body: JSON.stringify({
                    hptcode,
                    taxno: invoice,
                    taxpay: pin.join(""),
                    egpno: egp
                }),
            });


            const result = await response.json();

            

            if (result.MessageCode === 200 && result.count > 0) {

                const filteredResponse = {
                ...result,
                Result: result.Result.filter(
                    (item: any) => item.dkno != null
                ),
            };

                setData(filteredResponse.Result[0]);
            } else {
                setData(null);
                setError("ไม่พบข้อมูล");
            }
            setOpen(true)
        } catch (err) {
            console.error(err);
            setError("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    // เปลี่ยนค่า
    const handleChange = (
        value: string,
        index: number
    ) => {
        // รับเฉพาะตัวเลข
        if (!/^\d?$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // ไปช่องถัดไปอัตโนมัติ
        if (value && index < pin.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // กด Backspace
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            e.key === "Backspace" &&
            !pin[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // วาง Paste
    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault();

        const pasteData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 4);

        const newPin = [...pin];

        pasteData.split("").forEach((char, index) => {
            newPin[index] = char;
        });

        setPin(newPin);

        // focus ช่องสุดท้าย
        const nextIndex =
            pasteData.length >= 4
                ? 3
                : pasteData.length;

        inputRefs.current[nextIndex]?.focus();
    };


    useEffect(() => {
        // fetchData();
    }, []);

    return (
        <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-100">

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
                    {/* Modal Box */}
                    <div
                        className="
      flex max-h-[95%] w-full max-w-5xl flex-col
      overflow-hidden rounded-2xl bg-white shadow-2xl
      animate-in fade-in zoom-in duration-200
    "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
                            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                                ข้อมูลคู่ค้า
                            </h2>

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className="
        flex-1 overflow-y-auto

      "
                        >
                            {/* ERROR */}
                            {error && (
                                <div className="mb-4 mt-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* RESULT */}
                            {data && <PaymentDetailForm data={data} />}
                        </div>

                        {/* Footer */}
                        <div
                            className="
        flex justify-end gap-2 border-t
        px-4 py-3 sm:px-6
      "
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-xl border px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* LEFT */}
                <div className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-900 p-16 text-white">

                    {/* Background */}
                    <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-300/10 blur-3xl" />

                    <div className="relative z-10 max-w-xl">

                        {/* Logo */}
                        <div className="mb-2 flex h-24 w-3/5 items-center justify-center rounded-3xl border border-white bg-white backdrop-blur">

                            <Image
                                src="/next/images/msd.png"
                                width={400}
                                height={400}
                                alt="msd"

                            />
                        </div>

                        {/* Title */}
                        {/* <h1 className="text-5xl font-bold leading-tight">
                            BGDK
                        </h1>

                        <h2 className="mt-4 text-2xl font-semibold text-emerald-100">
                            ระบบข้อมูลคู่ค้าภาครัฐ
                        </h2> */}

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
                        <div className="mb-2 text-center lg:hidden">
                            <div className="mx-auto mb-2 flex h-24 w-60 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-2xl">
                                <div className="mb-2 flex h-24 w-60 items-center justify-center rounded-3xl border border-white bg-white backdrop-blur">

                                    <Image
                                        src="/next/images/msd.png"
                                        width={300}
                                        height={300}
                                        alt="msd"

                                    />
                                </div>
                            </div>

                            {/* <h1 className="text-4xl font-bold text-emerald-900">
                                BGDK
                            </h1>

                            <p className="mt-2 text-green-700">
                                ระบบข้อมูลคู่ค้าภาครัฐ
                            </p> */}
                        </div>

                        {/* CARD */}
                        <div className="rounded-3xl border border-green-100 bg-white/90 shadow-2xl backdrop-blur-xl">

                            {/* TOP */}
                            <div className="rounded-t-3xl bg-gradient-to-r from-emerald-700 to-green-700 px-4 py-4 text-white">
                                <h2 className="text-3xl font-bold">
                                    ตรวจสอบข้อมูลคู่ค้าภาครัฐ
                                </h2>

                                <p className="mt-2 text-green-100">
                                    สำนักการแพทย์ กรุงเทพมหานคร
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={fetchData}
                                className="space-y-4 p-2 sm:p-4"
                            >
                                {/* Username */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        หน่วยงาน
                                    </label>

                                    <select
                                        value={hptcode}
                                        onChange={(e) =>
                                            setHptcode(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-2 py-2 outline-none transition focus:border-blue-500"
                                    >
                                        <option value="">เลือกหน่วยงาน</option>
                                        {hospitalOptions.map((item) => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Password */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Invoice */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            เลขที่ใบแจ้งหนี้ / invoice
                                        </label>

                                        <input
                                            type="text"
                                            value={invoice}
                                            onChange={(e) => setInvoice(e.target.value)}
                                            placeholder="กรอกเลขที่"
                                            disabled={egp !== ""}
                                            className="
            w-full rounded-xl border border-gray-300
            px-3 py-2 outline-none transition
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400
          "
                                        />
                                    </div>

                                    {/* EGP */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            เลขที่ e-GP
                                        </label>

                                        <input
                                            type="text"
                                            value={egp}
                                            onChange={(e) => setEgp(e.target.value)}
                                            placeholder="กรอกเลขที่"
                                            disabled={invoice !== ""}
                                            className="
            w-full rounded-xl border border-gray-300
            px-3 py-2 outline-none transition
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400
          "
                                        />
                                    </div>
                                </div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    เลขภาษี 4 หลักท้าย
                                </label>

                                <div className="flex gap-2">
                                    {pin.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleChange(e.target.value, index)
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(e, index)
                                            }
                                            onPaste={handlePaste}
                                            className="h-12 w-12 rounded border border-transparent bg-slate-100 p-1 text-center text-2xl font-extrabold text-slate-900 outline-none transition hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                        />
                                    ))}
                                </div>

                                {/* <div className="text-sm text-slate-500">
                                    เลขภาษี 4 หลักท้าย: {pin.join("")}
                                </div> */}

                                {/* CAPTCHA */}
                                <div className="flex justify-center overflow-auto">
                                    <Captcha onChange={setCaptchaToken} />
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-green-700 px-2 py-2 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "กำลังเรียกข้อมูล..."
                                        : "ตรวจสอบ"}
                                </button>

                                {/* <button
                                    onClick={() => setOpen(true)}
                                    className="rounded-xl bg-blue-600 px-5 py-3 text-white shadow-lg transition hover:bg-blue-700"
                                >
                                    เปิด Modal
                                </button> */}
                            </form>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-2 text-center text-sm text-gray-500">
                            © 2026 IT (MSD) - BGDK System
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}