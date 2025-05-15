import styled from "styled-components";
import SignUp from "../feature/users/SignUp";
import Login from "../feature/users/LoginForm";
import { useState } from "react";

const UserTemplate = styled.div`
  background-color: var(--primary-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90%;
`;

const User = () => {
  const [buttonState, setButtonState] = useState("login");

  return (
    <UserTemplate>
      {buttonState == "signup" && <SignUp />}
      {buttonState == "login" && <Login setButtonState={setButtonState} />}
    </UserTemplate>
  );
};

export default User;