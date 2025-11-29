import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";

const StackNavigator = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <>
            <StackNavigator.Navigator
                id="mainStack"
                initialRouteName="Login"
                screenOptions={{headerShown: false}}
            >
                <StackNavigator.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{animation: "none"}}
                />
                <StackNavigator.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{animation: "none"}}
                />
            </StackNavigator.Navigator>
        </>
    )
}