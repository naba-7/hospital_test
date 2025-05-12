import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import style from '@/styles/hospital.module.css';

export default function HospitalPage() {
  const router = useRouter();

  const onClickMain = () => router.push('/');
  const onClickSupplement = () => router.push('/supplement');

  const [mapLoaded, setMapLoaded] = useState(false);
  const [recommendedDepartment, setRecommendedDepartment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [directionsLine, setDirectionsLine] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null); // ✅ 추가

  const mockHospitals = [
    { name: '광주내과의원', lat: 35.1595454, lng: 126.8526012, address: '광주 서구 상무대로 983', department: '내과' },
    { name: '빛고을정형외과', lat: 35.154768, lng: 126.846918, address: '광주 서구 운천로 123', department: '정형외과' },
    { name: '웃는치과', lat: 35.157519, lng: 126.853203, address: '광주 서구 시청로 12', department: '치과' },
    { name: '하나내과의원', lat: 35.160109, lng: 126.849504, address: '광주 서구 상무중앙로 75', department: '내과' },
  ];

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    fetch('/api/recommendation')
      .then(res => res.json())
      .then(data => setRecommendedDepartment(data.recommended_department))
      .catch(err => console.error('추천진료과 fetch 실패:', err));
  }, []);

  useEffect(() => {
    if (!recommendedDepartment || mapLoaded) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const userPos = new window.kakao.maps.LatLng(lat, lng);
          setUserLocation({ lat, lng });

          const mapObj = new window.kakao.maps.Map(document.getElementById('map'), {
            center: userPos,
            level: 3,
            draggable: false,
            zoomable: false,
          });
          setMap(mapObj);

          const userMarker = new window.kakao.maps.Marker({
            position: userPos,
            map: mapObj,
            title: '현재 위치',
            image: new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              new window.kakao.maps.Size(24, 35)
            )
          });

          const userInfo = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">현재 위치</div>`
          });
          userInfo.open(mapObj, userMarker);

          const filtered = mockHospitals.filter(h =>
            h.department === recommendedDepartment && getDistance(lat, lng, h.lat, h.lng) <= 3
          );

          setFilteredHospitals(filtered);
          setMapLoaded(true);
        });
      });
    };
    document.head.appendChild(script);
  }, [recommendedDepartment, mapLoaded]);

  const drawRoute = (lat, lng, name) => {
    if (!map || !userLocation) return;

    if (directionsLine) directionsLine.setMap(null);
    if (selectedMarker) selectedMarker.setMap(null);
    if (activeInfoWindow) activeInfoWindow.close(); // ✅ 이전 InfoWindow 닫기

    const userLatLng = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
    const hospitalLatLng = new window.kakao.maps.LatLng(lat, lng);

    const marker = new window.kakao.maps.Marker({
      position: hospitalLatLng,
      map,
    });
    setSelectedMarker(marker);

    const info = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:14px;">${name}</div>`
    });
    info.open(map, marker);
    setActiveInfoWindow(info); // ✅ 현재 InfoWindow 저장

    const path = [userLatLng, hospitalLatLng];

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);
    setDirectionsLine(polyline);

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(userLatLng);
    bounds.extend(hospitalLatLng);
    const paddedHospitalLat = hospitalLatLng.getLat() + 0.002;
    bounds.extend(new window.kakao.maps.LatLng(paddedHospitalLat, hospitalLatLng.getLng()));
    map.setBounds(bounds);
  };

  return (
    <div>
      <h1 className={style.title}>💉 주변 병원 찾기 🏥</h1>
      <div className={style.divider}></div>

      {recommendedDepartment ? (
        <div className={style.state}>
          {`사용자의 건강 상태에 따라 '${recommendedDepartment}' 진료과를 추천합니다.`}
        </div>
      ) : (
        <div className={style.state}>건강 상태 분석 중입니다...</div>
      )}

      <div className={style.divider}></div>

      <div className={style.resultDescription}>
        <div>다음과 같은 병원들을 추천합니다! (3km 이내)</div>

        <ul className={style.hospitalList}>
          {filteredHospitals.map((h, i) => (
            <li key={i} className={style.hospitalItem}>
              <strong>✔ {h.name}</strong> - {h.address}
              <button onClick={() => drawRoute(h.lat, h.lng, h.name)} className={style.routeButton}>
                경로 보기
              </button>
            </li>
          ))}
        </ul>

        <div id="map" className={style.map}></div>

        <div className={style.subDescription}>
          👇🏻 아래에서 영양제 추천도 받아보세요! 👇🏻
        </div>
      </div>

      <div className={style.divider}></div>

      <button className={style.supplementbtn} onClick={onClickSupplement}>영양제 추천받기</button>
      <button className={style.mainbtn} onClick={onClickMain}>메인 페이지로 돌아가기</button>
    </div>
  );
}
