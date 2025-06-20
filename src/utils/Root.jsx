import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
    
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/employee-dashboard", { replace: true });
      }
    } else {
  
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  
  return null;
};

export default Root;