/* [버전 2_드롭 다운 방식_개선] 위치 정보에 따른 위도와 경도 표시
 * 구현 방법
 * 1. 기상청 DB에서 지역 및 위도, 경도 정보가 담긴 데이터를 가져온다.
 * 2. 지역 정보는 1단계/2단계/3단계 총 3개의 섹터로 나누어 드롭다운 형식으로 보여준다.
 * 3. 사용자는 드롭다운 목록 중 원하는 지역을 선택한다.
 * 4. 선택을 완료하였다면 'Find' 버튼을 눌러 위도, 경도 값을 찾는다.
 *  - 데이터 존재 O: 위도, 경도 표시
 *  - 데이터 존재 X: 데이터를 찾을 수 없다는 문구 표시
 * 5. 개선사항
 *  - 드롭 다운 검색 기능 추가: 기존 select 대신 react-select 사용
 *  - 검색 후 Focus Enter 이동 기능 추가: handler 추가 [에러_추후 개선 예정_230929]
 *
 * **/
import { useEffect, useRef, useState } from "react";
import coordinateRawData from "../../assets/data/coordinateRawData";
import Select from "react-select"; // 일반 버전
import mapImg from "../../assets/images/map_bg.jpg";

const FindCoordinateV2Page = () => {
  const [coordinateData, setCoordinateData] = useState(null);
  const [sectorOne, setSectorOne] = useState([
    { value: "none", label: "선택안함" },
  ]);
  const [sectorTwo, setSectorTwo] = useState([
    { value: "none", label: "선택안함" },
  ]);
  const [sectorThree, setSectorThree] = useState([
    { value: "none", label: "선택안함" },
  ]);
  const [sectorOneValue, setSectorOneValue] = useState("");
  const [sectorTwoValue, setSectorTwoValue] = useState("");
  const [sectorThreeValue, setSectorThreeValue] = useState("");
  const [latitude, setLatitude] = useState(""); // 위도
  const [longitude, setLongitude] = useState(""); // 경도
  const [errorText, setErrorText] = useState(false);
  const sectorOneSelectRef = useRef(null);
  const sectorTwoSelectRef = useRef(null);
  const sectorThreeSelectRef = useRef(null);
  const findRef = useRef(null);

  useEffect(() => {
    setCoordinateData(coordinateRawData);
  }, []);

  useEffect(() => {
    /* 🎇[개선 필요 부분]_230929 */
    if (coordinateData != null) {
      handleSectorData();
    }
  }, [coordinateData, sectorOne, sectorTwo, sectorThree]);

  useEffect(() => {}, [latitude, longitude]);

  const handleSectorData = () => {
    /* ✅ sector Data Load Check */
    // console.log("coordinateData: ", coordinateData[0]["1단계"]);
    // console.log("coordinateData length: ", coordinateData.length);
    // console.log("sectorOne length: ", sectorOne.length);
    // console.log("sectorTwo length: ", sectorTwo.length);
    // console.log("sectorThree length: ", sectorThree.length);

    coordinateData.forEach((data) => {
      const firstStep = data["1단계"];
      const secondStep = data["2단계"];
      const thirdStep = data["3단계"];

      if (firstStep) {
        if (!sectorOne.some((item) => item.value === firstStep)) {
          setSectorOne([...sectorOne, { value: firstStep, label: firstStep }]);
        }
      }
      if (secondStep) {
        if (!sectorTwo.some((item) => item.value === secondStep)) {
          setSectorTwo([
            ...sectorTwo,
            { value: secondStep, label: secondStep },
          ]);
        }
      }
      if (thirdStep) {
        if (!sectorThree.some((item) => item.value === thirdStep)) {
          setSectorThree([
            ...sectorThree,
            { value: thirdStep, label: thirdStep },
          ]);
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
    const selectedOptionValue = event.value;
    console.log("Selected option value: " + selectedOptionValue);
    setSectorOneValue(selectedOptionValue);
  };
  const handleSectorTwoSelectChange = (event) => {
    const selectedOptionValue = event.value;
    setSectorTwoValue(selectedOptionValue);
  };
  const handleSectorThreeSelectChange = (event) => {
    const selectedOptionValue = event.value;
    setSectorThreeValue(selectedOptionValue);
  };

  const handleSectorOneSelectKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지
      sectorTwoSelectRef.current.focus(); // 두번째 선택으로 Focus 이동
    }
  };
  const handleSectorTwoSelectKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지
      sectorThreeSelectRef.current.focus(); // 세번째 선택으로 Focus 이동
    }
  };
  const handleSectorThreeSelectKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지
      sectorThreeSelectRef.current.focus(); // Find 버튼으로 Focus 이동
    }
  };

  //   const handleKeyPress = (event) => {
  //     if (event.key === "Enter") {
  //       event.preventDefault(); // Enter 키의 기본 동작 방지

  //       if (document.activeElement === sectorOneSelectRef.current) {
  //         // 첫 번째 Select가 포커스되어 있을 때
  //         sectorTwoSelectRef.current.focus();
  //       } else if (document.activeElement === sectorTwoSelectRef.current) {
  //         // 두 번째 Select가 포커스되어 있을 때
  //         sectorThreeSelectRef.current.focus();
  //       } else if (document.activeElement === sectorThreeSelectRef.current) {
  //         // 세 번째 Select가 포커스되어 있을 때
  //         findRef.current.focus();
  //       }
  //     }
  //   };
  return (
    <section name="match" className="flex w-full h-screen">
      <div className="w-full h-screen bg-slate-900/10 absolute -z-9999">
        <img
          className="object-cover w-full h-full mix-blend-overlay backdrop-opacity-5"
          src={mapImg}
          alt="mapImg"
        />
      </div>
      <div className="flex flex-col justify-center w-full max-w-screen-lg py-10 m-auto bg-white/80 z-10 rounded-xl">
        <div className="text-center">
          <h2 className="text-5xl font-bold">Where is?</h2>
          <div className="xl:flex xl:flex-row ">
            <div className="flex flex-col xl:w-[500px] py-6 text-3xl justify-center items-center xl:items-left">
              <div className="flex">
                <label htmlFor="sectorOneSelect" className="px-5 py-2">
                  구역 1
                </label>
                <Select
                  id="sectorOneSelect"
                  onChange={handleSectorOneSelectChange}
                  value={sectorOne.find(
                    (option) => option.value === sectorOneValue
                  )}
                  className="w-[300px]"
                  options={sectorOne}
                  isSearchable={true} // 검색 활성화
                  onKeyPress={handleSectorOneSelectKeyPress}
                  ref={sectorOneSelectRef}
                />
              </div>
              <div className="flex">
                <label htmlFor="sectorTwoSelect" className="px-5 py-2">
                  구역 2
                </label>
                <Select
                  id="sectorTwoSelect"
                  onChange={handleSectorTwoSelectChange}
                  value={sectorTwo.find(
                    (option) => option.value === sectorTwoValue
                  )}
                  className="w-[300px]"
                  options={sectorTwo}
                  isSearchable={true}
                  onKeyPress={handleSectorTwoSelectKeyPress}
                  ref={sectorTwoSelectRef}
                />
              </div>
              <div className="flex">
                <label htmlFor="sectorThreeSelect" className="px-5 py-2">
                  구역 3
                </label>
                <Select
                  id="sectorThreeSelect"
                  onChange={handleSectorThreeSelectChange}
                  value={sectorThree.find(
                    (option) => option.value === sectorThreeValue
                  )}
                  className="w-[300px]"
                  options={sectorThree}
                  isSearchable={true}
                  onKeyPress={handleSectorThreeSelectKeyPress}
                  ref={sectorThreeSelectRef}
                />
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
                ref={findRef}
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

export default FindCoordinateV2Page;
