import { Text, StyleSheet, View, Button } from "react-native";
import React, { useState } from "react";
import CrudScreen from "./CrudScreen";
import GraphScreen from "./GraphScreen";
import LoginScreen from "./LoginScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import RegisterScreen from "./RegisterScreen";
import TransactionScreen from "./TransactionScreen";

export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

  switch (screen) {
    case "graph":
      return <GraphScreen />;
    case "crud":
      return <CrudScreen />;
    case "login":
      return <LoginScreen />;
    case "notifications":
      return <NotificationScreen />;
    case "profile":
      return <ProfileScreen />;
    case "register":
      return <RegisterScreen />;
    case "transaction":
      return <TransactionScreen />;
    case "menu":
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menú de Prácticas</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonSquare}>
              <Button
                title="Login"
                color="#9CE0DB"
                onPress={() => setScreen("login")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="Registro"
                color="#9CE0DB"
                onPress={() => setScreen("register")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="Graph"
                color="#9CE0DB"
                onPress={() => setScreen("graph")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="CRUD"
                color="#9CE0DB"
                onPress={() => setScreen("crud")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="Transacciones"
                color="#9CE0DB"
                onPress={() => setScreen("transaction")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="Notificaciones"
                color="#9CE0DB"
                onPress={() => setScreen("notifications")}
              />
            </View>
            <View style={styles.buttonSquare}>
              <Button
                title="Perfil"
                color="#9CE0DB"
                onPress={() => setScreen("profile")}
              />
            </View>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6F9",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B3A62",
    marginBottom: 25,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonSquare: {
    width: 180,
    height: 45,
    marginVertical: 6,
    borderRadius: 0,
    overflow: "hidden",
  },
});
