const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  ring: {
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    border: "6px solid rgba(255,255,255,0.6)",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContent: {
    textAlign: "center",
    color: "#ffffff",
  },
  percentage: {
    fontSize: "3.5rem",
    fontWeight: "bold",
  },
  supervooc: {
    marginTop: "10px",
    fontSize: "1.2rem",
    letterSpacing: "2px",
  },
  bolt: {
    marginRight: "8px",
  },
};

export default styles;
