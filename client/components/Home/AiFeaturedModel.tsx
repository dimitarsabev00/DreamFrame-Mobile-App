import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

export default function AiFeaturedModel() {
  const [aiModelList, setAiModelList] = useState([]);
  useEffect(() => {
    GetAiModelFeaturedList();
  }, []);

  const GetAiModelFeaturedList = async () => {
    const result = await GlobalApi.GetFeaturedCategoryList();
    setAiModelList(result.data.data);
    console.log(aiModelList);
  };

  const OnClickAiModel = (item) => {
    router?.push({
      pathname: "FormInput",
      params: item,
    });
  };

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        FEATURED
      </Text>

      <FlatList
        data={aiModelList}
        numColumns={4}
        style={{ marginTop: 7 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => OnClickAiModel(item)}
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <View
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: Colors.LIGHT_GRAY,
              }}
            >
              <Image
                source={{ uri: item?.icon?.url }}
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                textAlign: "center",
                color: Colors.PRIMARY,
                marginTop: 2,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
