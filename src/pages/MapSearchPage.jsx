import React, { useState } from "react";
import MapView from "../components/MapView";

const MapSearchPage = ({ onSelectPlace }) => {
  const [keyword, setKeyword] = useState("카페");
  const [places, setPlaces] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleSearch = () => {
    if (!window.kakao) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setSelectedIdx(null);
      } else {
        setPlaces([]);
      }
    });
  };

  const handleListClick = (idx) => {
    setSelectedIdx(idx);
  };

  const handleSelectClick = (place) => {
    if (onSelectPlace) onSelectPlace(place);
  };

  const markers = selectedIdx !== null ? [{ lat: places[selectedIdx].y, lng: places[selectedIdx].x }] : [];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* 검색 + 리스트 */}
      <div style={{ width: 250, maxHeight: "100%", overflowY: "auto", border: "1px solid #ccc", borderRadius: 5, padding: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ width: "100%", padding: 6, borderRadius: 5, border: "1px solid #ccc", marginBottom: 5, outline: "none" }}
        />
        <button
          onClick={handleSearch}
          style={{ width: "100%", padding: 6, marginBottom: 10, borderRadius: 5, border: "none", backgroundColor: "#4caf50", color: "white", cursor: "pointer" }}
        >
          검색
        </button>

        {places.map((place, idx) => (
          <div
            key={place.id || idx}
            onClick={() => handleListClick(idx)}
            style={{
              padding: 8,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              backgroundColor: selectedIdx === idx ? "#e8f5e9" : "transparent",
              display: "flex",
              flexDirection: "column",
              marginBottom: 4,
            }}
          >
            <strong>{place.place_name}</strong>
            <span style={{ fontSize: 12, color: "#555" }}>{place.road_address_name || place.address_name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectClick(place);
              }}
              style={{ marginTop: 4, padding: "4px 8px", borderRadius: 5, border: "none", backgroundColor: "#1976d2", color: "white", cursor: "pointer", alignSelf: "flex-start" }}
            >
              선택
            </button>
          </div>
        ))}

        {places.length === 0 && <p style={{ color: "#999" }}>검색 결과가 없습니다.</p>}
      </div>

      {/* 지도 */}
      <div style={{ flex: 1, height: "100%" }}>
        <MapView markers={markers} center={markers[0]} drawPolyline={false} />
      </div>
    </div>
  );
};

export default MapSearchPage;
