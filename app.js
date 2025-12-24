let webcamStream = null;

// Show Sign Up form and hide Sign In form
function showSignup() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('signup-section').style.display = 'block';
}

// Show Sign In form and hide Sign Up form
function showLogin() {
  document.getElementById('signup-section').style.display = 'none';
  document.getElementById('auth-section').style.display = 'block';
}

// Sign Up function saves user to localStorage
function signUp() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const language = document.getElementById('language').value;
  const area = document.getElementById('area').value.trim();

  if (!name || !email || !password || !language || !area) {
    alert(translations["en"]["Please fill all required fields"]);
    return;
  }

  const user = { name, email, password, language, area };
  localStorage.setItem('user', JSON.stringify(user));

  alert(translations[language]["Sign Up successful! Please login now."]);
  showLogin();
}

// Sign In function validates credentials from localStorage
function signIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    sessionStorage.setItem("loggedIn", "true");
    loadDashboard();
  } else {
    alert(translations["en"]["Invalid credentials"]);
  }
}

// Load dashboard after login
function loadDashboard() {
  if (!sessionStorage.getItem("loggedIn")) return;

  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("welcomeText").innerText = `${translations[user.language]["Welcome,"]} ${user.name}!`;

  applyTranslation(user.language);

  stopWebcam();
  clearOutput();
}

// Logout function clears session and reloads
function logout() {
  sessionStorage.removeItem("loggedIn");
  stopWebcam();
  location.reload();
}

// Open webcam and show capture button
function openWebcam() {
  clearOutput();
  stopWebcam();
  const video = document.getElementById("webcam");
  video.style.display = "block";

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      webcamStream = stream;
      video.srcObject = stream;
      showCaptureButton();
    })
    .catch(() => alert("Camera access denied"));
}

// Show Capture button under webcam
function showCaptureButton() {
  const outputDiv = document.getElementById("output");
  const user = JSON.parse(localStorage.getItem("user"));
  outputDiv.innerHTML = `<button id="captureBtn">${translations[user.language]["Capture Photo"]}</button>`;
  document.getElementById("captureBtn").onclick = capturePhoto;
}

// Capture photo from webcam and simulate disease detection
function capturePhoto() {
  const video = document.getElementById("webcam");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const user = JSON.parse(localStorage.getItem("user"));
  const diseases = [
    { name: translations[user.language]["Blight"], solution: translations[user.language]["Apply fungicide spray immediately."] },
    { name: translations[user.language]["Rust"], solution: translations[user.language]["Use resistant varieties and fungicides."] },
    { name: translations[user.language]["Healthy"], solution: translations[user.language]["No disease detected. Keep monitoring."] }
  ];
  const detected = diseases[Math.floor(Math.random() * diseases.length)];

  stopWebcam();

  document.getElementById("webcam").style.display = "none";
  document.getElementById("output").innerHTML = `
    <h4>${translations[user.language]["Crop Scanner"]} ${translations[user.language]["Result"] || "Result"}</h4>
    <img src="${canvas.toDataURL()}" alt="Captured Photo" style="width:100%; border:1px solid #ccc;"/>
    <p><strong>${translations[user.language]["Disease Detected"]}:</strong> ${detected.name}</p>
    <p><strong>${translations[user.language]["Solution"]}:</strong> ${detected.solution}</p>
  `;
}

// Stop webcam stream
function stopWebcam() {
  const video = document.getElementById("webcam");
  video.style.display = "none";
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  clearOutput();
}

// Clear output div content
function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

// Show weather alert with season and cyclone info
function getWeather() {
  stopWebcam();
  clearOutput();

  const user = JSON.parse(localStorage.getItem("user"));
  const defaultTemp = 34;
  const defaultSeason = getSeason();
  const cycloneAlert = translations[user.language]["⚠ Heavy Rain & Cyclone Warning"];

  document.getElementById("output").innerHTML = `
    <h4>${translations[user.language]["Weather Alert"]}</h4>
    <p><strong>${translations[user.language]["Temperature"]}:</strong> ${defaultTemp}°C</p>
    <p><strong>${translations[user.language]["Season"]}:</strong> ${translations[user.language][defaultSeason] || defaultSeason}</p>
    <p><strong>${translations[user.language]["Cyclone Alert"]}:</strong> ${cycloneAlert}</p>
  `;
}

