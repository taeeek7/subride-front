import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import RecommendIcon from "@mui/icons-material/Recommend";
import { useState } from "react";
import { memo } from "react";

const path = {
  "/": 0,
  "/subgroup/mysubgroup": 1,
  "/subscription/recommend": 2,
  "/subscription/mysubscription": 3,
};

function Navigation() {
  const { pathname } = useLocation();
  const [value, setValue] = useState(path[pathname]);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{
        "& .Mui-selected, .Mui-selected > svg": {
          color: "#F8A809",
        },
        position: "fixed",
        width: "100%",
        left: "0",
        bottom: "0",
        display: "flex",
      }}
    >
      <BottomNavigationAction
        label="홈"
        component={Link}
        to="/"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label="Sub"
        component={Link}
        to="/subgroup/mysubgroup"
        icon={<GroupsIcon />}
      />
      <BottomNavigationAction
        label="추천"
        component={Link}
        to="/subscription/recommend"
        icon={<RecommendIcon />}
      />
      <BottomNavigationAction
        label="구독현황"
        component={Link}
        to="/subscription/mysubscription"
        icon={<BookmarksIcon />}
      />
    </BottomNavigation>
  );
}

export default memo(Navigation);
