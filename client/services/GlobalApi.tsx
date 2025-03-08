import axios from "axios";
const axiosClient = axios.create({
  // baseURL:'http://192.168.12.228:1337/api',
  baseURL: "https://localhost:1337/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_STRAPI_API_KEY_PROD,
  },
});

const GetUserInfo = (email: string) =>
  axiosClient.get("user-lists?filters[userEmail][$eq]=" + email);

const CreateNewUser = (data: any) =>
  axiosClient.post("/user-lists", { data: data });

export default {
  GetUserInfo,
  CreateNewUser,
};
