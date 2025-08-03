import React from "react";
import { useLocation, useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatRoomGeneral = ({ username }) => {
  const location = useLocation();
  const { room } = useParams();
  const params = new URLSearchParams(location.search);
  const problem = params.get("problem");

  return <ChatRoom username={username} room={room} problem={problem} />;
};

export default ChatRoomGeneral;