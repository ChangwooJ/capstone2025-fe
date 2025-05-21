import React, { useState } from "react";
import axios from "axios";
import EmailImg from '../../assets/userImg.svg?react';
import PasswordImg from '../../assets/passwordImg.svg?react';
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

interface SignUpProps {
  setButtonState: React.Dispatch<React.SetStateAction<string>>;
}

const SignUp = ({ setButtonState }: SignUpProps) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    username: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (form.password !== form.passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return false;
    }
    if (!form.email.includes('@')) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    if (form.username.length < 2) {
      setError("이름은 2자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("https://nexbit.p-e.kr/user/signup", {
        email: form.email,
        password: form.password,
        username: form.username,
      });
      setButtonState("login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "회원가입에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleLoginClick = () => {
    setButtonState("login");
  };

  return (
    <AuthContainer>
      <AuthTitle>회원가입</AuthTitle>
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
        <InputGroup>
          <InputIcon>
            <PasswordImg style={{ width: "20px", height: "20px" }} />
          </InputIcon>
          <Input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={form.passwordCheck}
            placeholder="비밀번호 확인"
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <InputIcon>
            <EmailImg style={{ width: "20px", height: "20px" }} />
          </InputIcon>
          <Input
            type="text"
            id="username"
            name="username"
            value={form.username}
            placeholder="이름"
            onChange={handleChange}
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">회원가입</Button>
        <SwitchText>
          이미 계정이 있으신가요?
          <SwitchButton type="button" onClick={handleLoginClick}>
            로그인
          </SwitchButton>
        </SwitchText>
      </AuthForm>
    </AuthContainer>
  );
};

export default SignUp;
