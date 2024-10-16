const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controllers");
const { Socket } = require("socket.io");

module.exports=function(io){
    io.on("connection",async(socket)=>{
        console.log("client is connected", socket.id);

        socket.on("login",async(userName,cb)=>{
            //유저정보 저장
            try {
                const user = await userController.saveUser(userName, socket.id);
                cb({ok:true,data:user});
            } catch (error) {
                cb({ok:false, error:error.message});
            }
            
        });

        socket.on("sendMessage",()=>async(message,cb)=>{
            try {
               //socket ID로 유저 찾기
                const user = await userController.checkUser(socket.id);
                //메시지 저장
                const newMessage = await chatController.saveChat(message,user);
                io.emit("message",newMessage);
                cb({ok:true}); 
            } catch (error) {
                cb({ok:false, error: error.message});
            }
            
        });

        socket.on("disconnect", ()=>{
            console.log("user is disconnected")
        });
    });
};