import React, { useState } from "react";
import EmailImg from '../../assets/userImg.svg?react';
import PasswordImg from '../../assets/passwordImg.svg?react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
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
import { postLogin } from "../../apis/userApis";

interface LoginProps {
  setButtonState: React.Dispatch<React.SetStateAction<string>>;
}

const Login = ({ setButtonState }: LoginProps) => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const response = await postLogin({ form });
    if (typeof response === 'string') {
      setError(response);
    } else {
      setToken(response.token);
      navigate(-1);
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
