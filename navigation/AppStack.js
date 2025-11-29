import React, {useState} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


import GraphScreen from "../screens/GraphScreen";
import ListScreen from "../screens/TransactionScreen";
import ProfileScreen from "../screens/ProfileScreen";


import Navbar from "../components/Navbar";
import CrudModal from "../screens/CrudModal";

const MainStack = createNativeStackNavigator();

export default function AppStack({currentRoute}) {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);

    return (
        <>
            <MainStack.Navigator
                id="mainStack"
                initialRouteName="Graph"
                screenOptions={{headerShown: false}}
            >
                <MainStack.Screen
                    name="Graph"
                    component={GraphScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name="List"
                    component={ListScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    
                    options={{animation: 'none'}} 
                />
            </MainStack.Navigator>

            
            <Navbar toggleModal={toggleModal}/>
            <CrudModal visible={showModal} setVisible={setShowModal}/>
        </>
    )
}