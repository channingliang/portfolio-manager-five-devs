const { StatusCodes } = require("http-status-codes");

const getUserInfo = () => {
    // Simulate fetching user info
    return {
        id: 1,
        name: "John Doe",
        email: "aaaaa"
    }
}

const info = (req, res) => {
  const service = getUserInfo();

  console.log(service)

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "API is live",
    error: {},
    data: {},
  });
};

module.exports = {
  info,
};
