import { View, FlatList } from "react-native";
import React, { useEffect } from "react";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturedModel from "../../components/Home/AiFeaturedModel";
import AiModels from "../../components/Home/AiModels";
import { useUser } from "@clerk/clerk-expo";
import { reloadAppAsync } from "expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const { user } = useUser();

  useEffect(() => {
    user && reloadAppAsync();
  }, [user]);

  return (
    <SafeAreaView>
      <FlatList
        data={[1]}
        style={{
          padding: 20,
        }}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <View>
            {/* Header  */}
            <Header />
            {/* Banner  */}
            <Banner />
            {/* Featured List  */}
            <AiFeaturedModel />
            {/* Ai Models (Avatar)  */}
            <AiModels type={"avatar"} />

            {/* Ai Models (Style)  */}
            <AiModels type={"style"} />

            <View style={{ height: 100 }}></View>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}
