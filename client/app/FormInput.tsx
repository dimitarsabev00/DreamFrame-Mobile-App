import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Colors from "./../constants/Colors";
import TextInput_ from "./../components/FormInput/TextInput_";
import ImageUploadComponent from "./../components/FormInput/ImageUploadComponent";
import GlobalApi from "../services/GlobalApi";
import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { UserDetailContext } from "./../contexts/UserDetailContext";
export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState();
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState();

  const router = useRouter();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    console.log("Params:", params);
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name,
    });
  }, []);

  const OnGenerate = async () => {
    console.log("aiModel", aiModel);
    if (userDetail.credits <= 0) {
      ToastAndroid.show("You dont have enough credits", ToastAndroid.LONG);
      return;
    }

    if (
      !aiModel?.userImageUpload ||
      aiModel?.userImageUpload == "false" ||
      aiModel?.userImageUpload == false
    ) {
      TextToImage();
    } else {
      ImageToAiImage();
    }
  };

  const TextToImage = async () => {
    setLoading(true);
    const data = {
      aiModelName: aiModel?.aiModelName,
      inputPrompt: userInput,
      defaultPrompt: aiModel?.defaultPrompt,
    };

    console.log("-----", data);

    try {
      const result = await GlobalApi.AIGenerateImage(data);
      const AIImage = result.data.result[0]
        ? result.data.result[0]
        : result.data.result;
      console.log("Image", AIImage);

      // To Update User Credits
      UpdateUserCredits();

      UploadImageAndSave(AIImage);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const ImageToAiImage = async () => {
    setLoading(true);
    //Upload the Image to Cloudinary
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dm5wszfhq",
      },
      url: {
        secure: true,
      },
    });

    const options = {
      upload_preset: "uzasy1rr",
      unsigned: true,
    };

    await upload(cld, {
      file: userImage,
      options: options,
      callback: async (error, response) => {
        //.. handle response
        console.log(response?.url);
        //Generate AI Image
        const data = {
          defaultPrompt: aiModel?.defaultPrompt,
          userImageUrl: response?.url,
          aiModelName: aiModel?.aiModelName,
        };
        UpdateUserCredits();
        const result = await GlobalApi.AIGenerateImage(data);
        console.log("AI Image", result.data.result);
        const AIImage = result.data.result;
        router.push({
          pathname: "viewAiImage",
          params: {
            imageUrl: AIImage,
            prompt: aiModel?.name,
          },
        });
        setLoading(false);
      },
    });
  };

  const UploadImageAndSave = async (AIImage) => {
    //Upload the Image to Clodinary Storage
    //Upload the Image to Cloudinary
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dm5wszfhq",
      },
      url: {
        secure: true,
      },
    });

    const options = {
      upload_preset: "uzasy1rr",
      unsigned: true,
    };

    await upload(cld, {
      file: AIImage,
      options: options,
      callback: async (error, response) => {
        //.. handle response
        console.log(response?.url);
        // Save generated image URL
        const SaveImageData = {
          imageUrl: response?.url,
          userEmail: userDetail?.userEmail,
        };
        const SaveImageResult = await GlobalApi.AddAiImageRecord(SaveImageData);
        console.log(SaveImageResult.data.data);
        setLoading(false);
        router.replace({
          pathname: "viewAiImage",
          params: {
            imageUrl: AIImage,
            prompt: userInput,
          },
        });
      },
    });
  };

  const UpdateUserCredits = async () => {
    // To Update User Credits
    const updatedResult = await GlobalApi.UpdateUserCredits(
      userDetail?.documentId,
      { credits: Number(userDetail?.credits) - 1 }
    );

    setUserDetail(updatedResult?.data.data);
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {aiModel?.name}
      </Text>

      <View>
        {aiModel?.userImageUpload != "true" ? (
          <TextInput_
            userInputValue={(value) => {
              console.log(value);
              setUserInput(value);
            }}
          />
        ) : (
          <ImageUploadComponent
            uploadedImage={(value) => setUserImage(value)}
          />
        )}

        <Text
          style={{
            color: Colors.GRAY,
            marginVertical: 5,
          }}
        >
          NOTE: 1 Credit will use to generate AI Image
        </Text>

        <TouchableOpacity
          onPress={() => OnGenerate()}
          disabled={loading}
          style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 15,
            marginVertical: 15,
            width: "100%",
            marginVertical: 30,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: Colors.WHITE,
                fontSize: 20,
              }}
            >
              Generate
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