// Helper to determine season based on month
function getSeason() {
  const month = new Date().getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "Summer";
  if ([6, 7, 8].includes(month)) return "Rainy";
  if ([9, 10, 11].includes(month)) return "Autumn";
  return "Winter";
}

// Show Farmer Schemes links
function openSchemes() {
  stopWebcam();
  clearOutput();

  const user = JSON.parse(localStorage.getItem("user"));
  const schemesList = `
    <h4>${translations[user.language]["Farmer Schemes"]}</h4>
    <ul>
      <li><a href="https://pmkisan.gov.in" target="_blank">PM Kisan Scheme</a></li>
      <li><a href="https://rythubandhu.telangana.gov.in/" target="_blank">Rythu Bandhu (Telangana)</a></li>
      <li><a href="https://ysrrythubharosa.ap.gov.in/" target="_blank">YSR Rythu Bharosa (Andhra Pradesh)</a></li>
      <li><a href="https://www.tn.gov.in/scheme" target="_blank">Tamil Nadu Farmer Schemes</a></li>
      <li><a href="https://agricoop.nic.in/" target="_blank">Agriculture Ministry</a></li>
    </ul>
  `;
  document.getElementById("output").innerHTML = schemesList;
}

// Show Volunteer info
function showVolunteers() {
  stopWebcam();
  clearOutput();

  const user = JSON.parse(localStorage.getItem("user"));
  const volunteerHTML = `
    <h4>${translations[user.language]["Volunteer Info"]}</h4>
    <ul>
      <li>Ravi - 9876543210</li>
      <li>Sita - 8765432109</li>
      <li>Kumar - 7654321098</li>
    </ul>
  `;
  document.getElementById("output").innerHTML = volunteerHTML;
}

// Open Google Maps for plant medicine stores based on user's area
function openMedicine() {
  stopWebcam();

  const user = JSON.parse(localStorage.getItem("user"));
  const area = encodeURIComponent(user.area);
  const url = `https://www.google.com/maps/search/plant+medicine+store+in+${area}`;
  window.open(url, "_blank");
}

// Show Help Desk toll-free number
function showHelpDesk() {
  stopWebcam();
  clearOutput();

  const user = JSON.parse(localStorage.getItem("user"));
  const helpDeskHTML = `
    <h4>${translations[user.language]["Help Desk"]}</h4>
    <p>${translations[user.language]["Toll-Free Number"]}: 1800-180-1551</p>
  `;
  document.getElementById("output").innerHTML = helpDeskHTML;
}

