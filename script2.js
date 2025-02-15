document.addEventListener("DOMContentLoaded", function () {
    const totalMedalsEl = document.getElementById("totalMedals");
    const deedsListEl = document.getElementById("deedsList");
    const storiesContainer = document.getElementById("storiesContainer");
  
    // Retrieve deeds from localStorage
    let deeds = JSON.parse(localStorage.getItem("kindnessDeeds")) || [];
  
    // Calculate total medals (sum medals from each deed)
    let totalMedals = deeds.reduce((sum, deed) => sum + (deed.medals || 0), 0);
    totalMedalsEl.innerText = totalMedals;
  
    // Display deeds with dislike buttons
    deedsListEl.innerHTML = "";
    if (deeds.length === 0) {
      deedsListEl.innerHTML = "<p>No deeds completed yet! 🌱</p>";
    } else {
      deeds.forEach((deed, index) => {
        let deedDiv = document.createElement("div");
        deedDiv.classList.add("deed");
        deedDiv.innerHTML = `
          <p>
            <strong>${index + 1}.</strong> ${deed.task} - Medals: ${deed.medals} | 👎 Votes: <span id="vote-${index}">${deed.votes || 0}</span>
            <button class="dislike-btn" data-index="${index}">&#128078;</button>
          </p>
        `;
        deedsListEl.appendChild(deedDiv);
      });
    }
  
    // Add event listeners to dislike buttons
    const dislikeButtons = document.querySelectorAll(".dislike-btn");
    dislikeButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        let index = parseInt(this.getAttribute("data-index"));
        downvoteDeed(index);
      });
    });
  
    // Function to handle downvote
    function downvoteDeed(index) {
      deeds = JSON.parse(localStorage.getItem("kindnessDeeds")) || [];
      if (deeds[index]) {
        deeds[index].votes = (deeds[index].votes || 0) + 1;
        // Optional: if votes reach 3, decrease medals by 1
        if (deeds[index].votes >= 3 && deeds[index].medals > 0) {
          deeds[index].medals--;
        }
        localStorage.setItem("kindnessDeeds", JSON.stringify(deeds));
        // Update the displayed vote count for this deed
        document.getElementById(`vote-${index}`).innerText = deeds[index].votes;
        // Update overall total medals
        updateTotalMedals();
      }
    }
  
    // Update total medals displayed
    function updateTotalMedals() {
      deeds = JSON.parse(localStorage.getItem("kindnessDeeds")) || [];
      totalMedals = deeds.reduce((sum, deed) => sum + (deed.medals || 0), 0);
      totalMedalsEl.innerText = totalMedals;
    }
  
    // Display stories as a simple carousel that auto-rotates
    let images = [];
    deeds.forEach(deed => {
      if (deed.images && deed.images.length > 0) {
        images = images.concat(deed.images);
      }
    });
  
    if (images.length === 0) {
      storiesContainer.innerHTML = "<p>No images uploaded yet! 📷</p>";
    } else {
      let storyIndex = 0;
      let storyImg = document.createElement("img");
      storyImg.classList.add("story-image");
      storiesContainer.appendChild(storyImg);
  
      function showStory() {
        storyImg.src = images[storyIndex];
        storyIndex = (storyIndex + 1) % images.length;
      }
      showStory();
      setInterval(showStory, 3000); // Change story every 3 seconds

    }
    //localStorage.clear()
    //location.reload()
  });
  