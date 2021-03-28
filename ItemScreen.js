import React from "react";
import { View, Text } from "react-native";

const ItemScreen = ({ navigation, route }) => {
  const { name } = route.params;
  return (
    <View>
      <Text>This is an {name}</Text>
    </View>
  );
};

export default ItemScreen;
