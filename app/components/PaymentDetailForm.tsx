"use client";

type Props = {
    data: any;
};

export default function PaymentDetailForm({ data }: Props) {
    const total =
        Number(data.dkamt || 0) +
        Number(data.vatamt || 0) -
        Number(data.taxjrtamt || 0) -
        Number(data.socamt || 0) -
        Number(data.fineamt || 0);

    const formatNumber = (num: number | string) => {
        return Number(num || 0).toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    function formatThaiDate(dateStr: string): string {
        const thaiMonths: { [key: string]: string } = {
            JAN: "มกราคม",
            FEB: "กุมภาพันธ์",
            MAR: "มีนาคม",
            APR: "เมษายน",
            MAY: "พฤษภาคม",
            JUN: "มิถุนายน",
            JUL: "กรกฎาคม",
            AUG: "สิงหาคม",
            SEP: "กันยายน",
            OCT: "ตุลาคม",
            NOV: "พฤศจิกายน",
            DEC: "ธันวาคม",
        };

        if (!dateStr)
            return ""

        const [day, month, year] = dateStr.split("-");

        const thaiMonth = thaiMonths[month.toUpperCase()];
        const buddhistYear = Number(`20${year}`) + 543;

        return `${Number(day)} ${thaiMonth} ${buddhistYear}`;
    }

    function formatInvoice(value: string) {

        if (!value)
            return
        // เอา 2 ตัวแรก
        const year = value.slice(0, 2);

        // เอา 4 ตัวท้าย
        const lastPart = value.slice(-4);

        // ตัด 0 ด้านหน้าออก
        const running = parseInt(lastPart, 10);

        return `${running}/${year}`;
    }

    function formatTime(value: string) {

        if (!value)
            return

        const h = value.slice(0, 2);

        const m = value.slice(2, 4);

        const s = value.slice(-2);

        return `${h}:${m}:${s}`;
    }


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="rounded-2xl bg-white p-6 shadow">
                    <h1 className="text-2xl font-bold text-gray-800">
                        รายละเอียดฎีกาเบิกเงิน
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        เลขที่ฎีกา : {formatInvoice(data.dkno)}
                    </p>
                </div>

                {/* SECTION 1 */}
                <Section title="ส่วนที่ 1 ข้อมูลคู่ค้า">
                    <InfoGrid
                        items={[
                            {
                                label: "บริษัท / เจ้าหนี้",
                                value: data.pytonm,
                            },
                            {
                                label: "ที่อยู่",
                                value: data.paytoaddr,
                            },
                            {
                                label: "เลขที่โครงการ e-GP",
                                value: data.egpno,
                            },
                            {
                                label: "เลขที่ใบสั่งซื้อ",
                                value: data.bgpono,
                            },
                            {
                                label: "วันที่สั่งซื้อ",
                                value: formatThaiDate(data.bgpodate),
                            },
                        ]}
                    />
                </Section>

                {/* SECTION 2 */}
                <Section title="ส่วนที่ 2 ข้อมูลการตั้งเบิกและงบประมาณ">
                    <InfoGrid
                        items={[
                            {
                                label: "ปีงบประมาณ",
                                value: data.year,
                            },
                            {
                                label: "เลขที่ขอเบิก",
                                value: formatInvoice(data.rcvno),
                            },
                            {
                                label: "เลขที่ฎีกาเบิกเงิน",
                                value: formatInvoice(data.dkno),
                            },
                            {
                                label: "ประเภทฎีกา",
                                value: data.bgdktype_name,
                            },
                            {
                                label: "ประเภทงบ",
                                value: data.bgtype_name,
                            },
                            {
                                label: "งาน / โครงการ",
                                value: data.bgjob_name,
                            },
                            {
                                label: "หมวดรายจ่าย",
                                value: data.bgexp_name,
                            },
                            {
                                label: "หมวดรายจ่ายย่อย",
                                value: data.bglst_name,
                            },
                            {
                                label: "ประเภท",
                                value: data.typenm,
                            },
                            {
                                label: "รายการ",
                                value: data.lstnm,
                            },
                            {
                                label: "แฟ้มส่งใบสำคัญ",
                                value: data.impqty || "ระบุ" + " ฉบับ",
                            },
                        ]}
                    />
                </Section>

                {/* SECTION 3 */}
                <Section title="ส่วนที่ 3 สรุปข้อมูลทางการเงิน">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <MoneyCard
                            title="ยอดเงินขอเบิก"
                            value={formatNumber(data.dkamt)}
                        />

                        <MoneyCard
                            title="ภาษีมูลค่าเพิ่ม (VAT)"
                            value={formatNumber(data.vatamt)}
                        />

                        <MoneyCard
                            title="ยอดรวมทั้งสิ้น"
                            value={formatNumber(
                                Number(data.dkamt) + Number(data.vatamt)
                            )}
                        />

                        <MoneyCard
                            title="ภาษีเงินได้นิติบุคคลหัก ณ ที่จ่าย"
                            value={formatNumber(data.taxjrtamt)}
                        />

                        <MoneyCard
                            title="หักประกันสังคม"
                            value={formatNumber(data.socamt)}
                        />

                        <MoneyCard
                            title="ค่าปรับ"
                            value={formatNumber(data.fineamt)}
                        />

                        <MoneyCard
                            title="เงินเบิกสุทธิ"
                            value={formatNumber(total)}
                            highlight
                        />
                    </div>
                </Section>

                {/* SECTION 4 */}
                <Section title="ส่วนที่ 4 รายละเอียดใบแจ้งหนี้">
                    <div className="overflow-x-auto rounded-2xl border">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        เลขที่ใบแจ้งหนี้
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        มูลค่าสินค้า (บาท)
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        ภาษีมูลค่าเพิ่ม (บาท)
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        จ่ายชำระ (บาท)
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {(data.taxno_list || "")
                                    .split(",")
                                    .map((item: string) => item.trim())
                                    .filter(Boolean)
                                    .map((taxno: string, index: number) => (
                                        <tr
                                            key={index}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            {/* เลขที่ใบแจ้งหนี้ */}
                                            <td className="px-4 py-3">
                                                {taxno}
                                            </td>

                                            {/* มูลค่าสินค้า */}
                                            <td className="px-4 py-3 text-right">
                                                xxx
                                            </td>

                                            {/* VAT */}
                                            <td className="px-4 py-3 text-right">
                                                xxx
                                            </td>

                                            {/* จ่ายชำระ */}
                                            <td className="px-4 py-3 text-right">
                                                xxx
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                {/* SECTION 5 */}
                <Section title="ส่วนที่ 5 สถานะการดำเนินการ">

                    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <InfoBox
                            label="วันที่จัดทำ"
                            value={`${formatThaiDate(data.rcvdate || "-")}
                             ${formatTime(data.rcvtime) || ""}`
                            }
                        />

                        <InfoBox
                            label="วันที่บันทึก"
                            value={`${formatThaiDate(data.opdate || "-")}
                            ${formatTime(data.optime) || ""}`
                            }
                        />

                        <InfoBox
                            label="วันที่ตรวจสอบ"
                            value={`${formatThaiDate(data.chkdate || "-")}
                            ${formatTime(data.chktime) || ""}`
                            }
                        />

                        <InfoBox
                            label="วันที่จ่าย"
                            value={formatThaiDate(data.paydate) + " X"}
                        />
                    </div>

                    <div className="overflow-x-auto rounded-2xl border">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-emerald-600 text-white">
                                <tr>
                                    <th className="px-4 py-3">ครั้งที่</th>
                                    <th className="px-4 py-3">สถานะ</th>
                                    <th className="px-4 py-3">
                                        ส่งฎีกาเบิกเงิน
                                    </th>
                                    <th className="px-4 py-3">
                                        ตรวจสอบ
                                    </th>
                                    <th className="px-4 py-3">
                                        ทักท้วง
                                    </th>
                                    <th className="px-4 py-3">
                                        รับคืนการเงิน
                                    </th>
                                    <th className="px-4 py-3">
                                        ส่งคืนการเงิน
                                    </th>
                                    <th className="px-4 py-3">
                                        รับคืนขอเบิก
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        xxx
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Section>
            </div>
        </div>
    );
}

/* ---------- COMPONENTS ---------- */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 border-b pb-3 text-xl font-bold text-gray-800">
                {title}
            </h2>

            {children}
        </div>
    );
}

function InfoGrid({
    items,
}: {
    items: {
        label: string;
        value: any;
    }[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-4"
                >
                    <div className="mb-1 text-sm text-gray-500">
                        {item.label}
                    </div>

                    <div className="font-medium text-gray-800 break-words">
                        {item.value || "-"}
                    </div>
                </div>
            ))}
        </div>
    );
}

function MoneyCard({
    title,
    value,
    highlight = false,
}: {
    title: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border p-5 shadow-sm ${highlight
                ? "border-green-500 bg-green-50"
                : "bg-white"
                }`}
        >
            <div className="text-sm text-gray-500">
                {title}
            </div>

            <div
                className={`mt-2 text-2xl font-bold ${highlight
                    ? "text-green-600"
                    : "text-gray-800"
                    }`}
            >
                {value}
            </div>
        </div>
    );
}

function InfoBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border bg-gray-50 p-4">
            <div className="text-sm text-gray-500">
                {label}
            </div>

            <div className="mt-1 font-semibold text-gray-800">
                {value || "-"}
            </div>
        </div>
    );
}