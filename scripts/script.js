// Define default devices
const defaultDevices = [
  { name: "Refrigerator", points: 3 },
  { name: "Television", points: 2 },
  { name: "Ceiling Fan", points: 1 },
  { name: "Standing Fan", points: 1 },
  { name: "Gaming Console", points: 2 },
  { name: "Light Bulb", points: 1 },
  { name: "Blender", points: 2 },
  { name: "Electric Cooker", points: 4 },
  { name: "Iron", points: 3 },
];

// Load custom devices from localStorage or use empty array
let customDevices = JSON.parse(localStorage.getItem('customDevices')) || [];

// Combine custom devices first, then default devices
let devices = [...customDevices, ...defaultDevices];

const selectedDevices = [];

function renderDevices() {
  const deviceList = document.getElementById("deviceList");
  deviceList.innerHTML = "";
  devices.forEach((device, index) => {
    const button = document.createElement("button");
    button.className = "device-btn";
    
    // Create the button content div
    const buttonContent = document.createElement("div");
    buttonContent.className = "button-content";
    
    // Create the device text span
    const deviceText = document.createElement("span");
    deviceText.innerText = `${device.name} (${device.points} pts)`;
    
    // Create the remove icon (only for custom devices)
    const removeIcon = document.createElement("i");
    removeIcon.className = "fas fa-times remove-icon";
    // Only show remove icon for custom devices (which are at the start of the array)
    if (index < customDevices.length) {
      removeIcon.onclick = (e) => {
        e.stopPropagation(); // Prevent the button click event
        removeDevice(index);
      };
    } else {
      removeIcon.style.display = 'none';
    }
    
    // Append elements
    buttonContent.appendChild(deviceText);
    buttonContent.appendChild(removeIcon);
    button.appendChild(buttonContent);
    
    // Add click handler for selection
    button.onclick = () => toggleDevice(index, button);
    deviceList.appendChild(button);
  });
}

function toggleDevice(index, button) {
  const device = devices[index];
  const foundIndex = selectedDevices.findIndex((d) => d.name === device.name);
  if (foundIndex > -1) {
    selectedDevices.splice(foundIndex, 1);
    button.classList.remove("selected");
  } else {
    selectedDevices.push(device);
    button.classList.add("selected");
  }
  updateSelectedDevices();
}

function updateSelectedDevices() {
  const selectedDiv = document.getElementById("selectedDevices");
  selectedDiv.innerHTML = selectedDevices
    .map((d) => `<p>${d.name} - ${d.points} pts</p>`)
    .join("");
}

function calculateShare() {
  const totalPoints =
    parseFloat(document.getElementById("totalPoints").value) || 0;
  const totalBill = parseFloat(document.getElementById("totalBill").value) || 0;
  const userPoints = selectedDevices.reduce(
    (sum, device) => sum + device.points,
    0
  );
  const userShare =
    totalPoints > 0 ? ((userPoints / totalPoints) * totalBill).toFixed(2) : 0;
  document.getElementById("userShare").innerText = userShare;

  if (totalPoints == 0) {
    alert("Enter the total points");
  } else if (totalBill == 0) {
    alert("Enter the total Bill");
  } else if (userPoints == 0) {
    alert("Please Choose your devices");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const darkModeBtn = document.querySelector(".toggleDarkMode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
}

renderDevices();

const addDeviceBtn = document.getElementById("add-device-btn");
const formContainer = document.getElementById("form-container");
const saveDeviceBtn = document.getElementById("save-device-btn");
const cancelBtn = document.getElementById("cancel-btn");
const deviceNameInput = document.getElementById("device-name");
const devicePointsInput = document.getElementById("device-points");
const deviceList = document.getElementById("deviceList");

// Show the form to add a new device
addDeviceBtn.addEventListener("click", () => {
  formContainer.classList.remove("hidden");
});

// Save the new device to the array
saveDeviceBtn.addEventListener("click", () => {
  const deviceName = deviceNameInput.value.trim();
  const devicePoints = parseInt(devicePointsInput.value.trim(), 10);

  if (deviceName && !isNaN(devicePoints)) {
    // Add the new device to custom devices array
    const newDevice = { name: deviceName, points: devicePoints };
    customDevices.unshift(newDevice); // Add to the beginning of the array
    
    // Save custom devices to localStorage
    localStorage.setItem('customDevices', JSON.stringify(customDevices));
    
    // Update the combined devices array
    devices = [...customDevices, ...defaultDevices];

    // Re-render the entire device list to show the new device
    renderDevices();

    // Clear input fields and hide the form
    deviceNameInput.value = "";
    devicePointsInput.value = "";
    formContainer.classList.add("hidden");
  } else {
    alert("Please enter a valid device name and points.");
  }
});

// Cancel and hide the form without saving
cancelBtn.addEventListener("click", () => {
  deviceNameInput.value = "";
  devicePointsInput.value = "";
  formContainer.classList.add("hidden");
});

// Close the form if the user presses Enter
formContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveDeviceBtn.click();
  }
});

// Function to remove a specific device
function removeDevice(index) {
  // Only remove from custom devices (which are at the start of the array)
  if (index < customDevices.length) {
    customDevices.splice(index, 1);
    localStorage.setItem('customDevices', JSON.stringify(customDevices));
    devices = [...customDevices, ...defaultDevices];
    renderDevices();
    
    // Also remove from selected devices if it was selected
    const removedDevice = devices[index];
    const selectedIndex = selectedDevices.findIndex(d => d.name === removedDevice?.name);
    if (selectedIndex > -1) {
      selectedDevices.splice(selectedIndex, 1);
      updateSelectedDevices();
    }
  }
}

// Save input values to localStorage when they change
document.getElementById('totalPoints').addEventListener('input', function(e) {
  localStorage.setItem('totalPoints', e.target.value);
});

document.getElementById('totalBill').addEventListener('input', function(e) {
  localStorage.setItem('totalBill', e.target.value);
});

// Restore input values when page loads
window.addEventListener('load', function() {
  const savedPoints = localStorage.getItem('totalPoints');
  const savedBill = localStorage.getItem('totalBill');
  
  if (savedPoints) {
    document.getElementById('totalPoints').value = savedPoints;
  }
  if (savedBill) {
    document.getElementById('totalBill').value = savedBill;
  }
});

// Modify refresh button functionality
document.querySelector('.refresh').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default link behavior
  // Clear selected devices array
  selectedDevices.length = 0;
  // Update the selected devices display
  updateSelectedDevices();
  // Remove selected class from all device buttons
  document.querySelectorAll('.device-btn').forEach(button => {
    button.classList.remove('selected');
  });
  // Reset share display
  document.getElementById('userShare').textContent = '0.00';
});

// Add dropdown toggle functionality
const dropdownToggle = document.getElementById('dropdownToggle');

dropdownToggle.addEventListener('click', () => {
  deviceList.classList.toggle('active');
  dropdownToggle.classList.toggle('active');
});
