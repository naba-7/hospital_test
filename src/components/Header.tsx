// components/Header.tsx
import { useRouter } from "next/router";
import style from "@/styles/Home.module.css";

export default function Header() {
  const router = useRouter();

  const handleMainClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  return (
    <div className={style.headerWrapper}>
      <header className={style.logo} onClick={handleMainClick}>
        🏥Healthy-O 헬시오 프로젝트
      </header>

      <div className={style.authButtons}>
        <div className={style.login} onClick={handleLoginClick}>
          로그인
        </div>
        <div className={style.signup} onClick={handleSignUpClick}>
          회원가입
        </div>
      </div>
    </div>
  );
}