const ChatBox = ({
  messages,
  input,
  handleInputChange,
  handleKeyPress,
  handleSend,
}: {
  messages: string[];
  input: string;
  handleInputChange: (e: any) => void;
  handleKeyPress: (e: any) => void;
  handleSend: () => void;
}) => {
  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="chat-message">
              {message}
            </div>
          ))
        ) : (
          <div className="chat-message">...</div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
