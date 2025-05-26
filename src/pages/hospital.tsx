import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import style from '@/styles/hospital.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Hospital {
  name: string;
  address: string;
  department: string;
  lat: number;
  lng: number;
}

export default function HospitalPage() {
  const router = useRouter();

  const onClickMain = () => router.push('/');
  const onClickSupplement = () => router.push('/supplement');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedDepartment, setRecommendedDepartment] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [sdkLoaded, setSdkLoaded] = useState<boolean>(false);
  const [directionsLine, setDirectionsLine] = useState<any | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState<any | null>(null);

  // ✅ 카카오 지도 SDK 로드
  useEffect(() => {
    if (document.getElementById('kakao-map-script')) {
      setSdkLoaded(true); // 이미 존재하면 바로 true
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        console.log('✅ Kakao SDK 로드 완료');
        setSdkLoaded(true);
      } else {
        console.error('❌ Kakao 객체 없음');
      }
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const consent = localStorage.getItem('consent');

    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    if (consent !== 'true') {
      alert('서비스 이용을 위해 동의가 필요합니다.');
      router.push('/disclaimer');
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/mock_recommendation.json')
      .then(res => res.json())
      .then((data: { recommended_department: string }) =>
        setRecommendedDepartment(data.recommended_department)
      )
      .catch(err => console.error('추천진료과 fetch 실패:', err));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/mock_hospitals.json')
      .then(res => res.json() as Promise<Hospital[]>)
      .then(data => setHospitals(data))
      .catch(err => console.error('병원 데이터 fetch 실패:', err));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !recommendedDepartment || mapLoaded || hospitals.length === 0 || !sdkLoaded) return;

    window.kakao.maps.load(() => {
      console.log("✅ Kakao Maps 로딩 성공");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          console.log("📌 위치 획득 성공:", lat, lng);
          renderMap(lat, lng);
        },
        (err) => {
          console.error("❌ 위치 정보 실패:", err);
          alert("위치 정보를 가져올 수 없어 지도를 표시할 수 없습니다.");
        },
        {
          timeout: 5000
        }
      );
    });
  }, [isAuthenticated, recommendedDepartment, hospitals, mapLoaded, sdkLoaded]);

  const renderMap = (lat: number, lng: number) => {
    const userPos = new window.kakao.maps.LatLng(lat, lng);
    setUserLocation({ lat, lng });

    const mapObj = new window.kakao.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: userPos,
        level: 3,
        draggable: false,
        zoomable: false,
      }
    );
    setMap(mapObj);

    new window.kakao.maps.Marker({
      position: userPos,
      map: mapObj,
      title: '현재 위치',
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new window.kakao.maps.Size(24, 35)
      ),
    });

    const nearby = hospitals.filter(h =>
      h.department === recommendedDepartment &&
      getDistance(lat, lng, h.lat, h.lng) <= 3
    );

    setFilteredHospitals(nearby);
    setMapLoaded(true);
  };

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const drawRoute = (lat: number, lng: number, name: string) => {
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
      content: `<div style="padding:5px;font-size:14px;">${name}</div>`,
    });
    info.open(map, marker);
    setActiveInfoWindow(info);

    const path = [userLatLng, hospitalLatLng];
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });
    polyline.setMap(map);
    setDirectionsLine(polyline);

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(userLatLng);
    bounds.extend(hospitalLatLng);
    map.setBounds(bounds);
  };

  if (loading) return null;

  return (
    <div>
      <h1 className={style.title}>💉 주변 병원 찾기 🏥</h1>
      <div className={style.divider} />

      {recommendedDepartment ? (
        <div className={style.state}>
          {`사용자의 건강 상태에 따라 '${recommendedDepartment}' 진료과를 추천합니다.`}
        </div>
      ) : (
        <div className={style.state}>건강 상태 분석 중입니다...</div>
      )}

      <div className={style.divider} />

      <div className={style.resultDescription}>
        <div>다음과 같은 병원들을 추천합니다! (3km 이내)</div>

        <ul className={style.hospitalList}>
          {filteredHospitals.map((h, i) => (
            <li key={i} className={style.hospitalItem}>
              <strong>✔ {h.name}</strong> – {h.address}
              <button
                onClick={() => drawRoute(h.lat, h.lng, h.name)}
                className={style.routeButton}
              >
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

      <div className={style.divider} />

      <button className={style.supplementbtn} onClick={onClickSupplement}>
        영양제 추천받기
      </button>
      <button className={style.mainbtn} onClick={onClickMain}>
        메인 페이지로 돌아가기
      </button>
    </div>
  );
}
