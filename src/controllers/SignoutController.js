const signOutController = async (_, res) => {
  res.clearCookie("userData");
  res.status(200).json({ success: "Ok" });
};

module.exports = signOutController;
