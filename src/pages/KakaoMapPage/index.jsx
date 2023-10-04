/* 카카오맵 호출 페이지 */
/* [버전 1]_JS만을 사용한
 * 주요 기능
 * [구현]
 * 카카오 API를 이용하여 지도 출력
 * 중심 위도와 경도 표시
 * 이동이 완료된 이후 표시
 * 현재 위치의 마커 표시하기
 * [구현전]
 * 선택한 위치로 이동하기
 * [버전 UP]
 * react-kakako-map-sdk 사용
 * 참고 사항
 * index.html에서 kakao api를 호출할 때는 상관 없으나, 해당 파일에서 kakao api호출 시에는 autoload=false 옵션을 추가해주어야 한다.
 */
import { useEffect, useState } from "react";
import kakaoImg from "../../assets/images/kakao_bg.png";
import Script from "react-load-script";
import config from "../../api/apikey";

const KakaoMapPage = () => {
  const KAKAO_API_KEY = config.KAKAO_API_KEY;
  const [latitude, setLatitude] = useState(""); // 위도
  const [longitude, setLongitude] = useState(""); // 경도

  const getKakaoMapData = () => {
    try {
      // Kakao 지도 API 초기화
      //   const script = document.createElement("script");
      //   script.async = true;
      //   script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}`;
      //   document.head.appendChild(script);

      //   script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("kakao-map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 좌표 설정
          level: 3, // 확대 수준 설정
        };
        const map = new window.kakao.maps.Map(container, options);

        // 🚀 Present marker function in the map
        const presentMarker = (latitude, longitude) => {
          // 1. set marker position
          let position = new window.kakao.maps.LatLng(latitude, longitude);
          // 2. create a marker
          let marker = new window.kakao.maps.Marker({
            position: position,
          });
          // 3. create a maker in the map
          marker.setMap(map);
        };

        // 🚀 Static present the map maker
        presentMarker(37.5665, 126.978);

        // 🚀 Get map coordinate info
        // [1] center_changed: 중심 좌표가 변경된 경우
        // [2] dragend: 드래그가 끝난 경우
        window.kakao.maps.event.addListener(map, "dragend", () => {
          let center = map.getCenter();
          setLatitude(center.getLat());
          setLongitude(center.getLng());

          // 🚀 Dynamic present the map maker
          presentMarker(center.getLat(), center.getLng());
        });
      });
      //   };

      return () => {
        // 컴포넌트 언마운트 시 스크립트 제거
        // document.head.removeChild(script);
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getKakaoMapData();
  }, []);

  return (
    <section name="match" className="flex w-full h-screen relative">
      {/* 배경 이미지: 색상_FFD701 */}
      <div className="w-full h-full absoulte bg-kakao-color"></div>
      <div className="w-full h-full absolute inset-0 flex items-end justify-center">
        <img
          className="object-cendoslfter h-[200px]"
          src={kakaoImg}
          alt="kakaoImg"
        />
      </div>

      {/* 콘텐츠 */}
      <Script
        url={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`}
        onLoad={getKakaoMapData}
      />
      <div className="flex flex-col absolute w-full h-full">
        <div className="flex flex-col w-[500px] h-[500px] m-auto z-10">
          <h2 className="text-center">
            위도: {latitude}, 경도: {longitude}
          </h2>
          <div id="kakao-map" className="w-full h-full"></div>
        </div>
      </div>
    </section>
  );
};

export default KakaoMapPage;
