// 영양제 페이지
import { useRouter } from "next/router"

export default function Home(){

    const router = useRouter();

    const onClickMain = () => {
        router.push('/');
    }

    const onClickHospital = () => {
        router.push('/hospital');
    }

    return(
        <div>
            <h1>영양제 추천 페이지</h1>
            <button onClick={onClickMain}>메인 페이지로 돌아가기</button>
            <button onClick={onClickHospital}>병원 추천받기</button>
        </div>
    )
}