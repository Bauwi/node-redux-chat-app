import { notification, Icon } from "antd";

export const userEntersRoomNotif = username => {
  notification.open({
    message: `${username} has joined.`,
    className: "notification",
    style: {
      position: "relative",
      top: "70px",
      marginLeft: 335 - 250,
      width: 300
      //   position: "relative",
      //   top: "65px"
    },

    icon: <Icon type="user-add" style={{ color: "#ffd21f" }} />
  });
};
