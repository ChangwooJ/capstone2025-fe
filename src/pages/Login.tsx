import styled from "styled-components";
import SignUp from "../feature/users/SignUp";

const UserTemplate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90%;
`;

const Login = () => {

  return (
    <UserTemplate>
      <SignUp />
    </UserTemplate>
  );
};

export default Login;