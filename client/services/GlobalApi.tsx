import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://192.168.0.101:1337/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_STRAPI_API_KEY,
  },
});

const GetUserInfo = (email) =>
  axiosClient.get("user-lists?filters[userEmail][$eq]=" + email);

const CreateNewUser = (data) => axiosClient.post("/user-lists", { data: data });

const GetFeaturedCategoryList = () =>
  axiosClient.get("/ai-models?filters[isFeatured][$eq]=true&populate=*");

const GetAiModels = (type) =>
  axiosClient.get("/ai-models?filters[" + type + "][$eq]=true&populate=*");

const AIGenerateImage = (data) =>
  axios.post("http://192.168.0.101:8082/aimodel", data);

const UpdateUserCredits = (documentId, data) =>
  axiosClient.put("/user-lists/" + documentId, { data: data });

const AddAiImageRecord = (data) =>
  axiosClient.post("/ai-generated-images", { data: data });

export default {
  GetUserInfo,
  CreateNewUser,
  GetFeaturedCategoryList,
  GetAiModels,
  AIGenerateImage,
  UpdateUserCredits,
  AddAiImageRecord,
};
