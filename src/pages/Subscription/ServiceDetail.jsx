import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import "react-toastify/dist/ReactToastify.css";
import api from "utils/apiInstance";
import BackHeader from "components/BackHeader";
import Navigation from "components/Navigation";

const ServiceDetailContainer = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const ServiceName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const CategoryName = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const FeeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FeeLabel = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #f8a809;
  margin-right: 0.5rem;
`;

const FeeAmount = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #f8a809;
`;

const MaxUser = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

const LogoImage = styled.img`
  max-width: 100%;
  height: 33.33vh;
  object-fit: contain;
  margin-bottom: 1rem;
`;

function ServiceDetail({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = location.state?.serviceId;
  const [service, setService] = useState(null);
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api("subrecommend").get("/subrecommend/detail/" + serviceId);
        setService(data.response);
      } catch (err) {
        console.error(err);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <BackHeader text={service.name} navigate={navigate} />
      <ServiceDetailContainer>
        <LogoImage
          src={process.env.PUBLIC_URL + `/service/` + service.logo}
          alt={service.name}
        />
        <ServiceName>{service.name}</ServiceName>
        <CategoryName>{service.categoryName}</CategoryName>
        <Description>{service.description}</Description>
        <FeeContainer>
          <FeeLabel>금액:</FeeLabel>
          <FeeAmount>{service.fee.toLocaleString("ko-KR")}원</FeeAmount>
        </FeeContainer>
        <MaxUser>최대 {service.maxShareNum}명 공유 가능</MaxUser>
        
      </ServiceDetailContainer>
      <Navigation />

    </>
  );
}

export default ServiceDetail;
