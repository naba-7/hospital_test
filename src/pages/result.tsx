// 결과 페이지
import { useRouter } from "next/router";
import style from '@/styles/result.module.css';

export default function Home() {
  const router = useRouter();

  const onClickHospital = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 시 이용 가능한 기능입니다.");
      router.push("/login");
    } else {
      router.push("/hospital");
    }
  };

  const onClickSupplement = () => {
    router.push("/supplement");
  };

  return (
    <div>
      <h1 className={style.title}>✅ 건강 상태 check! ✅</h1>

      <div className={style.divider}></div>

      <div className={style.state}>ㅇㅇㅇ님의 건강 상태를 체크합니다.</div>

      <div className={style.divider}></div>

      <h3 className={style.result}>체크 결과</h3>

      <div className={style.resultDescription}>
        ㅇㅇㅇ님에겐 혈압 관리가 필요해보여요.
        <br />
        👇🏻 아래에서 주변 병원과 영양제 추천을 받아보세요! 👇🏻
      </div>

      <div className={style.divider}></div>

      <button className={style.hospitalbtn} onClick={onClickHospital}>병원 찾기</button>
      <button className={style.supplementbtn} onClick={onClickSupplement}>영양제 찾기</button>
    </div>
  );
}
