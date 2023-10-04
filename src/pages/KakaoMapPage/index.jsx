/* 카카오맵 호출 페이지 */
/* [버전 1]_JS만을 사용한
 * 주요 기능
 * [구현]
 * 카카오 API를 이용하여 지도 출력
 * 중심 위도와 경도 표시하기
 * 드래그 이동 후 마커 표시하기
 * 현재 위치의 마커 표시하기
 * 클릭한 위치의 마커 표시하기
 * [구현전]
 * 마커 초기화 -> Refresh
 * 주소 검색 + 이동 기능
 * [버전 UP]
 * react-kakako-map-sdk 사용
 * 참고 사항
 * index.html에서 kakao api를 호출할 때는 상관 없으나, 해당 파일에서 kakao api호출 시에는 autoload=false 옵션을 추가해주어야 한다.
 * 🎇 Function, 🚀 Running function, 💫 Event, 📌 Define
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
        // 💫 Create Map
        const map = new window.kakao.maps.Map(container, options);

        // 💫 Create Address to Coordinates object
        // [Condition]
        // Must need to property 'libraries=services' in kakao api url.
        let geocoder = new window.kakao.maps.services.Geocoder();

        // 📌 Define marker & infowindow
        let marker = new window.kakao.maps.Marker();
        let infowindow = new window.kakao.maps.InfoWindow({ zindex: 1 });

        // 💫 Present address at map left-top, after search current center of map coordinates.
        window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          searchDetailAddrFromCoords(mouseEvent.latLng, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              let detailAddr = !!result[0].road_address
                ? "<div>도로명주소: " +
                  result[0].road_address.address_name +
                  "</div>"
                : "";
              detailAddr +=
                "<div>지번 주소: " + result[0].address.address_name + "</div>";

              let content =
                '<div style="padding: 5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">' +
                '<span style="display: block; font-weight: bold;">법정동 주소정보</span>' +
                detailAddr +
                "</div>";

              // 🚀 Dynamic present marker in the map
              presentMarker(
                mouseEvent.latLng.getLat(),
                mouseEvent.latLng.getLng()
              );

              // 💫 Save latitude and longitude in the state
              setLatitude(mouseEvent.latLng.getLat());
              setLongitude(mouseEvent.latLng.getLng());

              // 💫 Present address info
              infowindow.setContent(content);
              infowindow.open(map, marker); // 수정 필요[presentMarker()]
            }
          });
        });

        // 💫 Present address info when changed cetnter position & zoom size
        window.kakao.maps.event.addListener(map, "idle", () => {
          searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        });

        // 🎇 Present marker function in the map
        const presentMarker = (latitude, longitude) => {
          // 1. set marker position
          let position = new window.kakao.maps.LatLng(latitude, longitude);
          // 2. create a marker
          //   let marker = new window.kakao.maps.Marker({
          //     position: position,
          //   });
          // 2. set position of marker
          marker.setPosition(position);

          // 3. create a maker in the map
          marker.setMap(map);
        };

        // 🎇 행정동 주소 요청 함수
        const searchAddrFromCoords = (coords, callback) => {
          geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
        };

        // 🎇 법정동 주소 요청 함수
        const searchDetailAddrFromCoords = (coords, callback) => {
          geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        };

        // 🎇 지도 좌측 상단에 지도 중심 좌표에 대한 주소 정보 출력 함수
        const displayCenterInfo = (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            let infoDiv = document.getElementById("centerAddr");

            for (let i = 0; i < result.length; i++) {
              // 행정동의 region_type = 'H'
              if (result[i].region_type === "H") {
                infoDiv.innerHTML = result[i].address_name;
                break;
              }
            }
          }
        };

        // 🚀 Static present marker in the map
        presentMarker(37.5665, 126.978);

        // 💫 Get map coordinate info
        // [1] center_changed: 중심 좌표가 변경된 경우
        // [2] dragend: 드래그가 끝난 경우
        // window.kakao.maps.event.addListener(map, "dragend", () => {
        //   let center = map.getCenter();
        //   setLatitude(center.getLat());
        //   setLongitude(center.getLng());

        //   // 🚀 Dynamic present marker in the map
        //   presentMarker(center.getLat(), center.getLng());
        // });

        // [3] click: 마우스를 클릭한 경우
        // window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        //   // Get & save Clicked latitude and longitude
        //   let latlng = mouseEvent.latLng;
        //   setLatitude(latlng.getLat());
        //   setLongitude(latlng.getLng());

        //   // 🚀 Dynamic present marker in the map
        //   presentMarker(latlng.getLat(), latlng.getLng());
        // });
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
        url={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`}
        onLoad={getKakaoMapData}
      />
      <div className="flex flex-col absolute w-full h-full">
        <div className="flex flex-col w-[500px] h-[500px] m-auto relative">
          <span className="absolute left-2 z-[3] font-bold text-center">
            위도: {latitude}, 경도: {longitude}
          </span>
          <div id="kakao-map" className="w-full h-full z-[1]"></div>
          <div className="absolute left-5 top-5 border rounded-[2px] bg-white bg-opacity-80 z-[2] p-5">
            <span className="block font-bold">
              지도중심기준 행정동 주소정보
            </span>
            <span id="centerAddr"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KakaoMapPage;
