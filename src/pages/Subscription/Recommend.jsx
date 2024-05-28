import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { Grid, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from "components/Navigation";
import BackHeader from "components/BackHeader";
import api from "utils/apiInstance";

const RecommendPage = styled.div`
  color: #4a4646;

  p {
    margin: 0;
  }

  span {
    font-family: "KBFGDisplayB";
  }

  .title {
    font-size: 16px;
    margin-top: 40px;
    color: #4a483f;
  }

  .sub-title {
    font-size: 12px;
    color: #767676;
    margin: 0.5rem 0rem;
    white-space: nowrap;
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  '&:hover': {
    boxShadow: theme.shadows[5],
    cursor: 'pointer',
  },
}));

const getCategories = async () => {
  try {
    const { data } = await api("subrecommend").get("/subrecommend/categories");
    return data.response;
  } catch (err) {
    return err;
  }
};

const getEnrollList = async (categoryId, userId) => {
  try {
    const { data } = await api("subrecommend").get("/subrecommend/list", {
      params: { categoryId, userId },
    });
    return data.response;
  } catch (err) {
    return err;
  }
};

function Recommend({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultCategory = location.state?.defaultCategory || "life";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [categoryList, setCategoryList] = useState([]);
  const [subscribeList, setSubscribeList] = useState([]);
  const [recommendData, setRecommendData] = useState(null);

  useEffect(() => {
    const fetchRecommendData = async () => {
      try {
        const { data } = await api("subrecommend").get(`/subrecommend/category?userId=${user.userId}`);
        setRecommendData(data.response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendData();
  }, [user.userId]);


  const getSpendingTitle = (category) => {
    switch (category) {
      case 'Life':
        return '생활용품';
      case 'Pet':
        return '반려용품';
      case 'OTT':
        return 'OTT';
      case 'Food':
        return '음식';
      case 'Health':
        return '건강';
      case 'Culture':
        return '문화';
      default:
        return '';
    }
  };

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleServiceClick = useCallback((serviceId) => {
    navigate(`/subscription/service/${serviceId}`, { state: { serviceId: serviceId, alreadyEnroll:false } });
  }, [navigate]);

  const fetchCategories = useCallback(async () => {
    try {
      const result = await getCategories();
      //console.log(result);
      setCategoryList(result);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchEnrollList = useCallback(async (categoryId, userId) => {
    try {
      const result = await getEnrollList(categoryId, userId);
      console.log(result);
      setSubscribeList(result);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchEnrollList(defaultCategory, user.id);
  }, [fetchCategories, fetchEnrollList, user.id, defaultCategory]);

  useEffect(() => {
    fetchEnrollList(selectedCategory, user.id);
  }, [fetchEnrollList, user.id, selectedCategory]);

  return (
    <>
      <BackHeader text="추천"></BackHeader>
      <RecommendPage>
        <p className="title">
          {user.userName}님을 위한{" "}
          <span style={{ fontSize: "20px", color: "#F8A809" }}>
            구독서비스 추천
          </span>
        </p>
        {recommendData && (
          <p className="sub-title">
            지난 한달 {getSpendingTitle(recommendData.spendingCategory)}에{" "}
            {recommendData.totalSpending.toLocaleString("ko-KR")}원을 지출했어요
          </p>
        )}
      </RecommendPage>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {categoryList.map((item) => (
          <Grid item xs={4} key={item.id}>
            <Button
              fullWidth
              variant={selectedCategory === item.categoryId ? "contained" : "outlined"}
              color={selectedCategory === item.categoryId ? "primary" : "inherit"}
              onClick={() => handleCategoryClick(item.categoryId)}
            >
              {item.categoryName}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4, mb: 8 }}>
        {subscribeList.map((item) => (
          <Grid item xs={6} sm={4} md={3} key={item.id}>
            <StyledCard
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              onClick={() => handleServiceClick(item.id)}
            >
              <CardMedia component="img" height="140" image={process.env.PUBLIC_URL +
                `/service/` + item.logo} alt={item.name} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {item.fee.toLocaleString("ko-KR")}원
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Navigation />
    </>
  );
}

export default Recommend;