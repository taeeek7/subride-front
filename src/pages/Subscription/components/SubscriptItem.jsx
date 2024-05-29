import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

function SubscriptItem({ item, index }) {
  return (
    <ListItem sx={{ padding: "10px 0px" }}>
      <ListItemAvatar>
        <Avatar
          src={process.env.PUBLIC_URL + `/service/${item.logo}`}
          alt={item.subName}
        />
      </ListItemAvatar>
      <ListItemText
        primary={item.subName}
        secondary={`${item.fee.toLocaleString("ko-KR")}원(최대 ${item.maxShareNum}명)`}
        primaryTypographyProps={{ fontSize: "15px" }}
      />
    </ListItem>
  );
}

export default SubscriptItem;
