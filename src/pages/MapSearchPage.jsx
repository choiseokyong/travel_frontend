import React, { useEffect, useState } from "react";

const MapSearchPage = ({ onSelectPlace,idx  }) => {
  const [keyword, setKeyword] = useState("카페");
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [marker, setMarker] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // 선택한 리스트 인덱스

  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!kakaoKey) return;

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleSearch = () => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setSelectedIndex(null);
        if (marker) marker.setMap(null);
        const bounds = new window.kakao.maps.LatLngBounds();
        data.forEach((place) => {
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      }
    });
  };

  const handleListClick = (place, index) => {
    if (!map) return;

    // 기존 마커 제거
    if (marker) marker.setMap(null);

    // 새로운 마커 표시
    const newMarker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });
    setMarker(newMarker);
    setSelectedIndex(index);

    // 지도 중심 이동
    map.panTo(new window.kakao.maps.LatLng(place.y, place.x));
  };

  const handleSelectClick = (place) => {
    
    onSelectPlace(place);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* 리스트 */}
      <div
        style={{
          width: "250px",
          maxHeight: "100%",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* 검색창 */}
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력..."
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            style={{
              width: "100%",
              padding: "6px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "white",
              cursor: "pointer",
            }}
          >
            검색
          </button>
        </div>

        {places.map((place, index) => (
            <div
                key={place.id || index}
                onClick={() => handleListClick(place, index)} // 리스트 클릭
                style={{
                padding: "8px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor: selectedIndex === index ? "#e8f5e9" : "transparent",
                position: "relative",
                }}
            >
                <strong>{place.place_name}</strong>
                <div style={{ fontSize: "12px", color: "#555" }}>
                {place.road_address_name || place.address_name}
                </div>
                <button
                style={{
                    marginTop: "4px",
                    padding: "4px 8px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#1976d2",
                    color: "white",
                    cursor: "pointer",
                }}
                onClick={(e) => {
                    e.stopPropagation(); // 여기서 클릭 이벤트 버블링 차단
                    handleSelectClick(place);
                }}
                >
                선택
                </button>
            </div>
            ))}


        {places.length === 0 && <p style={{ color: "#999" }}>검색 결과가 없습니다.</p>}
      </div>

      {/* 지도 */}
      <div
        id="map"
        style={{
          flex: 1,
          height: "100%",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          marginLeft: "10px",
        }}
      ></div>
    </div>
  );
};

export default MapSearchPage;
