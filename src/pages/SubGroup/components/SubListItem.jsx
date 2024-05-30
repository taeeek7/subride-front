import styled from "@emotion/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const SubItem = styled.li`
  width: 100%;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 12px 5px;
  margin-bottom: 2px;
  cursor: pointer; 

  .image-box {
    width: 60px;
    height: 60px;
    border-radius: 70%;
    background-color: white;
    margin-right: 10px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .service {
    width: 70%;
  }

  p {
    font-size: 12px;
    margin-left: 1px;
  }

  p.service-name {
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
`;

function SubListItem({ serviceId, serviceName, logo, handleClick, description }) {
  return (
    <SubItem onClick={handleClick}>
      <ListItemAvatar>
        <Avatar
          src={process.env.PUBLIC_URL + `/service/${logo}`}
          alt={serviceName}
        />
      </ListItemAvatar>

      <div className="service">
        <p className="service-name">{serviceName}</p>
        <p>{description}</p>
      </div>
      <ArrowForwardIosIcon
        sx={{ fontSize: "16px", marginLeft: "auto" }}
      />
    </SubItem>
  );
}

export default SubListItem;
