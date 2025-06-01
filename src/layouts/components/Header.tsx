import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from '../../assets/NexBit.svg?react';

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
`;

const Header = () => {
  const navigate = useNavigate();

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
        <NavigationSection></NavigationSection>
      </HeaderContain>
    </HeaderContainer>
  );
};

export default Header;
