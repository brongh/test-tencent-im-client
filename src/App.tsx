import { useEffect, useRef, useState } from "react";
import "./App.css";
import useChat from "./lib/hooks/useChat";
import { chatClient } from "./lib/chat";
import axios from "axios";
import TencentCloudChat from "@tencentcloud/chat";
import ChatBox from "./lib/ChatBox";

function App() {
  // useChat();

  const { login, joinGroup, createTextMessage, sendMessage } = chatClient;

  const [userSig, setUserSig] = useState("");
  // @TGS#aMHXYEF5C3
  const loading = useRef(true);
  const loadingSig = useRef(false);
  const getUserSig = async () => {
    loadingSig.current = true;
    const response = await axios.post(
      "https://us-central1-muslim-pro-app-staging.cloudfunctions.net/QalBox-GetUserSignature",
      {
        data: {
          user_id: "testing",
        },
      }
    );
    loadingSig.current = false;
    setUserSig(response.data.result);
  };

  const initIM = async () => {
    try {
      const response = await login({
        userSig,
        userID: "testing",
      });
      loading.current = false;
      console.log("login response: ", response);
    } catch (error) {
      console.log("login error: ", error);
      getUserSig();
    }

    try {
      await joinGroup({
        groupID: "@TGS#aMHXYEF5C3",
        type: TencentCloudChat.TYPES.GRP_AVCHATROOM,
      }).then(() => console.log("joined group"));
    } catch (error) {
      console.log("join group error: ", error);
    }
  };

  const handleTCSendMessage = (msg) => {
    const message = createTextMessage({
      to: "@TGS#aMHXYEF5C3",
      conversationType: TencentCloudChat.TYPES.CONV_GROUP,
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
    getUserSig();
  }, []);

  useEffect(() => {
    if (userSig) {
      initIM();
    }
  }, [userSig]);

  useEffect(() => {
    chatClient.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (data: any) => {
      console.log("incoming message: ", data);
    });
  }, []);

  useEffect(() => {
    chatClient.on(TencentCloudChat.EVENT.SDK_READY, () => {
      chatClient.updateMyProfile({
        nick: "testerrr",
        avatar:
          "https://lh3.googleusercontent.com/a/AAcHTtfhXE1VbJzWkZlb0ogmKI16ZaIYJjRpZ2w0shbI=s96-c",
      });
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
}

export default App;
