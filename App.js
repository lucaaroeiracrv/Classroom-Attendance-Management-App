import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ClassScreen from "./src/screens/ClassScreen";
import AssuranceScreen from "./src/screens/AssuranceScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import ManageClassScreen from "./src/screens/ManageClassScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ClassScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Classes":
              iconName = "school-outline";
              break;
            case "Chamada de aluno":
              iconName = "checkbox-outline";
              break;
            case "Estatistica":
              iconName = "stats-chart-outline";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Classes"
        component={ClassScreen}
        options={{ tabBarLabel: "Classes" }}
      />
      <Tab.Screen
        name="Chamada de aluno"
        component={AssuranceScreen}
        options={{ tabBarLabel: "Chamada" }}
      />
      <Tab.Screen
        name="Estatistica"
        component={StatisticsScreen}
        options={{ tabBarLabel: "Estatísticas" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ManageClass" component={ManageClassScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
