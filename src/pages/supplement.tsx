// 영양제 페이지
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import style from '@/styles/supplement.module.css'

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

    const onClickHospital = () => {
        router.push('/hospital');
    }

    return(
        <div>
            <h1 className={style.title}>💊 영양제 추천 받기 💊</h1>

            <div className={style.divider}></div>

            <div className={style.state}>ㅇㅇㅇ님의 건강 상태를 기반으로 영양제를 추천합니다.</div>

            <div className={style.divider}></div>

            <div className={style.resultDescription}>
                <div>*영양제*를 추천합니다!</div>
                <div>*영양제 이름*</div>
                <div>*영양제 설명*</div>
                <div className={style.subDescription}>
                    👇🏻 아래에서 병원 추천도 받아보세요! 👇🏻
                </div>
            </div>

            <div className={style.divider}></div>

            <button className={style.hospitalbtn} onClick={onClickHospital}>병원 추천받기</button>
            <button className={style.mainbtn} onClick={onClickMain}>메인 페이지로 돌아가기</button>
        </div>
    )
}