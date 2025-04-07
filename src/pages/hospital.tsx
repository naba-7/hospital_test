// 병원 페이지
import { useRouter } from "next/router"

export default function Home(){
    const router = useRouter();

    const onClickMain = () => {
        router.push('/');
    }

    const onClickSupplement = () => {
        router.push('/supplement');
    }
    
    return(
        <div>
            <h1>병원 추천 페이지</h1>
            <button onClick={onClickMain}>메인 페이지로 돌아가기</button>
            <button onClick={onClickSupplement}>영양제 추천받기</button>
        </div>
    )
}