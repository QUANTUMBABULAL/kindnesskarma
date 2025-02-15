document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const doneBtn = document.getElementById("doneBtn");
    const imageUpload = document.getElementById("imageUpload");
    const uploadBtn = document.getElementById("uploadBtn");
  
    const kindnessPrompts = [
      "Give a compliment to someone today! 😊",
      "Help a friend with a task they are struggling with! 💪",
      "Donate old clothes to charity! 🧥",
      "Write a kind note for a family member! ✍️",
      "Hold the door open for someone! 🚪",
      "Call a loved one and check on them! 📞",
      "Smile at a stranger and make their day! 😃",
      "Pick up litter and keep the environment clean! 🌍",
      "Leave a positive review for a small business! ⭐",
      "Share an inspirational quote with a friend! 📝"
    ];
  
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") sendMessage();
    });
    doneBtn.addEventListener("click", function () {
      saveDeed();
      updateStreak();
      showCongratulations();
    });
    imageUpload.addEventListener("change", uploadImage);
    uploadBtn.addEventListener("click", uploadImage);
  
    function sendMessage() {
      let userText = userInput.value.trim();
      if (userText === "") return;
  
      addMessage(userText, "user");
      userInput.value = "";
      sendBtn.disabled = true;
  
      let randomPrompt = kindnessPrompts[Math.floor(Math.random() * kindnessPrompts.length)];
      setTimeout(() => {
        addMessage(randomPrompt, "bot");
        sendBtn.disabled = false;
      }, 1000);
    }
  
    function addMessage(text, sender) {
      let msgDiv = document.createElement("div");
      msgDiv.classList.add(sender);
      msgDiv.innerText = text;
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    function saveDeed() {
      let kindnessTask = chatBox.lastElementChild?.innerText;
      if (!kindnessTask) {
        alert("No kindness task found!");
        return;
      }
      let deeds = JSON.parse(localStorage.getItem("kindnessDeeds")) || [];
      deeds.push({ task: kindnessTask, medals: 1, votes: 0, images: [] });
      localStorage.setItem("kindnessDeeds", JSON.stringify(deeds));
    }
  
    function showCongratulations() {
      let existingPopup = document.getElementById("congratsPopup");
      if (existingPopup) existingPopup.remove();
  
      let popup = document.createElement("div");
      popup.id = "congratsPopup";
      popup.innerHTML = `
        <div class="congrats-content">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You completed today's kindness task! Keep spreading positivity ❤️</p>
        </div>
      `;
      document.body.appendChild(popup);
      popup.style.display = "block";
  
      setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 500);
      }, 3000);
    }
  
    function uploadImage() {
      const file = imageUpload.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function (e) {
        let deeds = JSON.parse(localStorage.getItem("kindnessDeeds")) || [];
        if (deeds.length === 0) {
          alert("No deeds found to attach an image!");
          return;
        }
        deeds[deeds.length - 1].images.push(e.target.result);
        localStorage.setItem("kindnessDeeds", JSON.stringify(deeds));
        alert("Image uploaded successfully! 🎉");
      };
      reader.readAsDataURL(file);
    }
  
    function updateStreak() {
      const streakEl = document.getElementById("streakCount");
      let today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      let lastDate = localStorage.getItem("lastDeedDate");
      let streakCount = parseInt(localStorage.getItem("streakCount") || "0");
  
      if (lastDate === today) {
        // Already completed deed today; do nothing.
      } else {
        if (lastDate) {
          let last = new Date(lastDate);
          let current = new Date(today);
          let diffTime = current - last;
          let diffDays = diffTime / (1000 * 60 * 60 * 24);
          // If last deed was yesterday, increment streak; otherwise, reset to 1.
          if (diffDays >= 1 && diffDays < 2) {
            streakCount++;
          } else {
            streakCount = 1;
          }
        } else {
          streakCount = 1;
        }
        localStorage.setItem("streakCount", streakCount);
        localStorage.setItem("lastDeedDate", today);
      }
      streakEl.innerText = streakCount;
    }
  });
  