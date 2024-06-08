import TencentCloudChat from "@tencentcloud/chat";

interface CREATE_OPTIONS {
  /**
   * SDKAppID of your Chat application
   */
  SDKAppID: number;
  /**
   * WebSocket server proxy address
   */
  proxyServer?: string | undefined;
  /**
   * Image, video, file upload proxy address
   */
  fileUploadProxy?: string | undefined;
  /**
   * Image, video, file download proxy address
   */
  fileDownloadProxy?: string | undefined;
  /**
   * Scenes of chat-uikit
   */
  scene?: string | undefined;
}

const options: CREATE_OPTIONS = {
  SDKAppID: 20009109,
};

export const chatClient = TencentCloudChat.create(options);
