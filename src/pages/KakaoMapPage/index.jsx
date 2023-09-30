/* 카카오맵 호출 페이지 */
/*
 * 주요 기능
 * 카카오 API를 이용하여 지도 출력
 *
 *
 */
import { useEffect } from "react";
import kakaoImg from "../../assets/images/kakao_bg.png";
import Script from "react-load-script";

const KakaoMapPage = () => {
  const KAKAO_API_KEY = "none";
  const getKakaoMapData = () => {
    try {
      // Kakao 지도 API 초기화
      const script = document.createElement("script");
      //   script.async = true;
      //   script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}`;
      document.head.appendChild(script);

      //   script.onload = () => {
      // window.kakao.maps.load(() => {
      const container = document.getElementById("kakao-map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 좌표 설정
        level: 5, // 확대 수준 설정
      };
      const map = new window.kakao.maps.Map(container, options);
      // });
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
        <img className="object-center" src={kakaoImg} alt="kakaoImg" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex absolute justify-center items-center w-full h-full">
        <div className="flex justify-center items-center w-[500px] h-[500px] m-auto bg-blue-500 z-10">
          <div id="kakao-map" className="w-[500px] h-[500px]"></div>
          {/* <Script
            url={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}`}
            onLoad={getKakaoMapData}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default KakaoMapPage;
