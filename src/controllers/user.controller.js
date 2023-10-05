const User = require("../schema/user.schema");
const post = require("../schema/post.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const result = await User.find().limit(limit).skip(skip);
    const total_user = await User.find();

    let allUserData = [];
    for (let i = 0; i < result.length; i++) {
      const postCount = await post.find({ userId: result[i]._id }).count();
      allUserData.push({
        _id: result[i]._id,
        name: result[i].name,
        posts: postCount,
      });
    };

    const totalDocs = total_user.length;
    const totalpage = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalpage ? true : false;
    const pagination = {
      totalDocs: 100,
      limit: limit,
      page: page,
      totalPages: totalpage,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };

    res.status(200).json({ data: { users: allUserData, pagination } });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
};
