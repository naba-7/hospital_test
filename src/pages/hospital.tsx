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
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [directionsLine, setDirectionsLine] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      alert('로그인 시 이용 가능한 기능입니다.');
      router.push('/login');
    }
  }, []);

  // 추천진료과 받아오기
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/mock_recommendation.json')
      .then(res => res.json())
      .then(data => setRecommendedDepartment(data.recommended_department))
      .catch(err => console.error('추천진료과 fetch 실패:', err));
  }, [isAuthenticated]);

  // 병원 데이터 받아오기
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/mock_hospitals.json')
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(err => console.error('병원 데이터 fetch 실패:', err));
  }, [isAuthenticated]);

  // 지도 로딩
  useEffect(() => {
    if (!recommendedDepartment || mapLoaded || hospitals.length === 0 || !isAuthenticated) return;

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

          const nearby = hospitals.filter(h =>
            h.department === recommendedDepartment &&
            getDistance(lat, lng, h.lat, h.lng) <= 3    // 사용자와 병원 거리 제한 3km
          );

          setFilteredHospitals(nearby);
          setMapLoaded(true);
        });
      });
    };
    document.head.appendChild(script);
  }, [recommendedDepartment, hospitals, mapLoaded, isAuthenticated]);

  // 임시작성 (사용자와 병원 간 거리측정)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const drawRoute = (lat, lng, name) => {
    if (!map || !userLocation) return;
    if (directionsLine) directionsLine.setMap(null);
    if (selectedMarker) selectedMarker.setMap(null);
    if (activeInfoWindow) activeInfoWindow.close();

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
    setActiveInfoWindow(info);

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
    bounds.extend(new window.kakao.maps.LatLng(hospitalLatLng.getLat() + 0.002, hospitalLatLng.getLng()));
    map.setBounds(bounds);
  };

  if (!isAuthenticated) return null;

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
