import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (!window.kakao || !window.kakao.maps) {
        alert('❌ Kakao 객체 없음');
        return;
      }

      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
          level: 3,
        };
        new window.kakao.maps.Map(container, options);
        alert('✅ 지도 로딩 성공');
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>🗺 카카오 지도 테스트 페이지</h1>
      <div
        id="map"
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ccc',
          marginTop: '1rem',
        }}
      />
    </div>
  );
}
