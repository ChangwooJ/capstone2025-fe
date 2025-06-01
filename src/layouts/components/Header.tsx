import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Logo from '../../assets/NexBit.svg?react';
import { useAuthStore } from "../../store/useAuthStore";

const HeaderContainer = styled.div`
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
`;

const LogoSection = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContain = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const NavigationSection = styled.div`
  width: 75%;
  padding-left: 2rem;
`;

const NavigationMenu = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  text-decoration: none;
  color: ${props => props.$isActive ? '#72dac8' : '#6c757d'};
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: ${props => props.$isActive ? '#f8f9fa' : 'transparent'};

  &:hover {
    background-color: #f8f9fa;
    color: #72dac8;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  function handleHomeClick() {
    navigate("/");
  }

  return (
    <HeaderContainer>
      <HeaderContain>
        <LogoSection>
          <Link to="/">
            <div 
              onClick={handleHomeClick} 
              style={{ cursor: "pointer" }}
            >
              <Logo 
                style={{ width: "120px", height: "auto" }}
                preserveAspectRatio="none"
              />
            </div>
          </Link>
        </LogoSection>
        <NavigationSection>
          <NavigationMenu>
            <NavLink 
              to="/exchange" 
              $isActive={location.pathname === '/exchange'}
            >
              거래소
            </NavLink>
            {token && (
              <NavLink 
                to="/investments" 
                $isActive={location.pathname === '/investments'}
              >
                투자내역
              </NavLink>
            )}
            {!token && (
              <NavLink 
                to="/login" 
                $isActive={location.pathname === '/login'}
              >
                로그인
              </NavLink>
            )}
          </NavigationMenu>
        </NavigationSection>
      </HeaderContain>
    </HeaderContainer>
  );
};

export default Header;
