import styled from "styled-components";

const MyWalletContainer = styled.div`
  width: 100%;
  height: 30%;
  background-color: white;
  padding: 5%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

const UserInfo = styled.div`
  width: 100%;
  height: fit-content;
`;

const UserName = styled.div`

`;

const MyWallet  = () => {
  return (
    <MyWalletContainer>
      <UserInfo>
        <UserName>정창우님!<br/>아래에 개인 거래 내역</UserName>
      </UserInfo>
    </MyWalletContainer>
  );
};

export default MyWallet;