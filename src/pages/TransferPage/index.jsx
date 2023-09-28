import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const TransferPage = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {}, [result]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // 원하는 시트 이름을 선택합니다.
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 시트 데이터를 JSON으로 변환합니다.
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // jsonData를 사용하여 원하는 작업을 수행합니다.
        console.log("Excel 데이터:", jsonData);

        // jsonData를 저장합니다.
        setResult(jsonData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleDownloadClick = () => {
    if (result) {
      const jsonDataString = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonDataString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "excel.data.json";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section name="home" className="flex w-full h-screen bg-zinc-200">
      <div className="grid md:grid-cols-2 max-w-[1240px] m-auto bg-gray-300/10 px-10 py-5 rounded-xl text-black z-10">
        <div className="flex flex-col justify-center w-full px-2 py-8 md:items-start">
          <h1 className="py-3 text-3xl font-bold md:text-5xl">
            Transfer
            <br />
            Excel to JSON
          </h1>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="py-3 px-6 sm:w-[80%] my-4"
          />
          {result && (
            <button onClick={handleDownloadClick} className="p-3">
              JSON 파일 다운로드
            </button>
          )}
        </div>
        {result && (
          <div className="flex flex-col justify-center px-2">
            <h2 className="font-semibold xs:text-[48px] text-[40px] xs:leading-[76.8px] leading-[66.8px] w-full">
              Result
            </h2>
            <pre className="text-[18px] leading-[30.8px] max-w-[470px] h-[300px] mt-5 overflow-y-auto bg-white">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransferPage;
