const localDevConfig = {
  port: 3001,
  hmr: 3001,
  clientPort: 3001,
  apiEndPoint: "http://localhost:3000",
};

const cloudDevConfig = {
  port: 8082,
  hmr: 443,
  clientPort: 443,
  apiEndPoint: "",
};

export default cloudDevConfig;
