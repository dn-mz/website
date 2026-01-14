// Very small airport → timezone map (MVP only)
const airportTimezones = {
    LHR: "Europe/London",
    JFK: "America/New_York",
    SFO: "America/Los_Angeles",
    SIN: "Asia/Singapore",
    HND: "Asia/Tokyo",
    DXB: "Asia/Dubai"
  };
  
  document.getElementById("generate").addEventListener("click", generatePlan);
  
  function generatePlan() {
    const from = document.getElementById("from").value.toUpperCase();
    const to = document.getElementById("to").value.toUpperCase();
    const departTime = document.getElementById("departTime").value;
    const arrivalTime = document.getElementById("arrivalTime").value;
  
    if (!from || !to || !departTime || !arrivalTime) {
      alert("Please fill in all flight details.");
      return;
    }
  
    if (!airportTimezones[from] || !airportTimezones[to]) {
      alert("Unknown airport code. MVP supports LHR, JFK, SFO, SIN, HND, DXB.");
      return;
    }
  
    const depart = new Date(departTime);
    const arrive = new Date(arrivalTime);
  
    const flightDurationHours = (arrive - depart) / 36e5;
  
    const arrivalHour = arrive.getHours();
  
    const timeline = [];
  
    // Core sleep logic (simple, explainable)
    if (flightDurationHours >= 7) {
      if (arrivalHour >= 18 || arrivalHour <= 5) {
        timeline.push(block("Sleep", "Last 4–5 hours of flight", "Align with destination night", "sleep"));
      } else {
        timeline.push(block("Nap", "Mid-flight (max 90 min)", "Avoid long sleep before daytime arrival", "sleep"));
      }
    } else {
      timeline.push(block("Nap", "Short rest only", "Flight too short for full sleep", "sleep"));
    }
  
    timeline.push(block("Eat", "2–3 hours before landing", "Light meal, avoid heavy food", "eat"));
    timeline.push(block("Wake", "Final hour", "Hydrate and stay awake", "wake"));
  
    renderTimeline(timeline);
  }
  
  function block(title, time, note, type) {
    return { title, time, note, type };
  }
  
  function renderTimeline(items) {
    const container = document.getElementById("timeline");
    container.innerHTML = "";
  
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = `timeline-block ${item.type}`;
      div.innerHTML = `
        <div class="time">${item.title} — ${item.time}</div>
        <div class="note">${item.note}</div>
      `;
      container.appendChild(div);
    });
  
    document.getElementById("results").classList.remove("hidden");
  }
  