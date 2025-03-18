import { View, FlatList } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturedModel from "../../components/Home/AiFeaturedModel";
import AiModels from "../../components/Home/AiModels";
import AllUsersCreation from "../../components/Home/AllUsersCreation";

export default function Home() {
  return (
    <FlatList
      data={[1]}
      style={{
        padding: 20,
        marginTop: 20,
      }}
      nestedScrollEnabled={true}
      renderItem={({ item }) => (
        <View>
          {/* header  */}
          <Header />
          {/* Banner  */}
          <Banner />
          {/* Featured List  */}
          <AiFeaturedModel />
          {/* Ai Models (Avatar)  */}
          <AiModels type={"avatar"} />

          {/* Ai Models (Style)  */}
          <AiModels type={"style"} />

          {/* users Creation  */}
          <AllUsersCreation />

          <View style={{ height: 100 }}></View>
        </View>
      )}
    ></FlatList>
  );
}
