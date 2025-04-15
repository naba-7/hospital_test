import style from '@/styles/Home.module.css'
import '@/styles/globals.css'
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div className={style.container}>

      <header>🏥Healthy-O 헬시오 프로젝트</header>
      <div className={style.divider}></div>
      <main className={style.main}>
        <Component {...pageProps} />
      </main>
      <footer>
        본 서비스는 사용자의 입력 데이터를 기반으로 사용자의 건강 상태를 확인하는 참고용 도구이며, 실제 의료 서비스나 전문가의 진단을 대체할 수 없습니다. 
        <br></br>
        본 서비스에서 제공된 정보에 의하여 사용자가 내린 건강 관련 결정으로 인한 어떠한 손해나 피해에 대해서 본 서비스는 일절 책임을 지지 않습니다.
        <br></br>
        정확한 진단과 치료를 위해 반드시 의사 또는 전문 의료 기관을 방문하시기 바랍니다.
      </footer>
    </div>
  ) 
}
