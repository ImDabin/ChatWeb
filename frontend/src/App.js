import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

function App() {
  const [user, setUser] = useState(null); // 유저 상태 관리
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  console.log("message List", messageList);

  useEffect(() => {
    // 서버에서 메시지를 수신할 때마다 메시지 리스트 업데이트
    socket.on('message', (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });

    askUserName(); // 컴포넌트가 마운트될 때 유저 이름을 묻는 함수 호출
  }, []);

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요"); // 유저 이름 입력받음
    console.log("User name:", userName);

    // 서버로 로그인 요청
    socket.emit('login', userName, (res) => {
      console.log('Login response:', res); // 서버 응답 확인
      if (res.ok) {
        setUser(res.data); // 서버 응답에 따라 유저 정보 설정
        console.log("User successfully logged in:", res.data);
      } else {
        console.error('Login failed:', res.error); // 로그인 실패 시 에러 출력
      }
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    
    // 서버로 메시지 전송
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res", res);
    });
  };

  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user} />
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
