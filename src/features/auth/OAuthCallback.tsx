import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { store } from "@/app/store";
import { setToken, setUserId } from "@/app/store/authSlice";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // const id = searchParams.get("id");
  // const token = searchParams.get("token");

  useEffect(() => {
    // const id = searchParams.get("id");
    const token = searchParams.get("token");
    const userId = searchParams.get("id");

    // if (!token) {
    //     navigate("/login");
    //     return;
    // }
    if (token) {
      store.dispatch(setToken(token));
    }
    if (userId) {
      store.dispatch(setUserId(userId));
    }

    // if (token != null) {
    //     localStorage.setItem("access_token", token);
    // }
    navigate("/");
  }, [navigate, searchParams]);

  return (
    <div>
      <p>yeaaah you are back!!!</p>
      {/*<p>id: {id}</p>*/}
      {/*<p>token: {token}</p>*/}
    </div>
  );
}
