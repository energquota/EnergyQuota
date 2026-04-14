# ESP32 Device API Specification – EnergyQuota

**What to request from the ESP32 coder:** Use this document as the contract/spec for the device that will report energy consumption to the EnergyQuota server.

---

## 1. Endpoint

| Item | Value |
|------|--------|
| **Method** | `POST` |
| **URL** | `https://YOUR_DOMAIN/devices` (replace with your server base URL) |
| **Content-Type** | `application/json` |

Example: `https://energyquota.com/devices` or `http://YOUR_IP:3000/devices` for local testing.

---

## 2. Request body (JSON)

The ESP32 must send a JSON body with exactly these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meter_number` | string | Yes | Meter number for this property (must match the owner’s meter in the system). |
| `tenants` | array | Yes | List of tenants and their consumption in this reporting period. |

Each element of `tenants` must have:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenant_id` | string | Yes | Unique tenant ID in EnergyQuota (same as when the tenant was registered; e.g. `meter_number + house_number`). Must match exactly. |
| `units_used` | number or string | Yes | Units (kWh) consumed by this tenant since the last report. **Send with up to 10 decimal places** for accuracy (e.g. `0.025`, `1.5`, `12.1234567890`). |

### Example request body

```json
{
  "meter_number": "12345678901",
  "tenants": [
    { "tenant_id": "12345678901101", "units_used": 0.5 },
    { "tenant_id": "12345678901102", "units_used": 1.25 },
    { "tenant_id": "12345678901103", "units_used": 0.025 }
  ]
}
```

- One meter can have multiple tenants (one object per tenant per report).
- `units_used` is the **consumption in this period** (e.g. since last POST). The server will subtract it from `remaining_units` and add it to `used_units`.

---

## 3. Response

**Success (200 OK)**

```json
{
  "meter_number": "12345678901",
  "tenants": [
    { "tenant_id": "12345678901101", "remaining_units": "45.5000000000" },
    { "tenant_id": "12345678901102", "remaining_units": "28.7500000000" },
    { "tenant_id": "12345678901103", "remaining_units": "19.9750000000" }
  ]
}
```

- `remaining_units` is returned with 10 decimal places (string). The ESP32 can round to 2 decimals for display if needed.

**Error (500)**

- Body may contain `{ "message": "Internal server error" }`. The ESP32 should retry with backoff and/or log.

**Validation / not found**

- If a `tenant_id` is not found, that tenant is skipped (no update). The response still returns `meter_number` and the list of tenants that were updated. The ESP32 coder should ensure `tenant_id` and `meter_number` match what is registered in EnergyQuota.

---

## 4. What the ESP32 coder must implement

1. **HTTP POST** to `POST /devices` with JSON body as above.
2. **Correct IDs**: Use the exact `meter_number` and `tenant_id` values that exist in EnergyQuota (from registration).
3. **Units precision**: Send `units_used` with up to **10 decimal places** (e.g. as float or string like `"1.2345678900"`) so the server can keep accuracy.
4. **Reporting interval**: Decide how often to send (e.g. every 1 min, 5 min, or when consumption changes). Avoid flooding the server.
5. **Retries**: On network or 5xx errors, retry with backoff (e.g. 1s, 2s, 4s).
6. **Wi‑Fi / connectivity**: Handle disconnect and reconnect; buffer or resend data if needed (your design choice).
7. **Security (optional)**: If you later add API key or auth, the coder will need to add the correct header (e.g. `Authorization: Bearer <key>`). For now, the endpoint has no auth.

---

## 5. Important notes for the ESP32 coder

- **`tenant_id`** in EnergyQuota is set when the owner registers a tenant (e.g. `meter_number + house_number`). The ESP32 must use the **same** `tenant_id` for each house/tenant. You (the backend owner) must provide the coder with the list of `meter_number` and `tenant_id` per property.
- **`units_used`** = consumption in the period since last report (delta), not total consumption.
- Server stores and calculates with **10 decimal places**; dashboards and apps show **2 decimal places**.
- If `remaining_units` would go negative, the server may still update (you can later add validation). The ESP32 can use the returned `remaining_units` to show low balance or trigger alerts.

---

## 6. Checklist to give the ESP32 coder

- [ ] POST to `https://YOUR_DOMAIN/devices` with JSON body.
- [ ] Body has `meter_number` (string) and `tenants` (array).
- [ ] Each tenant has `tenant_id` (string) and `units_used` (number/string, up to 10 decimals).
- [ ] Use exact `meter_number` and `tenant_id` from EnergyQuota.
- [ ] Handle 200 response and optional 500 with retry.
- [ ] Decide reporting interval and retry/backoff strategy.
- [ ] (Optional) Display or use `remaining_units` from response with 2 decimal places.

Provide the coder with:
1. This spec (or the link to it).
2. Your server base URL (e.g. `https://yourdomain.com`).
3. A list of `meter_number` and `tenant_id` values for each property/tenant they will report.
