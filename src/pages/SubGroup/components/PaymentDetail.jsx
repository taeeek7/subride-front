import styled from "@emotion/styled";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useState, useEffect, useCallback } from "react";
import api from "utils/apiInstance";

const PaymentDetailSearchContainer = styled.div`
  position: absolute;
  top: 496px;
  left: 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: solid #eeeeee;

  .searchText {
    display: flex;
    align-items: center;
  }

  .searchTextD {
    margin-right: 9px;
    font-size: 12px;
    color: #767676;
  }

  .selectedButton {
    color: #f8a809;
    font-weight: bold;
  }

  .sortButtons {
    display: flex;
    align-items: center;
  }
`;

const PaymentDetailContainer = styled.div`
  position: absolute;
  top: 540.5px;
  left: 0px;
  width: 100%;
  padding: 0 10px;
  border-bottom: solid #eeeeee;

  .newcss {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid #eeeeee;
  }

  .firstClass {
    display: flex;
    align-items: center;
  }

  .item {
    margin: 0 10px;
  }
`;

const PaymentDetail = ({ groupId, groupData }) => {
  const [pays, setPays] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFilter, setSelectedFilter] = useState("THREE_MONTHS");

  const getPayHistory = useCallback(async (groupId, period) => {
    try {
      const { data } = await api("transfer").get("/transfer", {
        params: { groupId, period },
      });
      return data.response;
    } catch (err) {
      return err;
    }
  }, []);

  const sortData = useCallback((data) => {
    return [...data].sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(b.transferDate) - new Date(a.transferDate);
      } else {
        return new Date(a.transferDate) - new Date(b.transferDate);
      }
    });
  }, [sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      const pays = await getPayHistory(groupId, selectedFilter);
      const sortedPays = sortData(pays);
      setPays(sortedPays);
    };

    fetchData();
  }, [groupId, selectedFilter, getPayHistory, sortData]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const getUserName = (memberId) => {
    const member = groupData.members.find((member) => member.userId === memberId);
    return member ? member.userName : memberId;
  };

  return (
    <>
      <PaymentDetailSearchContainer>
        <div className="searchText">
          <Button
            variant="text"
            size="small"
            onClick={() => handleFilterClick("THREE_MONTHS")}
            className={`searchTextD ${
              selectedFilter === "THREE_MONTHS" ? "selectedButton" : ""
            }`}
          >
            3개월
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => handleFilterClick("ONE_YEAR")}
            className={`searchTextD ${
              selectedFilter === "ONE_YEAR" ? "selectedButton" : ""
            }`}
          >
            전체
          </Button>
        </div>
        <div className="sortButtons">
          <Button
            variant="text"
            size="small"
            onClick={handleSortClick}
            className="searchTextD"
          >
            {sortOrder === "desc" ? "날짜순" : "최신순"}
          </Button>
          {sortOrder === "desc" ? (
            <ExpandMoreIcon
              fontSize="small"
              sx={{ color: "#767676", marginLeft: "10px" }}
            />
          ) : (
            <ExpandLessIcon
              fontSize="small"
              sx={{ color: "#767676", marginLeft: "10px" }}
            />
          )}
        </div>
      </PaymentDetailSearchContainer>

      <PaymentDetailContainer>
        {pays.map((item) => (
          <div className="newcss" key={item.id}>
            <div className="firstClass">
              <div className="item" style={{ width: "100px" }}>
                {new Date(item.transferDate).toLocaleDateString()}
              </div>
              <div className="item" style={{ flexGrow: 1, textAlign: "left" }}>
                <div>{groupData && getUserName(item.memberId)}</div>
                <div style={{ fontSize: "10px", color: "#C59AC9" }}>
                  #자동이체
                </div>
              </div>
              <img
                style={{ paddingLeft: "10px", width: "auto", height: "20px" }}
                src={`/logo/KB로고.png`}
                alt="kb로고"
              />
            </div>

            <div className="item">
              {item.amount.toLocaleString("ko-KR")}원
            </div>
          </div>
        ))}
      </PaymentDetailContainer>
    </>
  );
};

export default PaymentDetail;