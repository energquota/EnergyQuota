var socket = io()
const meter_number = document.getElementById("meter-number").innerText;

socket.on('connection',()=>{
    console.log("User is connected")
})

socket.emit("joinRoomOwner", meter_number);

socket.on("all_data", (data)=>{
    const remainingEl = document.getElementById("all-remaining");
    const usedEl = document.getElementById("all-used");
    // Display 2 decimal places for readability (backend sends 10 decimals)
    const remainingDisplay = Number(data.remaining).toFixed(2);
    const usedDisplay = Number(data.used).toFixed(2);
    if (remainingEl) { remainingEl.innerText = remainingDisplay; remainingEl.classList.add("live-update"); setTimeout(() => remainingEl.classList.remove("live-update"), 600); }
    if (usedEl) { usedEl.innerText = usedDisplay; usedEl.classList.add("live-update"); setTimeout(() => usedEl.classList.remove("live-update"), 600); }
})