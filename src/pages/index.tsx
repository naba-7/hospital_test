import { useRouter } from "next/router";
import styles from '@/styles/index.module.css'

export default function Home() {
  const router = useRouter();

  const onSubmit = () => {
    router.push('/question');
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
          본 서비스는 생성형 AI와 함께하는 건강 상태 체크 서비스입니다.
          <br></br>
          건강 상태를 체크하고, 병원과 영양제 추천까지 한번에 받아보세요!
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
