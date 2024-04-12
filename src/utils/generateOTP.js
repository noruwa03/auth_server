const generateOTP = async () => {
  const result = Math.floor(1000 + Math.random() * 9000);
  return result.toString();
};

module.exports = generateOTP;
