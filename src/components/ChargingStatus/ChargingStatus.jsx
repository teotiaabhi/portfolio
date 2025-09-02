import { useEffect, useState } from "react";
import "./animation.css";
import styles from "./styles";

function ChargingStatus() {
  const [isCharging, setIsCharging] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);

  useEffect(() => {
    navigator.getBattery().then((battery) => {
      const updateChargingStatus = () => {
        setBatteryLevel(Math.floor(battery.level * 100));
        setIsCharging(battery.charging);

        if (battery.charging) {
          setShowAnimation(true);
          setTimeout(() => setShowAnimation(false), 3000);
        }
      };

      updateChargingStatus();
      battery.addEventListener("chargingchange", updateChargingStatus);
      battery.addEventListener("levelchange", () =>
        setBatteryLevel(Math.floor(battery.level * 100))
      );
    });
  }, []);

  return (
    <>
      {showAnimation && (
        <div style={styles.overlay}>
          <div className="ring-animation" style={styles.ring}>
            <div style={styles.innerContent}>
              <div style={styles.percentage}>{batteryLevel}%</div>
              <div style={styles.supervooc}>
                <span style={styles.bolt}>⚡</span> <b>ADMIN PANEL</b>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChargingStatus;
