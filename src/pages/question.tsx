// 문진표 페이지
import { useEffect } from "react"
import { useRouter } from "next/router"
import style from '@/styles/question.module.css'

export default function Home(){

    useEffect(()=>{
        window.alert('안내: 사용자가 입력한 개인 건강 정보는 본 서비스 이용에만 사용됩니다.')
    })

    const router = useRouter();

    const onSubmit = () => {
        router.push('/result');
    }

  // 🧠 입력값 저장
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({
        name,
        age,
        gender,
        status
      })
    });
  
    const data = await response.json();
    
    router.push('/result');
  };

    return(
        <div>
            <h1 className={style.title}>
                🩺 문진표 작성 🔍
            </h1>

            <div className={style.divider}></div>

            <div className={style.mainQuestion}>

            <div>
                <label>✍🏻이름을 입력하세요: </label>
                <input/>
            </div>

            <div>
                <label>✍🏻나이를 입력하세요: </label>
                <input />
            </div>

            <div>
                <label>✍🏻성별을 입력하세요: </label>
                <select>
                    <option value="">성별을 선택하세요</option>
                    <option value="여성">여성</option>
                    <option value="남성">남성</option>
                </select>
            </div>

            <div>
                <label>✍🏻현재 상태를 입력하세요</label>
                <div className={style.example}>
                    현재 건강 상태 및 주요 증상을 입력해주세요!
                    <br></br>
                    (예: 주요 증상, 증상 발생 시기, 만성 질환 유무, 복용중 약물, 흡연 여부, 음주 여부 등 자세히 적어주시면 더 좋아요!)
                </div>
                <br></br>
                <textarea placeholder="위 예시를 보고 현재 상태를 입력하세요"></textarea>
            </div>

        </div>
            <div className={style.divider}></div>
            <button className={style.questbtn} onClick={onSubmit}>결과 확인하기</button>
        </div>
    )

}