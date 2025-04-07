import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div>

      <header>Healthy-O 헬시오 프로젝트</header>
      <Component {...pageProps} />
      <footer>
        footer, 전페이지 렌더링 경고문구 :: 본 서비스는 사용자의 입력 데이터를 기반으로 질병을 예측하는 참고용 도구이며, 실제 의료 서비스나 전문가의 진단을 대체할 수 없습니다. 
본 서비스에서 제공된 정보에 의하여 내린 건강 관련 결정으로 인한 어떠한 손해나 피해에 대해서 본 서비스는 책임을 지지 않습니다.
정확한 진단과 치료를 위해 반드시 의사 또는 전문 의료 기관을 방문하시기 바랍니다.
      </footer>
    </div>
  ) 
}
