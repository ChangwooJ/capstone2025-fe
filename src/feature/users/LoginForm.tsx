import React, { useState } from "react";
import axios from "axios";
import EmailImg from '../../assets/userImg.svg?react';
import PasswordImg from '../../assets/passwordImg.svg?react';
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  AuthContainer,
  AuthTitle,
  AuthForm,
  InputGroup,
  InputIcon,
  Input,
  Button,
  SwitchText,
  SwitchButton,
  ErrorMessage
} from './styles';

interface LoginProps {
  setButtonState: React.Dispatch<React.SetStateAction<string>>;
}

const Login = ({ setButtonState }: LoginProps) => {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://nexbit.p-e.kr/user/login", {
        email: form.email,
        password: form.password,
      });
      setToken(response.data.token);
      navigate(-1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "로그인에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <AuthContainer>
      <AuthTitle>로그인</AuthTitle>
      <AuthForm onSubmit={handleSubmit}>
        <InputGroup>
          <InputIcon>
            <EmailImg style={{ width: "20px", height: "20px" }} />
          </InputIcon>
          <Input
            type="email"
            id="email"
            name="email"
            value={form.email}
            placeholder="이메일"
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <PasswordImg style={{ width: "20px", height: "20px" }} />
          </InputIcon>
          <Input
            type="password"
            id="password"
            name="password"
            value={form.password}
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">로그인</Button>
        <SwitchText>
          계정이 없으신가요?
          <SwitchButton type="button" onClick={() => setButtonState("signup")}>
            회원가입
          </SwitchButton>
        </SwitchText>
      </AuthForm>
    </AuthContainer>
  );
};

export default Login;
