// components/Header.tsx
import { useRouter } from "next/router";
import style from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleMainClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);  // 로그아웃 상태 갱신신
    alert('로그아웃 되었습니다.');
    router.push('/');
  }

  return (
    <div className={style.headerWrapper}>
      <header className={style.logo} onClick={handleMainClick}>
        🏥Healthy-O 헬시오 프로젝트
      </header>
  
      <div className={style.authButtons}>
        {isLoggedIn ? (
          <div className={style.logout} onClick={handleLogout}>
            로그아웃
          </div>
        ) : (
          <>
            <div className={style.login} onClick={handleLoginClick}>
              로그인
            </div>
            <div className={style.signup} onClick={handleSignUpClick}>
              회원가입
            </div>
          </>
        )}
      </div>
    </div>
  );
}