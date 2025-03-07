import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "./../../constants/Colors";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export default function LoginScreen() {
  useWarmUpBrowser();
  const { signOut } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  //On Sign In / Continue Button Press Handler
  const onPress = React.useCallback(async () => {
    signOut();
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", {
            scheme: "dreamFrame-mobile-app",
          }),
        });

      if (createdSessionId) {
        console.log("CREATED SESSION ID:", createdSessionId);
        router.replace("../(tabs)/home");
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View>
      <Image
        source={require("./../../assets/images/login.jpeg")}
        style={{
          width: "100%",
          height: 600,
        }}
      />

      <View style={styles.loginContainer}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Welcome to DreamFrame
        </Text>

        <Text
          style={{
            color: Colors.GRAY,
            textAlign: "center",
            marginTop: 15,
          }}
        >
          Create AI Art in Just on Click
        </Text>

        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 17,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: Colors.GRAY,
          }}
        >
          By Continuing you agree to ours terms and conditions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "white",
    height: 600,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  button: {
    width: "100%",
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 20,
  },
});

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
