// 병원 페이지
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import style from '@/styles/hospital.module.css'

export default function Home(){
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요한 서비스입니다.");
          router.push("/login");
        } 
        else{
            setIsAuth(true);
        }
        setLoading(false);
      }, []);

      if(loading) return null;

      if(!isAuth) return null;

    const onClickMain = () => {
        router.push('/');
    }

    const onClickSupplement = () => {
        router.push('/supplement');
    }
    
    return(
        <div>
            <h1 className={style.title}>💉 주변 병원 찾기 🏥</h1>

            <div className={style.divider}></div>

            <div className={style.state}>ㅇㅇㅇ님의 건강 상태를 기반으로 주변 병원을 찾습니다.</div>

            <div className={style.divider}></div>

            <div className={style.result}>병원 결과</div>

            <div className={style.resultDescription}>
                <div>*병원이름*을 추천합니다!</div>
                <div>*지도*</div>
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