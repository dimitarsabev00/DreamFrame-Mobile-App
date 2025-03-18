import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import TextInput_ from "./../components/FormInput/TextInput_";
import ImageUploadComponent from "./../components/FormInput/ImageUploadComponent";
import Colors from "@/constants/Colors";
import GlobalApi from "@/services/GlobalApi";
import { UserDetailContext } from "@/contexts/UserDetailContext";

export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState();
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [loading, setLoading] = useState(false);

  const [generatedImage, setGeneratedImage] = useState();

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
    setLoading(true);

    const data = {
      aiModelName: aiModel?.aiModelName,
      inputPrompt: userInput,
      defaultPrompt: aiModel?.defaultPrompt,
    };

    try {
      const result = await GlobalApi.AIGenerateImage(data);
      const AIImage = result.data.result;
      console.log("AI Image", result.data.result);

      // To Update User Credits
      const updatedResult = await GlobalApi.UpdateUserCredits(
        userDetail?.documentId,
        { credits: Number(userDetail?.credits) - 1 }
      );

      setUserDetail(updatedResult?.data.data);

      // Save generated image URL

      const SaveImageData = {
        imageUrl: AIImage,
        userEmail: userDetail?.userEmail,
      };

      const SaveImageResult = await GlobalApi.AddAiImageRecord(SaveImageData);
      console.log(SaveImageResult.data.data);
      router.replace({
        pathname: "viewAiImage",
        params: {
          imageUrl: AIImage,
          prompt: userInput,
        },
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);

      console.log(e);
    }
    setLoading(false);
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
