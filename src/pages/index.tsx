import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const onSubmit = () => {
    router.push('/question');
  }

  return (
    <>
      <div>
        <h1>Healthy-O</h1>
        <div>서비스 설명</div>
        <button onClick={onSubmit}>시작하기</button>
      </div>
    </>
  );
}
