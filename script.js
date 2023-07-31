document.addEventListener("DOMContentLoaded", () => {
  let port, esptool;

  const terminal = document.getElementById("terminal");
  const portSelect = document.getElementById("port");
  const baudrateInput = document.getElementById("baudrate");
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");

  // Function to log messages to the terminal
  function logToTerminal(message) {
    terminal.value += message + "\n";
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Populate the port selection dropdown
  async function listSerialPorts() {
    try {
      const ports = await navigator.serial.getPorts();
      portSelect.innerHTML = "";
      ports.forEach((port) => {
        const option = document.createElement("option");
        option.value = port.path;
        option.text = port.path;
        portSelect.add(option);
      });
    } catch (err) {
      console.error("Error listing serial ports:", err);
    }
  }

  // Function to connect to the selected serial port
  async function connect() {
    try {
      const baudrate = parseInt(baudrateInput.value, 10);
      port = await navigator.serial.requestPort({ filters: [] });
      esptool = new EsptoolJs({ port, baudrate });
      logToTerminal("Connected to " + port.path + " at " + baudrate + " baud");
    } catch (err) {
      console.error("Error connecting to serial port:", err);
    }
  }

  // Function to disconnect from the serial port
  function disconnect() {
    if (port) {
      port.close();
      logToTerminal("Disconnected");
    }
  }

  // Event listener for the Connect button
  connectBtn.addEventListener("click", () => {
    connect();
  });

  // Event listener for the Disconnect button
  disconnectBtn.addEventListener("click", () => {
    disconnect();
  });

  // Event listener to automatically update the available serial ports
  navigator.serial.addEventListener("connect", () => {
    listSerialPorts();
  });

  // Event listener to automatically update the available serial ports
  navigator.serial.addEventListener("disconnect", () => {
    listSerialPorts();
  });

  // Automatically populate the available serial ports on page load
  listSerialPorts();
});
