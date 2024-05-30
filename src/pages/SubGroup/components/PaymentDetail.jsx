import styled from "@emotion/styled";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useState, useEffect, useCallback } from "react";

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
    font-family: "KBFGTextM";
  }
`;

const PaymentDetail = ({ serviceData }) => {
  const [filteredPays, setFilteredPays] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFilter, setSelectedFilter] = useState("3개월");

  useEffect(() => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const filteredData = serviceData.pays.filter((item) => {
      const paymentDate = new Date(item.payDateTime);
      return paymentDate >= threeMonthsAgo;
    });
    const sortedPays = [...filteredData].sort((a, b) => {
      return new Date(b.payDateTime) - new Date(a.payDateTime);
    });
    setFilteredPays(sortedPays);
  }, [serviceData.pays]);

  const calculateFee = useCallback((fee, usersLength) => {
    return Math.ceil(fee / usersLength).toLocaleString("ko-KR");
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (filter === "3개월") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const filteredData = serviceData.pays.filter((item) => {
        const paymentDate = new Date(item.payDateTime);
        return paymentDate >= threeMonthsAgo;
      });
      const sortedData = sortData(filteredData);
      setFilteredPays(sortedData);
    } else if (filter === "전체") {
      const sortedData = sortData(serviceData.pays);
      setFilteredPays(sortedData);
    }
  };
  
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(b.payDateTime) - new Date(a.payDateTime);
      } else {
        return new Date(a.payDateTime) - new Date(b.payDateTime);
      }
    });
  };

  const handleSortClick = () => {
    const sortedData = [...filteredPays].sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(a.payDateTime) - new Date(b.payDateTime);
      } else {
        return new Date(b.payDateTime) - new Date(a.payDateTime);
      }
    });
    setFilteredPays(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <>
      <PaymentDetailSearchContainer>
        <div className="searchText">
          <Button
            variant="text"
            size="small"
            onClick={() => handleFilterClick("3개월")}
            className={`searchTextD ${
              selectedFilter === "3개월" ? "selectedButton" : ""
            }`}
          >
            3개월
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => handleFilterClick("전체")}
            className={`searchTextD ${
              selectedFilter === "전체" ? "selectedButton" : ""
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
        {filteredPays.map((item) => (
          <div className="newcss" key={item.id}>
            <div className="firstClass">
              <div className="item" style={{ width: "100px" }}>
                {new Date(item.payDateTime).toLocaleDateString()}
              </div>
              <div className="item" style={{ flexGrow: 1, textAlign: "left" }}>
                <div>{item.username}</div>
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

            <div className="item" style={{ fontFamily: "KBFGTextB" }}>
              {calculateFee(
                serviceData.subscribeDTO.fee,
                serviceData.users.length
              )}
              원
            </div>
          </div>
        ))}
      </PaymentDetailContainer>
    </>
  );
};

export default PaymentDetail;