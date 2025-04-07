// 결과 페이지
import { useRouter } from "next/router"

export default function Home(){

    const router = useRouter();

    const onClickHospital = () => {
        router.push('/hospital');
    }

    const onClickSupplement = () => {
        router.push('/supplement');
    }

    return(
        <div>
            <h1>질병 예측 결과 페이지</h1>
            <div>ㅇㅇㅇ님의 예측 질병은: </div>
            <button onClick={onClickHospital}>병원 찾기</button>
            <button onClick={onClickSupplement}>영양제 찾기</button>
        </div>
    )
}