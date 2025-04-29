import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import EmailImg from '../../assets/userImg.svg?react';
import PasswordImg from '../../assets/passwordImg.svg?react';

const SignUpWrapper = styled.div`
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  width: 30%;
  height: fit-content;
  padding: 32px;
  border-radius: 10px;
  background: #fff;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  font-size: 16px;
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

const ElementStyle = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 간단한 유효성 검사 예시
    if (form.password !== form.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/user/signup", {
        email: form.email,
        password: form.password,
        username: form.username,
      });
      alert("회원가입 성공!");
      // 필요시 페이지 이동 등 추가 작업
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert("회원가입 실패: " + (err.response?.data?.message || err.message));
      } else if (err instanceof Error) {
        alert("회원가입 실패: " + err.message);
      } else {
        alert("회원가입 실패: 알 수 없는 오류");
      }
    }
  };

  return (
    <SignUpWrapper>
      <SignUpForm onSubmit={handleSubmit}>
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
        <ElementStyle>
          <PasswordImg
            style={{ width: "30px", height: "auto", marginLeft: "10px" }}
          />
          <Input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={form.passwordCheck}
            placeholder="비밀번호 확인"
            onChange={handleChange}
            required
          />
        </ElementStyle>
        <ElementStyle>
          <EmailImg
            style={{ width: "30px", height: "auto", marginLeft: "10px" }}
          />
          <Input
            type="text"
            id="username"
            name="username"
            value={form.username}
            placeholder="이름"
            onChange={handleChange}
            required
          />
        </ElementStyle>
        <Button type="submit">회원가입</Button>
      </SignUpForm>
    </SignUpWrapper>
  );
};

export default SignUp;
