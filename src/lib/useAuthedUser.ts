import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiRequestError, fetchMe, type UserSummary } from "./api";

export function useAuthedUser() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const cachedUser = localStorage.getItem("authUser");

  const [user, setUser] = useState<UserSummary | null>(
    cachedUser ? (JSON.parse(cachedUser) as UserSummary) : null,
  );

  useEffect(() => {
    if (!token) return;

    fetchMe(token)
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem("authUser", JSON.stringify(fresh));
      })
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/login");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { token, cachedUser, user, setUser };
}
