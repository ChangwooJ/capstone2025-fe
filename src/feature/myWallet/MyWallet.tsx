import styled from "styled-components";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import EmailImg from '../../assets/userImg.svg?react';
import { Link } from "react-router-dom";
import { getUserAsset, getUserInfo } from "../../apis/userApis";

const MyWalletContainer = styled.div`
  width: 100%;
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  margin: 1rem 0;
`;

const UserInfo = styled.div`
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const UserTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: #72dac8;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #5bc4b0;
    transform: translateY(-1px);
  }
`;

const NotLogin = styled.div`
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: #6c757d;
`;

const MenuButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const MenuButton = styled(Link)`
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 2px solid #72dac8;
  background-color: white;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #72dac8;
    color: white;
    transform: translateY(-1px);
  }
`;

const AssetSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const AssetTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
`;

const AssetList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
`;

const AssetItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const AssetCurrency = styled.span`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const AssetBalance = styled.span`
  color: #495057;
  font-size: 1rem;
`;

const AssetPrice = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  font-size: 1.1rem;
`;

const LoginLink = styled(Link)`
  color: #72dac8;
  text-decoration: none;
  font-weight: 600;
  margin: 0 0.3rem;
  
  &:hover {
    text-decoration: underline;
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
    if (!token) {
      return;
    }

    const userInfo = await getUserInfo(token);
    setUserInfo(userInfo);
  };

  useEffect(() => {
    fetchInfo();
  }, [token]);

  const fetchAssets = async () => {
    const asset = await getUserAsset();
    setAssets(asset);
  };

  useEffect(() => {
    if (userInfo) {
      fetchAssets();
    }
  }, [userInfo]);

  const handleLogout = () => {
    clearToken();
    setUserInfo(null);
    setAssets(null);
  }

  return (
    <MyWalletContainer>
      {userInfo && (
        <>
          <UserInfo>
            <UserTop>
              <UserName>
                <EmailImg
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "12px",
                    borderRadius: "50%",
                    border: "2px solid #72dac8",
                    padding: "2px",
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
            <AssetSection>
              <AssetTitle>내 업비트 자산</AssetTitle>
              <AssetList>
                {assets.map((asset) => (
                  <AssetItem key={asset.currency}>
                    <AssetInfo>
                      <AssetCurrency>{asset.currency}</AssetCurrency>
                      <AssetBalance>
                        {asset.currency === 'BTC' 
                          ? Number(asset.balance).toFixed(6)
                          : Math.floor(Number(asset.balance)).toLocaleString()}
                      </AssetBalance>
                    </AssetInfo>
                    {asset.currency !== 'KRW' && (
                      <AssetPrice>
                        평균매입가: {Math.floor(Number(asset.avg_buy_price)).toLocaleString()} KRW
                      </AssetPrice>
                    )}
                  </AssetItem>
                ))}
              </AssetList>
            </AssetSection>
          ) : (
            <LoadingText>자산 정보를 불러오는 중입니다...</LoadingText>
          )}
        </>
      )}
      {!userInfo && (
        <NotLogin>
          <LoginLink to="/login">로그인</LoginLink>
          을 해주세요.
        </NotLogin>
      )}
    </MyWalletContainer>
  );
};

export default MyWallet;