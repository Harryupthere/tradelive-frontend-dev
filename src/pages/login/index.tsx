import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import "./login.scss";
import { useAuth } from "../../context/authContext";
import { errorMsg, successMsg } from "../../utils/customFn";
import { LoginPayload, loginService } from "../../api/authServices";
import { EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    defaultValues: { email: "", password: "" },
  });


  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    try {
      const res = await loginService(data);
      if (res?.success) {
        login(res?.data?.accessToken);
        successMsg(res.message);
        navigate("/");
      }
    } catch (err: any) {
      errorMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box className="login-container">
      <Paper elevation={6} className="login-card">
        <Typography variant="h4" className="login-title">
          Welcome Back
        </Typography>
        <Typography variant="body2" className="login-subtitle">
          Please login to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail color="action" />
                </InputAdornment>
              ),
            }}
            {...register("email", {
              required: "Email is required",
              setValueAs: (value: string) => value.trim(),
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Enter a valid email",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    sx={{ minWidth: 0, padding: 0 }}
                  >
                    {showPassword ? (
                      <EyeOffIcon color="action" />
                    ) : (
                      <EyeIcon color="action" />
                    )}
                  </Button>
                </InputAdornment>
              ),
            }}
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
