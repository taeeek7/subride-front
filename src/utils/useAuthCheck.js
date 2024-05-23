// useAuthCheck.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "utils/apiInstance";

const tokenRequestInterval =
  process.env.TOKEN_REQUEST_INTERVAL || 30 * 60 * 1000;
const idleTime = process.env.IDLE_TIME || 10 * 60 * 1000;

const useAuthCheck = () => {
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const navigate = useNavigate();
  const [lastActiveTime, setLastActiveTime] = useState(null);

  const fetchVerifyToken = useCallback(async () => {
    const token = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    const currentPath = window.location.pathname;

    if (currentPath === "/login" || currentPath === "/signup") {
      setIsTokenVerified(true);
      return true;
    } else if (token) {
      try {
        const { data } = await api("member").post("/auth/verify", { token });
        if (data.response === 1) {
          console.log("TOKEN is Valid !!!");
          setIsTokenVerified(true);
        } else if (data.response === 10) {
          // Token expires, refresh request
          console.log("***** TOKEN is Expired !!!!");
          const { data: result } = await api("member").post("/auth/refresh", {
            refreshToken,
          });
          if (result.code === 200) {
            sessionStorage.setItem("accessToken", result.response.accessToken);
            sessionStorage.setItem("refreshToken", result.response.refreshToken);
            console.log("***** TOKEN is Refreshed !!!!");
            setIsTokenVerified(true);
          }
        } else {
          console.log("TOKEN is Invalid !!!!");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          setIsTokenVerified(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        setIsTokenVerified(false);
        navigate("/login");
      }
    } else {
      setIsTokenVerified(true);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchVerifyToken();
  }, [fetchVerifyToken]);

  useEffect(() => {
    const handleUserActivity = () => {
      setLastActiveTime(new Date());
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      // 마지막 활동 시간 확인
      if (lastActiveTime) {
        const timeSinceLastActivity = new Date() - lastActiveTime;

        if (timeSinceLastActivity > idleTime) {
          console.log("30분 이상 비활동 상태, 로그아웃");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");
          setIsTokenVerified(false);
          navigate("/login");
          return;
        }
      }

      // 토큰 갱신 요청
      await fetchVerifyToken();
    }, tokenRequestInterval); // 10분마다 토큰 유효성 검사

    return () => clearInterval(interval);
  }, [fetchVerifyToken, lastActiveTime, navigate]);

  return isTokenVerified;
};

export default useAuthCheck;
