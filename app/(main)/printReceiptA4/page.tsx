"use client";

import React from "react";
import Image from "next/image";

const ReceiptPage: React.FC = () => {
  const data = {
    invoiceDetail: [
      {
        id: 3,
        studentFeeId: 1,
        amount: 1000,
        paymentMethod: "Cash",
        paidAt: "2025-06-20T10:00:00.000Z",
        receiptNo: "REC-0001",
        feeType: "Tution fee",
        fbrInvoiceNo: "987155EFTP59101810*test*",
      },
      {
        id: 4,
        studentFeeId: 1,
        amount: 500,
        paymentMethod: "Cash",
        paidAt: "2025-06-20T10:00:00.000Z",
        receiptNo: "REC-0001",
        feeType: "School fee",
        fbrInvoiceNo: "987155EFTP59101810*test*",
      },
    ],
    studentDetail: {
      fullName: "Abdul",
      grade: 1,
      class: 1,
      email: "abdulsattarde@gmail.com",
      phone: "+92 3116334492",
      address: "sahdj",
      guardianName: "Baloch",
      guardianPhone: "03116334492",
    },
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAObSURBVO3BQa5bRwADweZA979yx4ssuBrgQdK3nbAq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlxZuS8JNUWhKeULlJwhMqN0n4SSrvOMyUw0w5zJQXH6bySUn4kyWhqdyofFISPukwUw4z5TBTXnxZEp5QeULlJglPqLQkfFMSnlD5psNMOcyUw0x58ZdLwo1KS8ITKv8nh5lymCmHmfLiL6fSktCS0FRaEppKS8KNyn/JYaYcZsphprz4MpWfpPKOJDSVb1L5kxxmymGmHGbKiw9Lwk9KQlNpSWgqNyotCU2lJaGp3CThT3aYKYeZcpgp8Rf+Ykm4UWlJuFG5SUJT+S85zJTDTDnMlBdvSkJTaUm4UWlJeELlk5Jwo9KS0FRaEprKTRKaSkvCjco7DjPlMFMOM+XFhyWhqbQktCTcqHyTyk0SblSeSEJTuUnCjconHWbKYaYcZsqLL0tCU2lJaCotCTcqLQnflIQblRuVG5Xf6TBTDjPlMFPiL3xQEppKS0JTaUloKi0JTeUmCTcqLQlNpSXhk1RuktBUWhKayjsOM+UwUw4z5cWHqTyRhKbSkvAOlSdU3qHSktBUWhKayu90mCmHmXKYKS8+LAlNpak8odKS0JJwo9KS0FRaEm5UWhJaEprKN6l80mGmHGbKYaa8+GFJeIdKS0JTuVFpSWgqLQk3Ki0JN0loKi0JN0m4UXnHYaYcZsphprx4UxKaSktCU3lHEppKS8KNyk0SmkpLQlNpKi0JTeVPdpgph5lymCnxF36jJDyh8kQSblTekYRvUmlJuFF5x2GmHGbKYabEX/iLJeFG5SYJNyotCTcqTyThHSqfdJgph5lymCkv3pSEn6Ryo3KThBuVG5WWhJskNJUnVG6S0FTecZgph5lymCkvPkzlk5LwSSotCd+k8oTKEyqfdJgph5lymCkvviwJT6g8odKS0FRaEm6S0FSeSMI3JaGpfNJhphxmymGmvPjLJaGptCQ0lZaEmyTcqDyRhKZyk4Sm0pLQVN5xmCmHmXKYKS/+Z5LwhMoTSWgqTaUl4UalJaGpfNJhphxmymGmvPgylW9SuVH5kyThRqUloam0JDSVdxxmymGmHGbKiw9Lwk9KQlN5IglNpSXhRuUmCU3lT3aYKYeZcpgp8Rdm/nWYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgp/wA6a6r9ZzbA1gAAAABJRU5ErkJggg==",
  };

  const handlePrint = () => window.print();
  const totalAmount = data.invoiceDetail.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="p-6 print:p-0">
        <div
          id="receipt"
          className="max-w-3xl mx-auto bg-white border shadow-md rounded-lg mb-12 p-8 print:mb-0"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">
                Student Fee Receipt
              </h1>
              <p className="text-sm text-gray-500">
                Receipt No: {data.invoiceDetail[0].receiptNo}
              </p>
            </div>
            <div className="w-20 h-20 bg-gray-100 border flex items-center justify-center text-sm text-gray-500">
              Logo
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Student Information
              </h2>
              <p>
                <strong>Name:</strong> {data.studentDetail.fullName}
              </p>
              <p>
                <strong>Grade:</strong> {data.studentDetail.grade}
              </p>
              <p>
                <strong>Class:</strong> {data.studentDetail.class}
              </p>
              <p>
                <strong>Email:</strong> {data.studentDetail.email}
              </p>
              <p>
                <strong>Phone:</strong> {data.studentDetail.phone}
              </p>
              <p>
                <strong>Address:</strong> {data.studentDetail.address}
              </p>
              <p>
                <strong>Guardian:</strong> {data.studentDetail.guardianName} (
                {data.studentDetail.guardianPhone})
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Payment Summary
              </h2>
              <p>
                <strong>Payment Method:</strong>{" "}
                {data.invoiceDetail[0].paymentMethod}
              </p>
              <p>
                <strong>Paid At:</strong>{" "}
                {new Date(data.invoiceDetail[0].paidAt).toLocaleString()}
              </p>
              <p>
                <strong>FBR Invoice No:</strong>{" "}
                {data.invoiceDetail[0].fbrInvoiceNo}
              </p>
              <p>
                <strong>Total Amount:</strong> Rs {totalAmount}
              </p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Fee Type</th>
                  <th className="px-4 py-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.invoiceDetail.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.feeType}</td>
                    <td className="px-4 py-2 border">Rs {item.amount}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                  <td className="px-4 py-2 border text-right" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-2 border">Rs {totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Verify via QR Code
            </h2>
            <div className="inline-block border p-2 bg-gray-50">
              <Image src={data.qrCode} alt="QR Code" width={150} height={150} />
            </div>
          </div>
        </div>

        <div className="text-center mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white text-lg rounded shadow hover:bg-blue-700 transition"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </>
  );
};

export default ReceiptPage;
