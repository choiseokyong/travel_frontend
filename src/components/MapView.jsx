import React, { useEffect, useRef } from "react";

const MapView = ({ markers = [], center }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!kakaoKey) return;

    const initMap = () => {
      const container = mapRef.current;
      const options = {
        center: center
          ? new window.kakao.maps.LatLng(center.lat, center.lng)
          : markers.length > 0
          ? new window.kakao.maps.LatLng(markers[0].lat, markers[0].lng)
          : new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      };

      mapInstance.current = new window.kakao.maps.Map(container, options);

      // 초기 마커 표시
      updateMarkers();
    };

    const updateMarkers = () => {
      // 기존 마커 제거
      markerRefs.current.forEach((m) => m.setMap(null));
      markerRefs.current = [];

      // 새 마커 생성
      markers.forEach((m) => {
        const marker = new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: new window.kakao.maps.LatLng(m.lat, m.lng),
        });
        markerRefs.current.push(marker);
      });

      // bounds 조정
      if (markers.length > 1) {
        const bounds = new window.kakao.maps.LatLngBounds();
        markers.forEach((m) =>
          bounds.extend(new window.kakao.maps.LatLng(m.lat, m.lng))
        );
        mapInstance.current.setBounds(bounds);
      } else if (markers.length === 1) {
        mapInstance.current.setCenter(new window.kakao.maps.LatLng(markers[0].lat, markers[0].lng));
      }
    };

    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(initMap);
    }

    return () => {
      // 언마운트 시 마커 제거
      markerRefs.current.forEach((m) => m.setMap(null));
      markerRefs.current = [];
    };
  }, [markers, center]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapView;
