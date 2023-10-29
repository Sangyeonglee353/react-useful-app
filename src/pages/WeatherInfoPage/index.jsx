/* 날씨 정보 제공 페이지
 * [버전 1] 위도, 경도로 날씨 정보 출력
 * [버전 2] 주소로 날씨 정보 출력
 * [버전 3] 카카오 맵 좌표로 날씨 정보 출력
 *
 * 기상청 API 출력 데이터 유형
 * [0] lGT: 낙뢰(kA),
 * [1] PTY: 강수형태(코드값), {0: 없음 / 1: 비 / 2: 비/눈 / 3: 눈/비 / 4: 눈}
 * [2] RN1: 1시간 강수량(범주 1mm),
 * [3] SKY: 하늘상태(코드값), {1: 맑음, 2: 구름조금, 3: 구름많음, 4: 흐림}
 * [4] T1H: 기온(℃),
 * [5] REH: 습도(%),
 * [6] UUU: 동서바람성분(m/s),
 * [7] VVV: 남북바람성분(m/s),
 * [8] VEC: 풍향(deg),
 * [9] WSD: 풍속(m/s)
 *
 * [기능 정의]
 * 1. 기상청으로부터 총 8개의 데이터를 가져올 수 있다.
 * 하지만, 모든 값을 기준으로 날씨를 판별하긴 어려우므로,
 * (1) 강수형태, (2) 습도, (3) 기온만을 가지고 날씨를 판별한다.
 * 2. 초단기예보: 발표시간을 기준으로 +6시간의 정보를 제공
 *   - 현재시간과 비교했을 때 가장 가까운 비교시간을 추출하는 알고리즘 필요(x)
 *   - 이미 기상청 API에서 이와 같이 제공중 따라서, 현재시간만 입력하도록 변경
 *   - 목적: 사용자의 선택 요소를 가급적이면 최소한으로 하고자함.
 * 3.
 * [구현]
 * 1. 오늘 날짜 가져오기
 * 2. 기상청 API 호출
 * 3. 월이 '1자리' 일때 Today가 잘 호출 되는지 확인 필요 (x) -> 0부터 시작하도록 변경
 * 4. 현재 시간을 기준으로 가장 근접한 발표 시간의 예보 출력
 * [구현 전]
 * 1. 요청 데이터 형식에 따른 값 출력(XML/JSON) -> JSON형식으로 변환 & async 적용
 * 2. 경도/위도 -> nx/ny 좌표 변환(기상청 변환 엑셀 시트 기반)
 * 3. UI: nx, ny와 함께 위도, 경도, 주소까지 출력되도록 변경
 * 4. 6시간의 기상 예보 내역 표시(차트 & 막대 그래프)
 * [주의 사항]
 * 기상청에서 제공하는 엑셀 시트를 기준으로 위도와 경도값을
 * 격자(nx, ny)값으로 변환해서 요청해야 한다. or 변환식 적용
 *
 * [기상청 API 참고]
 * 데이터 유형: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084
 * 코드값: https://www.kma.go.kr/images/weather/lifenindustry/timeseries_XML.pdf
 * API 목록: https://apihub.kma.go.kr/apiList.do?seqApi=10&seqApiSub=286
 * 현재 사용 API: 동네예보(초단기실황·초단기예보·단기예보) 조회
 * -----------------------------------
 * 단기예보 조회서비스(API별 URL 차이)
 * -----------------------------------
 * getUltraSrtNcst: 초단기실황조회
 * getUltraSrtFcst: 초단기예보조회
 * getVilageFcst: 단기예보조회
 * getFcstVersion: 예보버전조회
 * 해당 페이지의 목적은 당일 날씨만 가져오는 것이다.
 * 따라서, (초단기예보조회)
 * 현재 날짜와 시간을 기준으로 가장 최근의 날씨 정보를 가져오는 것이 적합하다.
 */
import { useEffect } from "react";
import config from "../../api/apikey";
import { useState } from "react";
import sunIcon from "../../assets/images/sun.png"; // Clear: 맑음
import cloudyIcon from "../../assets/images/cloudy.png"; // Partly Cloudy: 구름조금
import fogIcon from "../../assets/images/fog.png"; // Mostly Cloudy:구름많음
import fogDarkIcon from "../../assets/images/fog_dark.png"; // Cloudy: 흐림
import rainIcon from "../../assets/images/rain.png"; // Rain: 비
import snowIcon from "../../assets/images/snow.png"; // Snow: 눈
// import rainSnowIcon from "../../asstes/images/rain_snow.png"; // 아이콘 준비중
import Chart from "../../components/Chart";

