import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "utils/apiInstance";
import BackHeader from "components/BackHeader";
import Navigation from "components/Navigation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

const SubscribeButton = styled(Button)`
  && {
    background-color: #f8a809;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0.8rem 1.6rem;
    margin-top: 1rem;
    &:hover {
      background-color: #e09a07;
    }
  }
`;

const UnsubscribeButton = styled(Button)`
  && {
    background-color: #f0f0f0;
    color: #666;
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    margin-top: 0.5rem;
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const getService = async (serviceId) => {
  try {
    const { data } = await api("subrecommend").get(
      "/subrecommend/detail/" + serviceId
    );
    return data.response;
  } catch (err) {
    return err;
  }
};
const checkSubscribed = async (userId, serviceId) => {
  try {
    const { data } = await api("mysub").get("/my-subs/checking-subscribe", {
      params: { userId, subId: serviceId },
    });
    return data.response;
  } catch (err) {
    return err;
  }
};

function ServiceDetail({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceId = location.state?.serviceId;
  const [service, setService] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (serviceId) {
        const serviceData = await getService(serviceId);
        setService(serviceData);

        if (user && user.id) {
          const subscriptionStatus = await checkSubscribed(user.id, serviceId);
          setIsSubscribed(subscriptionStatus);
        }
      }
    };
    fetchService();
  }, [serviceId, user]);

  if (!service) {
    return <div>Loading...</div>;
  }

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { data } = await api("mysub").post("/my-subs/"+serviceId, null, {
        params: { userId: user.id }
      });
      toast.success(data.message, {
        onClose: () =>
          navigate("/subscription/mysubscription", {
            state: { from: "/subscription/service/" + serviceId },
          }),

        position: "top-center",
        autoClose: 300, //  자동으로 사라짐
        hideProgressBar: true, // 진행바 숨김
        closeOnClick: true, // 클릭 시 닫힘
        pauseOnHover: false, // 마우스 오버 시 자동 닫힘 일시 정지
        draggable: false, // 드래그 가능
      });
    } catch (err) {
      //console.log(err);
      toast.error(err.response.data.message, { autoClose: 300 });
      setIsLoading(false);
    }
  };

  const handleConfirmUnsubscribe = async () => {
    try {
      const { data } = await api("mysub").delete("/my-subs/"+serviceId, {
        params: { userId: user.id }
      });
     
      if (data.code === 200) {
        toast.success(data.message, {
          autoClose: 300,
          onClose: () => {
            navigate(-1);
          },
        });
      } else {
        toast.error(data.message, {
          autoClose: 500,
        });
      }
    } catch (err) {
      //console.log(err);
      toast.error(`구독 취소에 실패했습니다.(${err.response.data.message})`, {
        autoClose: 500,
      });
    }
    handleCloseConfirmDialog();
  };

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

        {!isSubscribed && (
          <SubscribeButton onClick={handleSubscribe} disabled={isLoading}>
            {isLoading ? "구독 중..." : "구독하기"}
          </SubscribeButton>
        )}
        {isSubscribed && (
          <UnsubscribeButton onClick={handleOpenConfirmDialog}>
            구독 취소
          </UnsubscribeButton>
        )}
      </ServiceDetailContainer>
      <Navigation />

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>구독 취소 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>정말 구독을 취소하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmUnsubscribe} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ServiceDetail;
