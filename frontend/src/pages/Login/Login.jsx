import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const token = Cookies.get("jwt_token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/signin", {
        email,
        password,
      });

      const jwtToken = response.data.data.token;

      Cookies.set("jwt_token", jwtToken);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div>
      <h1>Go Business</h1>

      <p>
        Sign in to open your referral dashboard.
      </p>

      <form onSubmit={handleSubmit}>

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="text"
          placeholder="you@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Sign in
        </button>

      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;