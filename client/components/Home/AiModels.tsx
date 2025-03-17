import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

export default function AiModels({ type }) {
  const [aiModelList, setAiModelList] = useState();
  useEffect(() => {
    GetAiModels();
  }, []);

  const GetAiModels = async () => {
    const result = await GlobalApi.GetAiModels(type);
    setAiModelList(result.data.data);
  };

  const OnClickModel = (item) => {
    router?.push({ pathname: "/FormInput", params: item });
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {type?.toUpperCase()}
      </Text>

      <FlatList
        data={aiModelList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => OnClickModel(item)}
            style={{
              marginRight: 15,
            }}
          >
            <Image
              source={{ uri: item?.banner?.url }}
              style={{
                width: 140,
                height: 180,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                position: "absolute",
                bottom: 10,
                color: Colors.WHITE,
                width: "100%",
                fontSize: 15,
                textAlign: "center",
                fontWeight: "medium",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
