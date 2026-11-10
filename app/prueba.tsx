import { StyleSheet, Text, View } from "react-native";
import { Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";

type Rotation = {
  x: number;
  y: number;
  z: number;
};

export default function Prueba() {
  const [rotation, setRotation] = useState<Rotation>({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);

    const subscription = Gyroscope.addListener((data) => {
      setRotation(data);
    });

    return () => subscription.remove();
  }, []);

  const UMBRAL = 2.0; // rad/s

  const magnitud = Math.sqrt(
    rotation.x ** 2 +
    rotation.y ** 2 +
    rotation.z ** 2
  );

  const giroDetectado = magnitud > UMBRAL;

  const AxisCard = ({
    axis,
    value,
    color,
  }: {
    axis: string;
    value: number;
    color: string;
  }) => {
    const intensity = Math.min(Math.abs(value) / 3, 1);

    return (
      <View style={styles.card}>
        <Text style={styles.axis}>{axis}</Text>

        <Text style={styles.value}>
          {value.toFixed(2)} rad/s
        </Text>

        <View style={styles.track}>
          <View
            style={[
              styles.bar,
              {
                width: `${intensity * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Valores del Giroscopio
      </Text>

      <AxisCard axis="Eje X" value={rotation.x} color="#e74c3c" />
      <AxisCard axis="Eje Y" value={rotation.y} color="#2ecc71" />
      <AxisCard axis="Eje Z" value={rotation.z} color="#3498db" />

      <View
        style={[
          styles.alert,
          {
            backgroundColor: giroDetectado ? "#e74c3c" : "#2ecc71",
          },
        ]}
      >
        <Text style={styles.alertText}>
          {giroDetectado
            ? "¡Rotación Detectada!"
            : "Movimiento Normal"}
        </Text>
      </View>

      <Text style={styles.magnitude}>
        Magnitud: {magnitud.toFixed(2)} rad/s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2c3e50",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  axis: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },

  value: {
    fontSize: 16,
    marginVertical: 10,
    color: "#555",
  },

  track: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    borderRadius: 10,
  },

  alert: {
    width: "100%",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  alertText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },

  magnitude: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
  },
});
