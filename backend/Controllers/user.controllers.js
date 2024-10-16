const User = require("../Models/user");
const userController = {};

userController.saveUser=async(userName,sid)=>{
    //이미 있는 유저인지 확인
    const user = await User.findOne({name: userName});
    //없다면 새로운 유저정보 생성
    if(!user){
        user = new User({
            name: userName,
            token: sid,
            online: true,
        });
    }
    //이미 있는 유저라면 토큰값만 바꿈
    user.token = sid;
    user.online = true;

    await user.save();
    return user;

};

userController.checkUser = async(sid)=>{
    const user = await User.findOne({token: sid});
    if (!user) throw new Error("user not found");
    return user;
}

module.exports = userController;