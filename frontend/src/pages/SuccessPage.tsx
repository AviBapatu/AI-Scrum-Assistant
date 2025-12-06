import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("JWT saved:", token);

      // optional redirect
      navigate("/");
    }
  }, [token, navigate]);

  return <div>Authenticating…</div>;
};

export default SuccessPage;
