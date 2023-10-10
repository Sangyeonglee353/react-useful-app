/* 날씨 정보 제공 페이지
 * [버전 1] 위도, 경도로 날씨 정보 출력
 * [버전 2] 주소로 날씨 정보 출력
 * [버전 3] 카카오 맵 좌표로 날씨 정보 출력
 * 1. 기상청 API
 * [구현]
 * [구현 전]
 * 요청 데이터 형식에 따른 값 출력(XML/JSON)
 * 1. 기본 샘플 구현
 * [기상청 API 데이터 종류]
 * 링크: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084
 */
import { useEffect } from "react";
import config from "../../api/apikey";
import { useState } from "react";

const WeatehrInfoPage = () => {
  const WEATHER_API_KEY = config.WEATHER_API_KEY;
  const [xhr, setXhr] = useState(null);

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = () => {
    let xhr = new XMLHttpRequest();
    setXhr(xhr);
    console.log("xhr: ", xhr);

    let url =
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"; /*URL*/
    let queryParams =
      "?" +
      encodeURIComponent("serviceKey") +
      "=" +
      WEATHER_API_KEY; /*Service Key*/
    queryParams +=
      "&" +
      encodeURIComponent("pageNo") +
      "=" +
      encodeURIComponent("1"); /*페이지 번호*/
    queryParams +=
      "&" +
      encodeURIComponent("numOfRows") +
      "=" +
      encodeURIComponent("1000"); /*한 페이지 결과 수*/
    queryParams +=
      "&" +
      encodeURIComponent("dataType") +
      "=" +
      encodeURIComponent("XML"); /*요청자료 형식(XML/JSON), Default: XML*/
    queryParams +=
      "&" +
      encodeURIComponent("base_date") +
      "=" +
      encodeURIComponent("20231010"); /*발표 일자*/
    queryParams +=
      "&" +
      encodeURIComponent("base_time") +
      "=" +
      encodeURIComponent("0600"); /*발표 시각*/
    queryParams +=
      "&" +
      encodeURIComponent("nx") +
      "=" +
      encodeURIComponent("55"); /*예보지점 X 좌표(경도: longitude)*/
    queryParams +=
      "&" +
      encodeURIComponent("ny") +
      "=" +
      encodeURIComponent("127"); /*예보지점 Y 좌표(위도: Latitude)*/

    if (xhr) {
      xhr.open("GET", url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          // alert(
          //   "Status: " +
          //     this.status +
          //     "nHeaders: " +
          //     JSON.stringify(this.getAllResponseHeaders()) +
          //     "nBody: " +
          //     this.responseText
          // );
          console.log("info: ", this.responseText);
          handleResponse(xhr);
        }
      };

      xhr.send("");
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

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let baseDate = item.getElementsByTagName("baseDate")[0].textContent;
        let baseTime = item.getElementsByTagName("baseTime")[0].textContent;
        let category = item.getElementsByTagName("category")[0].textContent;
        let nx = item.getElementsByTagName("nx")[0].textContent;
        let ny = item.getElementsByTagName("ny")[0].textContent;
        let obsrValue = item.getElementsByTagName("obsrValue")[0].textContent;

        console.log("baseDate:", baseDate); // 발표일자
        console.log("basetime:", baseTime); // 발표시각
        console.log("category:", category); // 자료구분코드 {PTY: , REH: , RN1: , T1H: , UUU: , VEC: , VVV: , WSD: }
        console.log("nx:", nx); // 입력한 예보지점 X 좌표(경도: Longitude)
        console.log("ny:", ny); // 입력한 예보지점 Y 좌표(위도: Latitude)
        console.log("obsrValue:", obsrValue); // 실황값
      }
    }
  };
  return (
    <section name="weatherinfo" className="flex w-full h-screen">
      <div className="w-full h-full bg-gray-800"></div>
    </section>
  );
};

export default WeatehrInfoPage;