const WeatehrInfoPage = () => {
  const WEATHER_API_KEY = config.WEATHER_API_KEY;
  const [xhr, setXhr] = useState(null);
  // 예보시각별로 저장
  const [weatherData, setWeatherData] = useState({
    baseDate: null, // 발표일자
    baseTime: null, // 발표시각
    nx: null, // 입력한 예보지점 X 좌표(경도: Longitude 변환값)
    ny: null, // 입력한 예보지점 Y 좌표(위도: Latitude 변환값)
    fcstDate: null, // 예보날짜
    fcstTimeList: [], // 예보시각
    tempValueList: [], // 온도(℃)_자료구분코드: T1H
    statusValueList: [], // 강수형태(코드값)_자료구분코드: PTY + 하늘상태(코드값)_자료구분코드: SKY
    humidityValueList: [], // 습도(%)_자료구분코드: REH
  });

  useEffect(() => {
    const fetchData = async () => {
      await getWeatherData();
    };
    fetchData();
  }, []);

  // const [categoryList, setCategoryList] = useState([]); // 카테고리 확인 -> 총 10개
  // const [fcstTimeList, setFcstTimeList] = useState([]); // 예보시각 확인 -> 총 6개
  // useEffect(() => {
  //   const uniqueArray = [...new Set(categoryList)];
  //   console.log(uniqueArray);
  // }, [categoryList]);

  // useEffect(() => {
  //   const uniqueArray = [...new Set(fcstTimeList)];
  //   console.log(uniqueArray);
  // }, [fcstTimeList]);

  const getWeatherData = async () => {
    try {
      // 1. 오늘 날짜 가져오기 & 현재 시간 가져오기
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, 0); // 0부터 시작하므로 +1 & 1자리 인경우 0으로 시작
      const day = today.getDate();
      const hours = today.getHours().toString().padStart(2, 0);
      const minutes = today.getMinutes().toString().padStart(2, 0);

      // [기능] API 호출 시간 변경
      // 매 API 제공시간 이전에는 해당 시간의 00~30분은 동작하지 않는다.
      // 해당 시간의 API가 발표된 이후에는 가장 근접한 발표시간의 값을 반환한다.
      // 따라서, 00~30분인 경우, 이전 시간의 발표시각을 기준으로 API 호출
      let baseTime = "";
      if (minutes < "30") {
        baseTime = (today.getHours() - 1).toString().padStart(2, 0) + "30";
      } else {
        baseTime = hours + minutes;
      }

      // 2. 기상청 API 호출
      const xhr = new XMLHttpRequest();
      setXhr(xhr);

      const url =
        // "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"; /*URL: 초단기실황예보*/
        "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"; /*URL: 초단기예보*/
      const queryParams = new URLSearchParams();
      queryParams.append("serviceKey", WEATHER_API_KEY); // Decoding Key를 써야함!
      queryParams.append("pageNo", "1");
      queryParams.append("numOfRows", "1000");
      queryParams.append("dataType", "XML");
      queryParams.append("base_date", `${year}${month}${day}`);
      queryParams.append("base_time", baseTime);
      queryParams.append("nx", "55");
      queryParams.append("ny", "127");

      xhr.open("GET", url + "?" + queryParams.toString());

      const response = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(xhr);
            } else {
              reject(new Error("Failed to fetch data"));
            }
          }
        };
        xhr.send();
      });
      handleResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  // XML 문자열을 파싱하여 JSON 객체로 변환하는 함수
  const parseXML = (xmlString) => {
    let xmlDoc;

    if (window.DOMParser) {
      let parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlString, "text/xml");
    } else {
      // Internet Explorer용
      // xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      // xmlDoc.async = false;
      // xmlDoc.loadXML(xmlString);
      console.error("This borowser does not support ActiveXObject");
      xmlDoc = null;
    }

    return xmlDoc;
  };

  // XML 문자열에서 데이터 추출하기
  const handleResponse = (xhr) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let xmlString = xhr.responseText;
      let xmlDoc = parseXML(xmlString);
      let items = xmlDoc.getElementsByTagName("item");

      console.log("handleResponse Running");

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let baseDate = item.getElementsByTagName("baseDate")[0].textContent;
        let baseTime = item.getElementsByTagName("baseTime")[0].textContent;
        let category = item.getElementsByTagName("category")[0].textContent;
        let nx = item.getElementsByTagName("nx")[0].textContent;
        let ny = item.getElementsByTagName("ny")[0].textContent;
        let fcstDate = item.getElementsByTagName("fcstDate")[0].textContent;
        let fcstTime = item.getElementsByTagName("fcstTime")[0].textContent;
        let fcstValue = item.getElementsByTagName("fcstValue")[0].textContent; // 예보값

        // 값 저장
        if (i === 0) {
          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            baseDate: baseDate,
            baseTime: baseTime,
            nx: nx,
            ny: ny,
            fcstDate: fcstDate,
          }));
          console.log("baseDate: ", baseDate);
          console.log("baseTime: ", baseTime);
          console.log("nx: ", nx);
          console.log("ny: ", ny);
          console.log("fcstDate: ", fcstDate);
        }

        // 예보시각(6개)를 기준으로 총 10개의 값이 호출됨.
        // 현재 총 120개 저장
        // 120 = 6 * 10 * 2(?)
        // 온도와 습도 모두 중복된 값이 2번 들어감.
        // 현재 이게 2번 실행되고 있음?!
        if (i >= 0 && i <= 5) {
          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            fcstTimeList: [...prevWeatherData.fcstTimeList, fcstTime],
          }));
        } else if (weatherData.fcstTimeList[0] === fcstTime) {
          console.log("test");
        }

        if (category === "T1H") {
          // 기온(℃)
          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            tempValueList: [...prevWeatherData.tempValueList, fcstValue],
          }));
          // console.log("tempValue: ", fcstValue);
        } else if (category === "PTY") {
          // 강수상태(코드값) -> 텍스트 변환
          let status;
          if (fcstValue === "0") {
            status = "없음";
          } else if (fcstValue === "1") {
            status = "비";
          } else if (fcstValue === "2") {
            status = "비&눈";
          } else if (fcstValue === "3") {
            status = "눈&비";
          } else if (fcstValue === "4") {
            status = "눈";
          } else {
            status = "측정불가";
          }

          // [조건] 강수상태 = "없음"인 경우: 하늘상태만 보면 되므로 제외
          // ✅ 단, 확인필요사항: "없음" 이외의 경우: 하늘 상태는 "흐림"으로 고정인지?
          if (status !== "없음") {
            setWeatherData((prevWeatherData) => ({
              ...prevWeatherData,
              statusValueList: [...prevWeatherData.statusValueList, status],
            }));
            // console.log(
            //   "statusValue(강수상태): ",
            //   fcstValue + "(" + status + ")"
            // );
          }
        } else if (category === "SKY") {
          // 하늘상태(코드값) -> 텍스트 변환
          let status;
          if (fcstValue === "1") {
            status = "맑음";
          } else if (fcstValue === "2") {
            status = "구름조금";
          } else if (fcstValue === "3") {
            status = "구름많음";
          } else if (fcstValue === "4") {
            status = "흐림";
          } else {
            status = "측정불가";
          }

          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            statusValueList: [...prevWeatherData.statusValueList, status],
          }));
          // console.log(
          //   "statusValue(하늘상태): ",
          //   fcstValue + "(" + status + ")"
          // );
        } else if (category === "REH") {
          // 습도
          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            humidityValueList: [
              ...prevWeatherData.humidityValueList,
              fcstValue,
            ],
          }));
          // console.log("humidityValue: ", fcstValue);
        }
      }
    }
  };
  return (
    <section name="weatherinfo" className="flex w-full h-screen">
      <div className="w-full h-full bg-[#85c6f8] flex flex-col justify-center items-center">
        <div className="w-1/2 h-auto xl:h-1/2 bg-white rounded-md">
          <h2 className="font-bold text-center text-2xl mt-5">Weather Info</h2>
          <div className="xl:h-[calc(50vh-3.25rem)] flex flex-col xl:flex-row justify-center items-center px-10">
            {weatherData.baseDate !== null ? (
              <>
                <div className="w-full xl:w-1/3 flex flex-col justify-center items-center">
                  <div className="flex justify-center items-center mt-5">
                    <div className="relative">
                      <img
                        src={
                          weatherData.statusValueList[0] === "맑음"
                            ? sunIcon
                            : weatherData.statusValueList[0] === "구름조금"
                            ? cloudyIcon
                            : weatherData.statusValueList[0] === "구름많음"
                            ? fogIcon
                            : weatherData.statusValueList[0] === "흐림"
                            ? fogDarkIcon
                            : weatherData.statusValueList[0] === "비" ||
                              weatherData.statusValueList[0] === "비&눈"
                            ? rainIcon
                            : weatherData.statusValueList[0] === "눈&비" ||
                              weatherData.statusValueList[0] === "눈"
                            ? snowIcon
                            : sunIcon
                        }
                        alt="weather_sun"
                        className="max-w-[15rem] xl:max-w-1/2"
                      />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl">
                        {weatherData.baseTime.slice(0, 2)}시{" "}
                        {weatherData.baseTime.slice(2)}분
                      </span>
                    </div>
                  </div>
                  {/* <span className="block text-center mt-2">
                  {weatherData.nx}, {weatherData.ny}
                </span> */}
                  <span className="block text-center text-xl mt-2">
                    {weatherData.tempValueList[0]}℃ /{" "}
                    {weatherData.humidityValueList[0]}%
                  </span>
                  <span className="block font-bold text-center text-2xl mt-2">
                    {weatherData.baseDate.slice(0, 4)}년{" "}
                    {weatherData.baseDate.slice(4, 6)}월{" "}
                    {weatherData.baseDate.slice(6)}일
                  </span>
                </div>
                <div className="w-full xl:w-2/3 flex flex-col justify-center items-center p-5">
                  <Chart weatherData={weatherData} />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatehrInfoPage;
