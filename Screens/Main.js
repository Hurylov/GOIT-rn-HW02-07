import RegistrationScreen from "../Screens/auth/RegistrationScreen";
import LoginScreen from "../Screens/auth/LoginScreen";
import Home from "../Screens/main/Home";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { updateUserStatus } from "../redux/auth/authOperations";
import { getIsLoggedIn } from "../redux/auth/authSelectors";
import MapScreen from "./nested/MapScreen";
import CommentsScreen from "./nested/CommentsScreen";
import Container from "toastify-react-native";

const AuthStack = createNativeStackNavigator();

export default function Main() {
  const isLogedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateUserStatus());
  }, [isLogedIn]);

  return (
    <NavigationContainer>
      <Container
        position="center"
        style={{
          borderRadius: 20,
          fontSize: 8,
          width: 350,
          height: 100,
        }}
        textStyle={{ fontSize: 8 }}
        duration={5000}
        animationStyle={"zoomInOut"}
      />
      <AuthStack.Navigator>
        {!isLogedIn ? (
          <>
            <AuthStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <AuthStack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="CommentsScreen"
              component={CommentsScreen}
              options={{
                title: "Комментарии",
                headerTitleAlign: "center",
              }}
            />
            <AuthStack.Screen
              name="MapScreen"
              component={MapScreen}
              options={{
                title: "Карта",
                headerTitleAlign: "center",
              }}
            />
          </>
        )}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}
