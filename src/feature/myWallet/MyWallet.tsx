import styled from "styled-components";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import EmailImg from '../../assets/userImg.svg?react';
import { Link } from "react-router-dom";

const MyWalletContainer = styled.div`
  width: 100%;
  height: 30%;
  background-color: white;
  padding: 3% 8%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 10px;

  ul {
    list-style-type: none;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3%;
  border-radius: 10px;
  background-color: #f9fbfd;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
`;

const UserTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
`;

const LogoutButton = styled.button`
  padding: 0 5px;
  border-radius: 10px;
  border: 1px solid white;
  background-color: #72dac8;
  color: white;
  cursor: pointer;
`;

const NotLogin = styled.div`
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const MenuButton = styled(Link)`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #72dac8;
  background-color: white;
  color: #333;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: #72dac8;
    color: white;
  }
`;

interface UserInfo {
  username: string;
  email: string;
  users_id: number;
}

interface UpbitAsset {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  unit_currency: string;
}

const MyWallet  = () => {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [assets, setAssets] = useState<UpbitAsset[] | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchInfo = async () => {
    try {
      const response = await axios.get('https://nexbit.p-e.kr/user/info', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(response.data.user);
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInfo();
    }
  }, [token]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('https://nexbit.p-e.kr/user/mywallet');
      setAssets(response.data);
    } catch (error) {
      console.error("업비트 자산 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchAssets();
    }
  }, [userInfo]);

  const handleLogout = () => {
    clearToken();
  }
console.log(assets);
  return (
    <MyWalletContainer>
      {userInfo && (
        <>
          <UserInfo>
            <UserTop>
              <UserName>
                <EmailImg
                  style={{
                    width: "30px",
                    height: "auto",
                    marginRight: "10px",
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                />
                {userInfo.username}님!
              </UserName>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </UserTop>
          </UserInfo>
          <MenuButtonContainer>
            <MenuButton to="/investments">투자내역</MenuButton>
            <MenuButton to="/mypage/profile-edit">내 정보 수정</MenuButton>
          </MenuButtonContainer>
          {assets ? (
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontWeight: "bold" }}>내 업비트 자산</div>
              <ul>
                {assets.map((asset) => (
                  <li key={asset.currency}>
                    {asset.currency}: {Number(asset.balance).toLocaleString()}{" "}
                    (평균매입가: {Number(asset.avg_buy_price).toLocaleString()} KRW)
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              자산 정보를 불러오는 중입니다...
            </div>
          )}
        </>
      )}
      {!userInfo && (
        <NotLogin>
          <Link
            to="/login"
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            로그인
          </Link>
          을 해주세요.
        </NotLogin>
      )}
    </MyWalletContainer>
  );
};

export default MyWallet;