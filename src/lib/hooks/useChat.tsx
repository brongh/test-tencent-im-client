import { useEffect, useRef, useState } from "react";
import { chatClient } from "../chat";
import axios from "axios";
import TencentCloudChat from "@tencentcloud/chat";
import ChatBox from "../ChatBox";

const useChat = () => {
  const { login, joinGroup, createTextMessage, sendMessage } = chatClient;

  const [userSig, setUserSig] = useState(
    "eJwtzMsKwjAUBNB-uWspSduYJuDG4EIQpSqC7oQkeluahj60Vvx36WM5Z4b5wnl3Cl6mAglhQGAxZtTGNWhx5NZpY9EZPZe1zu-eowYZEkIEJWLyBgsDknK6TLiIeDyp6TxWgzPGhv38gQ*Q0CfhJ3UdRqxQfZ6p7fVys1m7x5TGyj8PR-7erFnNRFmu4PcH5Vcy5Q__"
  );

  const loading = useRef(true);
  const loadingSig = useRef(false);
  const getUserSig = async () => {
    loadingSig.current = true;
    const response = await axios.post(
      "https://us-central1-muslim-pro-app-staging.cloudfunctions.net/QalBox-GetUserSignature",
      {
        data: {
          user_name: "bairong-test",
        },
      }
    );
    loadingSig.current = false;
    setUserSig(response.data);
  };

  const initIM = async () => {
    try {
      const response = await login({
        userSig,
        userID: "bairong-test",
      });
      loading.current = false;
      console.log("login response: ", response);
    } catch (error) {
      console.log("login error: ", error);
      getUserSig();
    }

    try {
      await joinGroup({
        groupID: "@TGS#aXCTEEF5CJ",
        type: TencentCloudChat.TYPES.GRP_AVCHATROOM,
      });
    } catch (error) {
      console.log("join group error: ", error);
    }
  };

  const handleTCSendMessage = (msg) => {
    const message = createTextMessage({
      to: decodeURIComponent(id),
      conversationType: CHAT_TYPES.CONV_GROUP,
      payload: {
        text: msg,
      },
    });
    // 2. Send the message.
    const promise = sendMessage(message);
    promise
      .then(function (imResponse) {
        // The message sent successfully
        console.log(imResponse);
      })
      .catch(function (imError) {
        // Failed to send the message
        console.warn("sendMessage error:", imError);
      });
  };
  const [messages, setMessages] = useState([]);
  const [userMsgInput, setUserMsgInput] = useState("");

  const handleSendMessage = () => {
    if (userMsgInput.trim() !== "") {
      handleTCSendMessage(userMsgInput);
      setMessages((prev: any) => {
        if (prev.length > 0) {
          return [...prev, userMsgInput];
        } else {
          return [userMsgInput];
        }
      });
      setUserMsgInput("");
    }
  };

  const handleInputChange = (e: any) => {
    e.preventDefault();
    setUserMsgInput(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    e.preventDefault();
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    initIM();
  }, []);

  useEffect(() => {
    chatClient.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (data: any) => {
      console.log("incoming message: ", data);
    });
  }, []);

  return (
    <div>
      <div>Chat Page</div>
      <ChatBox
        messages={messages}
        input={userMsgInput}
        handleInputChange={handleInputChange}
        handleKeyPress={handleKeyPress}
        handleSend={handleSendMessage}
      />
    </div>
  );
};

export default useChat;
