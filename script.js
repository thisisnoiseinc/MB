document.addEventListener("DOMContentLoaded", () => {
  let port, esptool;

  const terminal = document.getElementById("terminal");
  const portSelect = document.getElementById("port");
  const firmwareInput = document.getElementById("firmware");
  const flashBtn = document.getElementById("flashBtn");

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

  // Function to flash firmware to the selected serial port
  async function flashFirmware() {
    try {
      const file = firmwareInput.files[0];
      if (!file) {
        logToTerminal("Please select a firmware file");
        return;
      }
      const baudrate = 115200; // Set the baud rate here

      port = await navigator.serial.requestPort({ filters: [] });
      await port.open({ baudRate: baudrate });
      esptool = new EsptoolJs({ port });

      logToTerminal("Flashing firmware...");

      const response = await esptool.run({ image: file });
      logToTerminal(response.stdout);

      await port.close();
      logToTerminal("Firmware flashing completed.");
    } catch (err) {
      console.error("Error flashing firmware:", err);
    }
  }

  // Event listener for the Flash Firmware button
  flashBtn.addEventListener("click", () => {
    flashFirmware();
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
