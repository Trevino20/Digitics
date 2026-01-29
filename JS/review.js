
        // const reviewData = [
        //     {
        //         name: "ADVAIT THANEKAR",
        //         stars: "THANEKAR GROUP",
        //         text: "Digitics really understands real estate and today’s buyers....",
        //         metric: "⭐⭐⭐⭐⭐",
        //         img: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?q=80&w=1259&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        //     },
        //     {
        //         name: "NISHANT DARGAR",
        //         stars: "METRO GROUP",
        //         text: "Digitics has been a key growth partner for our real estate brand...",
        //         metric: "⭐⭐⭐⭐⭐",
        //         img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        //     },
        //     {
        //         name: "Emily Carter",
        //         stars: "Thanker Group",
        //         text: "Excellent communication and on-time delivery. The design quality was top-notch!",
        //         metric: "⭐⭐⭐⭐⭐",
        //         img: "https://images.unsplash.com/photo-1691679769924-4430510fbc4f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        //     },
        //     {
        //         name: "David Nguyen",
        //         stars: "Mohan Group",
        //         text: "They completely transformed our website! It now looks modern and performs better than ever.",
        //         metric: "⭐⭐⭐⭐⭐",
        //         img: "https://images.unsplash.com/photo-1676195470090-7c90bf539b3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "
        //     }
        // ];

        // const sliderTrack = document.getElementById('slider-track');

        // function createCard(data) {
        //     const card = document.createElement('div');
        //     card.className = 'review-card';
        //     card.innerHTML = `
        //         <div class="card-header">
        //             <img src="${data.img}" alt="${data.name}" class="profile-img">
        //             <div class="reviewer-info">
        //                 <div class="reviewer-name">${data.name}</div>
        //                 <div class="stars">${data.stars}</div>
        //             </div>
        //         </div>
        //         <p class="review-text">
        //             ${data.text}
        //         </p>
        //         <div class="metric">
        //             ${data.metric}
        //         </div>
        //     `;
        //     return card;
        // }

        // function populateSlider() {
        //     // Populate the track once
        //     reviewData.forEach(data => {
        //         sliderTrack.appendChild(createCard(data));
        //     });

        //     // Clone and append the cards to create the seamless infinite loop effect
        //     // We clone twice to ensure enough content for the smooth loop transition
        //     const originalContent = sliderTrack.innerHTML;
        //     sliderTrack.innerHTML += originalContent + originalContent;
        // }

        // populateSlider();

const sheetURL = "https://docs.google.com/spreadsheets/d/1NWKCIO_z2bxP__kj_vE-GwvMC8vHjSRIHAn-c_XzF8Q/gviz/tq?tqx=out:csv";


const sliderTrack = document.getElementById("slider-track");

/* ✅ Proper CSV parser */
function parseCSV(csv) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"' && csv[i + 1] === '"') {
      currentValue += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentValue.trim());
      currentValue = "";
    } else if (char === "\n" && !insideQuotes) {
      currentRow.push(currentValue.trim());
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  currentRow.push(currentValue.trim());
  rows.push(currentRow);

  return rows;
}

/* Card UI */
function createCard(data) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <div class="card-header">
      <img src="${data.img}" alt="${data.name}" class="profile-img">
      <div class="reviewer-info">
        <div class="reviewer-name">${data.name}</div>
        <div class="stars">${data.stars}</div>
      </div>
    </div>
    <p class="review-text">${data.text}</p>
    <div class="metric">${data.metric}</div>
  `;
  return card;
}

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const parsed = parseCSV(csv);

    // Remove header row
    const rows = parsed.slice(1);

    rows.forEach(row => {
      if (row.length < 5) return;

      const data = {
        name: row[0],
        stars: row[1],
        text: row[2],
        metric: row[3],
        img: row[4]
      };

      sliderTrack.appendChild(createCard(data));
    });

    // Infinite loop effect
    const content = sliderTrack.innerHTML;
    sliderTrack.innerHTML += content + content;
  });

