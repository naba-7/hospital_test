// 문진표 페이지
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home(){

    useEffect(()=>{
        window.alert('사용자가 입력한 개인 건강 정보는 본 서비스 이용에만 사용됩니다.')
    })

    const router = useRouter();

    const onSubmit = () => {
        router.push('/result');
    }

    return(
        <div>
            <h1>문진표 작성 페이지</h1>
            <div>질문 리스트</div>
            <button onClick={onSubmit}>결과 확인하기</button>
        </div>
    )

}