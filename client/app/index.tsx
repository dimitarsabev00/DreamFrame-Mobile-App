import { Redirect, useRootNavigationState } from "expo-router";
import { Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
export default function Index() {
  const { user } = useUser();

  useEffect(() => {
    checkNavLoader();
  }, []);

  const checkNavLoader = () => {
    if (!useRootNavigationState.key) return null;
  };
  return (
    <View>
      {!user ? <Redirect href={"/login"} /> : <Text>Login Success!!</Text>}
    </View>
  );
}
