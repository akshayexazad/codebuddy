const User = require("../schema/user.schema");
const post = require('../schema/post.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
   const page = req.query.page;
   const limit = req.query.limit;

    const skip = (page - 1) * limit;
    const result = await User.find().limit(limit).skip(skip);

     let allUserData = []
    for(let i = 0;i<result.length;i++){
      const postCount = await post.find({userId:result[i]._id}).count();
      allUserData.push({
        id:result[i]._id,
        name:result[i].name,
        post:postCount
      });   
    }
    res.status(200).json({users:allUserData});
  } catch (error) {
    res.send({ error: error.message });
  }
};
