"use client";

import React, { useEffect, useState } from "react";
import PaymentDetailForm from "../components/PaymentDetailForm";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type ApiResponse = {
  MessageCode: number;
  count: number;
  Result: any[];
};

const hospitalOptions = [
  // { value: "11537", label: "รพก" },
  { value: "14641", label: "รพร" },
  { value: "11539", label: "รพต" },
  // { value: "11541", label: "รพจ" },
  // { value: "25060", label: "รพข" },
  // { value: "41582", label: "รพบ" },
  { value: "41522", label: "รพป" },
  // { value: "11538", label: "รพภ" },
  // { value: "11540", label: "รพท" },
  // { value: "11536", label: "รพว" },
  // { value: "15049", label: "รพส" },
];

export default function BgdkPage() {
  const [hptcode, setHptcode] = useState("11537");
  const [texno, setTexno] = useState("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    router.push("/bgdk/login");
    router.refresh();

  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/next/api/bgdk/bg02/"+texno, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN_B}`
        },
        body: JSON.stringify({
          hptcode,
          texno,
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.MessageCode === 200 && result.count > 0) {
        setData(result.Result[0]);
      } else {
        setData(null);
        setError("ไม่พบข้อมูล");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* FILTER */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            ค้นหาข้อมูลฎีกา &nbsp; &nbsp;
            <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
      >
        Logout
      </button>
          </h1>

          

          <div className="grid gap-4 md:grid-cols-3">

            {/* HOSPITAL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                หน่วยงาน
              </label>

              <select
                value={hptcode}
                onChange={(e) =>
                  setHptcode(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
              >
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

            {/* TEXNO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                เลขที่ขอเบิก / TAXNO
              </label>

              <input
                type="text"
                value={texno}
                onChange={(e) =>
                  setTexno(e.target.value)
                }
                placeholder="กรอกเลขที่"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button
                onClick={fetchData}
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 cursor-pointer disabled:opacity-50"
              >
                {loading ? "กำลังค้นหา..." : "ค้นหา"}
              </button>
            </div>
          </div>

          

          {/* PAYLOAD PREVIEW */}
          {/* <div className="mt-6 rounded-xl bg-gray-100 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-700">
              Request Payload
            </div>

            <pre className="overflow-auto text-sm text-gray-800">
              {JSON.stringify(
                {
                  hptcode: hptcode,
                  texno: texno,
                },
                null,
                2
              )}
            </pre>
          </div> */}

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* RESULT */}
        {data && (
          <PaymentDetailForm data={data} />
        )}
      </div>
    </div>
  );
}