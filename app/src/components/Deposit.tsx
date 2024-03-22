import { Redirect } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import { ExternalLink } from "./ExternalLink";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

import { useCreateSolanaWallet, useSolanaWallet } from "../api/orders";
import { useAuth } from "../providers/AuthProvider";

export default function Deposit({ path }: { path: string }) {
  // example of an auth context consumer
  const { session, loading, profile } = useAuth();
  const { data: _getSolanaWallet } = useSolanaWallet();
  const { mutateAsync: _createSolanaWallet } = useCreateSolanaWallet();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  if (!session) {
    // doesnt feel right doing this everywhere
    return <Redirect href="/" />;
  }

  async function getOrCreateSolanaWallet() {
    try {
      let wallet = _getSolanaWallet({ userId: session?.user.id});
      if (!wallet){
      wallet = await _createSolanaWallet(
        { userId: session?.user.id ?? "" },
        {
          onSuccess: (data) => {
            setResponse(data);
            // store result
          },
        }
      );
      }
    } catch (err) {
      setError(err);
    }
  }

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Pressable onPress={() => getOrCreateSolanaWallet()}>
          <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
          >
            "create solana wallet"
          </Text>
        </Pressable>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
