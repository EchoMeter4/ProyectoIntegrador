import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


import GraphScreen from "../screens/GraphScreen";
import ListScreen from "../screens/TransactionScreen";
import PresupuestosScreen from "../screens/PresupuestosScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";


const MainStack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <MainStack.Navigator
            id="mainStack"
            initialRouteName="Dashboard"
            screenOptions={{headerShown: false}}
        >
            <MainStack.Screen
                name="Dashboard"
                component= {GraphScreen}
                options={{animation: 'none'}}
            />
            <MainStack.Screen
                name="Operaciones"
                component={ListScreen}
                options={{animation: 'none'}}
            />
            <MainStack.Screen
                name="Presupuestos"
                component={PresupuestosScreen}
                options={{animation: 'none'}}
            />
            <MainStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{animation: 'none'}}
            />
            <MainStack.Screen
                name="Notifications"
                component={NotificationScreen}
            />
        </MainStack.Navigator>
    )
}