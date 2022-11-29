import React, { useEffect } from "react";
import { MainNavigator } from "./src/screens/MainNavigator";
import { View, Text, ActivityIndicator } from "react-native";
import { useConnection } from "./src/hooks/useConnection";
import { ErrorMessage } from "./src/components/ErrorMessage";
import { defaultStyles } from "./src/styles/defaultStyles";
import * as SecureStore from "expo-secure-store";
import config from "./config.json";
import Meteor from "@meteorrn/core";

export default function App() {
  const { connected, connectionError } = useConnection();

  useEffect(() => {
    // connect with Meteor and use a secure store
    // to persist our received login token, so it's encrypted
    // and only readable for this very app
    // read more at: https://docs.expo.dev/versions/latest/sdk/securestore/
    if (!connected)
      Meteor.connect(config.backend.url, {
        AsyncStorage: {
          getItem: SecureStore.getItemAsync,
          setItem: SecureStore.setItemAsync,
          removeItem: SecureStore.deleteItemAsync,
        },
      });
  }, [connected]);

  // use splashscreen here, if you like
  if (!connected) {
    return (
      <View style={defaultStyles.container}>
        <ActivityIndicator />
        <Text>Connecting to our servers...</Text>
      </View>
    );
  }

  // use alert or other things here, if you like
  if (connectionError) {
    return <ErrorMessage error={connectionError} />;
  }

  return <MainNavigator />;
}
