import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Start building your React Native app with Expo
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Edit app/index.tsx to customize this screen 🚀
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // dark navy
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardText: {
    color: "#e2e8f0",
    fontSize: 14,
    textAlign: "center",
  },
});
