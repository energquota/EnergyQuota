# Small Recent Changes – For ESP32 Coder

**We made a few small changes on our side only. For you: no change needed.**

---

## ESP32 coder: do not change anything

- The API is the same (same POST, same URL, same JSON).
- You keep sending **meter_number** and **tenants** (with **tenant_id** and **units_used**) as before.
- If you already send **units_used** (e.g. 0.5 or 1.25), that is still correct. We now store and calculate with 10 decimals and show 2 decimals in the app. Your code stays as it is.

---

## One sentence

**“We changed only how we store and display units (10 decimals inside, 2 on screen). The API did not change. You do not need to change anything on the ESP32.”**
