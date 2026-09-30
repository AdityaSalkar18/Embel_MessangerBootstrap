import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageCircle,
} from "lucide-react";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:8081/api/auth/login";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier.trim()) {
      setError("Email or phone is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      const responseText = await response.text();

      let responseData = {};

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        responseData = {};
      }

      if (!response.ok) {
        let errorMessage = "Login failed.";

        if (responseData?.errors?.identifier) {
          errorMessage = responseData.errors.identifier;
        } else if (responseData?.errors?.password) {
          errorMessage = responseData.errors.password;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseText) {
          errorMessage = responseText;
        }

        throw new Error(errorMessage);
      }

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   data: {
       *     token: "...",
       *     userId: 1,
       *     name: "Aditya",
       *     role: "SUPER_ADMIN"
       *   },
       *   message: null
       * }
       */

      const loginData = responseData.data;

      if (!loginData) {
        throw new Error("Login response data was not received.");
      }

      // JWT token is inside responseData.data.token
      const token = loginData.token;

      if (!token) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      // User information
      const user = {
        id: loginData.userId,
        userId: loginData.userId,
        name: loginData.name,
        role: loginData.role,
        identifier: formData.identifier.trim(),
      };

      // Save JWT token
      localStorage.setItem("token", token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(user));

      // Send login information to parent if required
      if (onLogin) {
        onLogin({
          success: true,
          token: token,
          user: user,
          data: loginData,
        });
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Login error handling
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#FFFCF9",
        padding: "20px",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "430px",
          border: "1px solid #F1E7DC",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "58px",
              height: "58px",
              background: "#F4712B",
              color: "#fff",
            }}
          >
            <MessageCircle size={28} />
          </div>

          <h3
            className="mt-3 mb-1 fw-bold"
            style={{ color: "#1E2328" }}
          >
            Welcome Back
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#8A7C6F",
              fontSize: "14px",
            }}
          >
            Login to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-3 rounded-3 px-3 py-2"
            style={{
              background: "#FFF1EE",
              border: "1px solid #FFD5CA",
              color: "#D94A2B",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Identifier */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{
                color: "#1E2328",
                fontSize: "14px",
              }}
            >
              Email or Phone
            </label>

            <div className="position-relative">
              <Mail
                size={18}
                className="position-absolute"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#B9AFA5",
                }}
              />

              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or phone"
                className="form-control"
                autoComplete="username"
                style={{
                  height: "46px",
                  paddingLeft: "42px",
                  border: "1px solid #F1E7DC",
                  borderRadius: "10px",
                  color: "#1E2328",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{
                color: "#1E2328",
                fontSize: "14px",
              }}
            >
              Password
            </label>

            <div className="position-relative">
              <LockKeyhole
                size={18}
                className="position-absolute"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#B9AFA5",
                }}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="form-control"
                autoComplete="current-password"
                style={{
                  height: "46px",
                  paddingLeft: "42px",
                  paddingRight: "45px",
                  border: "1px solid #F1E7DC",
                  borderRadius: "10px",
                  color: "#1E2328",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="btn position-absolute p-0 border-0"
                style={{
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8A7C6F",
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn w-100 fw-semibold"
            style={{
              height: "46px",
              background: "#F4712B",
              color: "#fff",
              borderRadius: "10px",
              border: "none",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          className="text-center mt-4"
          style={{
            fontSize: "13px",
            color: "#B9AFA5",
          }}
        >
          Secure login with JWT authentication
        </div>
      </div>
    </div>
  );
}

export default Login;