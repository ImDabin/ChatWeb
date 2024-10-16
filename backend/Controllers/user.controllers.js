const User = require("../Models/user");
const userController = {};

userController.saveUser = async (userName, sid) => {
    // 이미 있는 유저인지 확인
    let user = await User.findOne({ name: userName });
    if (!user) {
        console.log('Creating new user'); // 새 유저 생성 로그
        user = new User({
            name: userName,
            token: sid,
            online: true,
        });
    } else {
        console.log('Updating existing user token'); // 기존 유저 토큰 업데이트 로그
    }

    // 유저 토큰 및 온라인 상태 업데이트
    user.token = sid;
    user.online = true;

    await user.save();
    console.log(`User saved: ${user.name} with token ${user.token}`);
    return user;
};

userController.checkUser = async (sid) => {
    const user = await User.findOne({ token: sid });
    if (!user) throw new Error("user not found");
    return user;
}

module.exports = userController;