// Translation map
const translations = {
  en: {
    "Welcome,": "Welcome,",
    "Crop Scanner": "Crop Scanner",
    "Capture Photo": "Capture Photo",
    "Disease Detected": "Disease Detected",
    "Solution": "Solution",
    "Blight": "Blight",
    "Rust": "Rust",
    "Healthy": "Healthy",
    "Apply fungicide spray immediately.": "Apply fungicide spray immediately.",
    "Use resistant varieties and fungicides.": "Use resistant varieties and fungicides.",
    "No disease detected. Keep monitoring.": "No disease detected. Keep monitoring.",
    "Weather Alert": "Weather Alert",
    "Temperature": "Temperature",
    "Season": "Season",
    "Summer": "Summer",
    "Rainy": "Rainy",
    "Autumn": "Autumn",
    "Winter": "Winter",
    "Cyclone Alert": "Cyclone Alert",
    "⚠ Heavy Rain & Cyclone Warning": "⚠ Heavy Rain & Cyclone Warning",
    "Farmer Schemes": "Farmer Schemes",
    "Volunteer Info": "Volunteer Info",
    "Plant Medicine": "Plant Medicine",
    "Help Desk": "Help Desk",
    "Toll-Free Number": "Toll-Free Number",
    "Logout": "Logout",
    "Invalid credentials": "Invalid credentials",
    "Please fill all required fields": "Please fill all required fields",
    "Sign Up successful! Please login now.": "Sign Up successful! Please login now."
  },
  hi: {
    "Welcome,": "स्वागत है,",
    "Crop Scanner": "फसल स्कैनर",
    "Capture Photo": "फोटो लें",
    "Disease Detected": "बीमारी पाई गई",
    "Solution": "समाधान",
    "Blight": "ब्लाइट",
    "Rust": "रस्ट",
    "Healthy": "स्वस्थ",
    "Apply fungicide spray immediately.": "तुरंत फफूंदनाशक स्प्रे करें।",
    "Use resistant varieties and fungicides.": "प्रतिरोधी किस्में और फफूंदनाशक उपयोग करें।",
    "No disease detected. Keep monitoring.": "कोई बीमारी नहीं मिली। निगरानी जारी रखें।",
    "Weather Alert": "मौसम अलर्ट",
    "Temperature": "तापमान",
    "Season": "मौसम",
    "Summer": "ग्रीष्म",
    "Rainy": "बरसात",
    "Autumn": "पतझड़",
    "Winter": "सर्दी",
    "Cyclone Alert": "चक्रवात अलर्ट",
    "⚠ Heavy Rain & Cyclone Warning": "⚠ भारी बारिश और चक्रवात की चेतावनी",
    "Farmer Schemes": "किसान योजनाएं",
    "Volunteer Info": "स्वयंसेवक जानकारी",
    "Plant Medicine": "पौधे की दवाएं",
    "Help Desk": "हेल्प डेस्क",
    "Toll-Free Number": "टोल-फ्री नंबर",
    "Logout": "लॉगआउट",
    "Invalid credentials": "अमान्य प्रमाण-पत्र",
    "Please fill all required fields": "कृपया सभी आवश्यक फ़ील्ड भरें",
    "Sign Up successful! Please login now.": "साइन अप सफल! कृपया अब लॉगिन करें।"
  },
  te: {
    "Welcome,": "స్వాగతం,",
    "Crop Scanner": "పంట స్కానర్",
    "Capture Photo": "ఫోటో తీయండి",
    "Disease Detected": "రోగం గుర్తింపు",
    "Solution": "పరిష్కారం",
    "Blight": "బ్లైట్",
    "Rust": "రస్ట్",
    "Healthy": "ఆరోగ్యవంతమైనది",
    "Apply fungicide spray immediately.": "తక్షణమే ఫంగిసైడ్ స్ప్రే చేయండి.",
    "Use resistant varieties and fungicides.": "ప్రతిరోధక వేరియంట్లు మరియు ఫంగిసైడ్లు ఉపయోగించండి.",
    "No disease detected. Keep monitoring.": "ఏ రోగం కనబడలేదు. నిరంతరం పర్యవేక్షించండి.",
    "Weather Alert": "వాతావరణ హెచ్చరిక",
    "Temperature": "తాపన",
    "Season": "కాలం",
    "Summer": "గ్రీష్మం",
    "Rainy": "మర్షం",
    "Autumn": "శరదృతువు",
    "Winter": "చలికాలం",
    "Cyclone Alert": "సైక్లోన్ హెచ్చరిక",
    "⚠ Heavy Rain & Cyclone Warning": "⚠ భారీ వర్షం & సైక్లోన్ హెచ్చరిక",
    "Farmer Schemes": "రైతు పథకాలు",
    "Volunteer Info": "స్వయంసేవక వివరాలు",
    "Plant Medicine": "సస్య మందులు",
    "Help Desk": "హెల్ప్ డెస్క్",
    "Toll-Free Number": "టోల్-ఫ్రీ నంబర్",
    "Logout": "లాగౌట్",
    "Invalid credentials": "చెల్లని ప్రమాణాలు",
    "Please fill all required fields": "దయచేసి అన్ని అవసరమైన వివరాలు నింపండి",
    "Sign Up successful! Please login now.": "సైన్ అప్ విజయవంతం! దయచేసి ఇప్పుడు లాగిన్ చేయండి."
  }
};
