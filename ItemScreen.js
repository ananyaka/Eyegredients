import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View, Button } from "react-native";
import Constants from "expo-constants";
import { Table, Row, Rows } from "react-native-table-component";
import * as Speech from "expo-speech";

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#619cfa",
  },
  baseText: {
    width: "100%",
    textAlign: "center",
    fontFamily: "Roboto",
    marginBottom: 12,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  logo: {
    width: 66,
    height: 58,
  },
  tableText: {
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  headText: {
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  ingredientText: {
    marginTop: 8,
    fontFamily: "Roboto",
  },
});

const tableHead = ["Nutrient", "Amount per 100g"];

const ItemScreen = ({ navigation, route }) => {
  const { barcodeNumber } = route.params;
  console.log(barcodeNumber);
  const [chompResponse, setChompResponse] = useState();
  const [tableData, setTableData] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [spokenOnce, setSpokenOnce] = useState(false);
  const getArticlesFromApi = async () => {
    let response = await fetch(
      `https://chompthis.com/api/v2/food/branded/barcode.php?api_key=${Constants.manifest.extra.chompApiKey}&code=${barcodeNumber}`
    );
    let json = await response.json();
    console.log(json);
    const nutrientData = [];
    json.items[0].nutrients.map((nutrient) => {
      if (nutrient.per_100g > 0) {
        const row = [
          nutrient.name,
          `${nutrient.per_100g}  ${nutrient.measurement_unit}`,
        ];
        nutrientData.push(row);
      }
    });
    setIngredients(json.items[0].ingredient_list.join(", "));
    setAllergens(json.items[0].allergens.join(", "));
    setTableData(nutrientData);
    setChompResponse(json);
  };

  const speak = () => {
      const thingToSay = chompResponse.items[0].name + ". The nutrients per 100gm are:" + tableData + ". Ingredients: " + ingredients +  ". Allergens " + allergens;
      if(!spokenOnce) {
      Speech.speak(thingToSay, {language: 'en-US', rate: 0.75, onLooping: false});
      }
      setSpokenOnce(true);
    };

  useEffect(() => {
    if (chompResponse) {
      speak()
    }
  }, [chompResponse])

  useEffect(() => {
    if (barcodeNumber) {
      getArticlesFromApi();
    }
  }, [route, barcodeNumber]);

  if (chompResponse)
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.baseText}>
          <Text
            style={styles.titleText}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {chompResponse.items[0].name}
          </Text>
        </Text>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
            widthArr={[250, 124]}
          />
          <Rows
            data={tableData}
            textStyle={styles.tableText}
            style={styles.tableText}
            widthArr={[250, 124]}
          />
        </Table>
        <Text style={styles.ingredientText}>
          {`Ingredients: ${ingredients}`}
        </Text>
        <Text style={styles.ingredientText}>{`Allergens: ${allergens}`}</Text>
      </ScrollView>
    );
  else return null;
};

export default ItemScreen;
