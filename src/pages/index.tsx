import { useRouter } from "next/router";
import styles from '@/styles/index.module.css'

export default function Home() {
  const router = useRouter();

  const onSubmit = () => {
    router.push('/disclaimer');
  }

  return (
    <>
      <div>
        <h1 className={styles.title}>Healthy-O</h1>
        <div className={styles.description}>
          <div className={styles.subDescription}>
            💪🏻TAKE CARE with Healthy - O
            <br></br>
          </div>
          <br></br>
          본 서비스는 생성형 AI와 함께하는 건강 정보 통합 검색 서비스입니다.
          <br></br>
          검색 결과를 통해 여러 건강 지식을 쌓아보세요!
          <br></br>
          <br></br>
          건강을 위한 첫 걸음!
          <br></br>
          헬시오와 함께하세요!
        </div>
        <div className={styles.divider}></div>
        <button className={styles.startbtn} onClick={onSubmit}>지금 시작하기</button>
        <div className={styles.divider}></div>
      </div>
    </>
  );
}
