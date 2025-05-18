import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import EmailImg from '../../assets/userImg.svg?react';
import PasswordImg from '../../assets/passwordImg.svg?react';
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginWrapper = styled.div`
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  width: 30%;
  height: fit-content;
  padding: 32px;
  border-radius: 10px;
  background: #fff;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: none;
  font-size: 18px;
`;

const Button = styled.button`
  padding: 12px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #0056b3;
  }
`;

const SignUpBt = styled.button`
  padding: 12px;
  background: #fff;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const ElementStyle = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://nexbit.p-e.kr/user/login", {
        email: form.email,
        password: form.password,
      });
      alert("로그인 성공!");
      setToken(response.data.token);
      navigate(-1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert("로그인 실패1: " + (err.response?.data?.message || err.message));
      } else if (err instanceof Error) {
        alert("로그인 실패2: " + err.message);
      } else {
        alert("로그인 실패3: 알 수 없는 오류");
      }
    }
  };

  return (
    <LoginWrapper>
      <LoginForm onSubmit={handleSubmit}>
        <ElementStyle>
          <EmailImg
            style={{ width: "30px", height: "auto", marginLeft: "10px" }}
          />
          <Input
            type="email"
            id="email"
            name="email"
            value={form.email}
            placeholder="이메일"
            onChange={handleChange}
            required
          />
        </ElementStyle>
        <ElementStyle>
          <PasswordImg
            style={{ width: "30px", height: "auto", marginLeft: "10px" }}
          />
          <Input
            type="password"
            id="password"
            name="password"
            value={form.password}
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
        </ElementStyle>
        <Button type="submit">로그인</Button>
        <SignUpBt type="button" onClick={() => setButtonState("signup")}>회원가입</SignUpBt>
      </LoginForm>
    </LoginWrapper>
  );
};

export default Login;
