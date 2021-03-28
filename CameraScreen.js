import React from "react";
import { Button, View } from "react-native";

const CameraScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to profile screen"
        onPress={() => navigation.navigate("Item", { name: "Apple" })}
      />
    </View>
  );
};

export default CameraScreen;
