import React, { useEffect, useState } from "react";
import Navbar from "../../layout/navbar/Navbar";
import WaveAnimation from "../../components/home_BG/WaveAnimation";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/userservice/UserService";
import { updateUser } from "../../slices/User";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../components/chatbox/ChatBox";
const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.Authenticated.value);
  const token = useSelector((state) => state.Token.value);
  const User = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      UserService.authUser(token).then((res) => {
        dispatch(updateUser(res.data.user));
      });
    } else {
      navigate("/");
    }
  }, []);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="flex gap-5 w-screen">
      {isAuthenticated && (
        <>
          <div className="z-40 flex  w-screen ">
            <div>
              <Navbar />
            </div>
            <div className=" pt-24 md:pt-36 w-screen mx-auto flex flex-wrap h-1/2 md:flex-row items-center justify-center">
              <h1 className="my-4 text-3xl w- md:text-5xl text-white opacity-75   font-bold leading-tight text-center md:text-left">
                Welcome to BikeCare
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
                  {" " + User.username + " "}
                </span>
              </h1>
              <img src="src/assets/videos/robot.gif" alt="" className="h-80" />
            </div>
          </div>
          <div className="relative">
      {!isChatOpen && User.role!=="ADMIN" &&(
        <div className="fixed right-6 h-screen z-50 flex items-end text-white p-5">
          <img
            src="src/assets/icons/chat.svg"
            className="hover:cursor-pointer h-14 w-14"
            alt=""
            onClick={toggleChat}
          />
        </div>
      )}
      {isChatOpen && 
              <div className="fixed right-6 h-screen z-50 flex items-end text-white p-5">
      <ChatBox isOpen={isChatOpen} toggleChat={toggleChat} />
      </div>}
    </div>
          <WaveAnimation />
        </>
      )}
    </div>
  );
};

export default Home;
