/* [버전 1_드롭 다운 방식] 위치 정보에 따른 위도와 경도 표시
 * 구현 방법
 * 1. 기상청 DB에서 지역 및 위도, 경도 정보가 담긴 데이터를 가져온다.
 * 2. 지역 정보는 1단계/2단계/3단계 총 3개의 섹터로 나누어 드롭다운 형식으로 보여준다.
 * 3. 사용자는 드롭다운 목록 중 원하는 지역을 선택한다.
 * 4. 선택을 완료하였다면 'Find' 버튼을 눌러 위도, 경도 값을 찾는다.
 *  - 데이터 존재 O: 위도, 경도 표시
 *  - 데이터 존재 X: 데이터를 찾을 수 없다는 문구 표시
 *
 * **/
import { useEffect, useState } from "react";
import coordinateRawData from "../../assets/data/coordinateRawData";

const FindCoordinateV1Page = () => {
  const [coordinateData, setCoordinateData] = useState(null);
  const [sectorOne, setSectorOne] = useState([]);
  const [sectorTwo, setSectorTwo] = useState([]);
  const [sectorThree, setSectorThree] = useState([]);
  const [sectorOneValue, setSectorOneValue] = useState("");
  const [sectorTwoValue, setSectorTwoValue] = useState("");
  const [sectorThreeValue, setSectorThreeValue] = useState("");
  const [latitude, setLatitude] = useState(""); // 위도
  const [longitude, setLongitude] = useState(""); // 경도
  const [errorText, setErrorText] = useState(false);

  useEffect(() => {
    setCoordinateData(coordinateRawData);
  }, []);

  useEffect(() => {
    if (coordinateData != null) {
      handleSectorData();
    }
  }, [coordinateData, sectorOne, sectorTwo, sectorThree]);

  useEffect(() => {}, [latitude, longitude]);

  const handleSectorData = () => {
    console.log("coordinateData: ", coordinateData[0]["1단계"]);
    console.log("coordinateData length: ", coordinateData.length);
    console.log("sectorOne length: ", sectorOne.length);
    console.log("sectorTwo length: ", sectorTwo.length);
    console.log("sectorThree length: ", sectorThree.length);

    coordinateData.forEach((data) => {
      const firstStep = data["1단계"];
      const secondStep = data["2단계"];
      const thirdStep = data["3단계"];

      if (firstStep) {
        if (!sectorOne.includes(firstStep)) {
          setSectorOne([...sectorOne, firstStep]);
        }
      }
      if (secondStep) {
        if (!sectorTwo.includes(secondStep)) {
          setSectorTwo([...sectorTwo, secondStep]);
        }
      }
      if (thirdStep) {
        if (!sectorThree.includes(thirdStep)) {
          setSectorThree([...sectorThree, thirdStep]);
        }
      }
    });
  };

  const findCoordinates = (level1, level2, level3) => {
    const matchingData = coordinateData.find((data) => {
      return (
        data["1단계"] === level1 &&
        data["2단계"] === level2 &&
        data["3단계"] === level3
      );
    });

    if (matchingData) {
      const latitude = `${matchingData["위도(시)"]}° ${matchingData["위도(분)"]}′ ${matchingData["위도(초)"]}″`;
      const longitude = `${matchingData["경도(시)"]}° ${matchingData["경도(분)"]}′ ${matchingData["경도(초)"]}″`;
      setLatitude(latitude);
      setLongitude(longitude);
      setErrorText(false);
    } else {
      setLatitude("");
      setLongitude("");
      setErrorText(true);
      return alert("데이터를 찾을 수 없습니다.");
    }
  };

  const handleSectorOneSelectChange = (event) => {
    const selectedOptionValue = event.target.value;
    setSectorOneValue(selectedOptionValue);
  };
  const handleSectorTwoSelectChange = (event) => {
    const selectedOptionValue = event.target.value;
    setSectorTwoValue(selectedOptionValue);
  };
  const handleSectorThreeSelectChange = (event) => {
    const selectedOptionValue = event.target.value;
    setSectorThreeValue(selectedOptionValue);
  };

  return (
    <section name="match" className="flex w-full h-screen">
      <div className="flex flex-col justify-center w-full h-full max-w-screen-lg p-4 mx-auto">
        <div className="text-center">
          <h2 className="text-5xl font-bold">Where is?</h2>
          <div className="xl:flex xl:flex-row ">
            <div className="flex flex-col xl:w-[500px] py-6 text-3xl justify-center items-center xl:items-left">
              <div className="flex">
                <label htmlFor="sectorOneSelect" className="px-5 py-2">
                  구역 1
                </label>
                <select
                  id="sectorOneSelect"
                  onChange={handleSectorOneSelectChange}
                  value={sectorOneValue}
                  className="w-[300px]"
                >
                  <option value="" selected>
                    선택안함
                  </option>
                  {sectorOne.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex">
                <label htmlFor="sectorTwoSelect" className="px-5 py-2">
                  구역 2
                </label>
                <select
                  id="sectorTwoSelect"
                  onChange={handleSectorTwoSelectChange}
                  value={sectorTwoValue}
                  className="w-[300px]"
                >
                  <option value="" selected>
                    선택안함
                  </option>
                  {sectorTwo.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex">
                <label htmlFor="sectorThreeSelect" className="px-5 py-2">
                  구역 3
                </label>
                <select
                  id="sectorThreeSelect"
                  onChange={handleSectorThreeSelectChange}
                  value={sectorThreeValue}
                  className="w-[300px]"
                >
                  <option value="" selected>
                    선택안함
                  </option>
                  {sectorThree.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="mt-3 py-2 md:w-[450px]"
                onClick={() =>
                  findCoordinates(
                    sectorOneValue,
                    sectorTwoValue,
                    sectorThreeValue
                  )
                }
              >
                Find
              </button>
            </div>
            <div className="flex flex-col py-6 text-3xl justify-center items-center">
              {errorText ? (
                <span>데이터를 찾을 수 없습니다.</span>
              ) : (
                <>
                  <span className="px-5">위도: {latitude}</span>
                  <span className="px-5">경도: {longitude}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindCoordinateV1Page;
