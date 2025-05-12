import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import style from '@/styles/hospital.module.css'

export default function HospitalPage() {
  const router = useRouter()

  const onClickMain = () => {
    router.push('/')
  }

  const onClickSupplement = () => {
    router.push('/supplement')
  }

  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (mapLoaded) return // 중복 로딩 방지

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        // 1. 사용자 위치 요청
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            const userLocation = new window.kakao.maps.LatLng(lat, lng)

            const mapOption = {
              center: userLocation,
              level: 3,
            }

            const map = new window.kakao.maps.Map(document.getElementById('map'), mapOption)

            // 사용자 위치 마커
            const marker = new window.kakao.maps.Marker({
              position: userLocation,
              map: map,
            })

            setMapLoaded(true)
          }, () => {
            alert('위치 정보를 불러오지 못했습니다.')
          })
        } else {
          alert('브라우저가 위치 정보를 지원하지 않습니다.')
        }
      })
    }

    document.head.appendChild(script)
  }, [mapLoaded])

  return (
    <div>
      <h1 className={style.title}>💉 주변 병원 찾기 🏥</h1>

      <div className={style.divider}></div>

      <div className={style.state}>ㅇㅇㅇ님의 건강 상태를 기반으로 주변 병원을 찾습니다.</div>

      <div className={style.divider}></div>

      <div className={style.result}>병원 결과</div>

      <div className={style.resultDescription}>
        <div>*병원이름*을 추천합니다!</div>
        <div id="map" className={style.map}></div>
        <div>*병원주소*</div>
        <div className={style.subDescription}>
          👇🏻 아래에서 영양제 추천도 받아보세요! 👇🏻
        </div>
      </div>

      <div className={style.divider}></div>

      <button className={style.supplementbtn} onClick={onClickSupplement}>영양제 추천받기</button>
      <button className={style.mainbtn} onClick={onClickMain}>메인 페이지로 돌아가기</button>
    </div>
  )
}
