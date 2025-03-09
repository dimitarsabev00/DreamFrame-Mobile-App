import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import Colors from "../../constants/Colors";

export default function AiModels({ type }) {
  const [aiModelList, setAiModelList] = useState();
  useEffect(() => {
    GetAiModels();
  }, []);

  const GetAiModels = async () => {
    const result = await GlobalApi.GetAiModels(type);
    setAiModelList(result.data.data);
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
            onPress={() => {}}
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
