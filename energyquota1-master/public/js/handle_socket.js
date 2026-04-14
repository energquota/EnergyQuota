var socket = io()
const tenant_id = document.getElementById("tenant-id").innerText;

socket.on('connection',()=>{
    console.log("User is connected")
})

socket.emit("joinRoom", tenant_id);

socket.on("data", (data)=>{
    const remainingEl = document.getElementById("remaining-units");
    const usedEl = document.getElementById("used-units");
    // Display 2 decimal places for usability and readability (backend sends 10 decimals)
    const remainingDisplay = Number(data.remaining).toFixed(2);
    const usedDisplay = Number(data.used).toFixed(2);
    if (remainingEl) { remainingEl.innerText = remainingDisplay; remainingEl.classList.add("live-update"); setTimeout(() => remainingEl.classList.remove("live-update"), 600); }
    if (usedEl) { usedEl.innerText = usedDisplay; usedEl.classList.add("live-update"); setTimeout(() => usedEl.classList.remove("live-update"), 600); }
})