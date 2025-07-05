# Enhanced Xtopay Checkout API Design

Based on your requirements, I've crafted a comprehensive API design that exceeds Hubtel's developer experience while maintaining security and scalability for multi-country expansion.

## Core API Architecture

### Authentication

- **Basic Auth** with `api_id:api_key` base64 encoded
- Rate limited (1000 requests/minute)
- IP whitelisting available
- Sandbox & production environments

```
Authorization: Basic base64(api_id:api_key)
```

### Base URL

```
https://api.xtopay.co/v1/
```

## Optimized Endpoint Structure

### 1. Business Profile (Preload UI)

```
GET /business/info
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "businessName": "Acme Inc",
    "businessEmail": "",
    "businessId": "0800000",
    "curency": "GHS",
    "": "",
    "logoUrl": "https://cdn.xtopay.co/businesses/acme.png"
  }
}
```

### 2. Checkout Initiation (Core Endpoint)

```
POST /checkout/initiate
```

**Request:**

```json
{
  "amount": 100.5,
  "currency": "GHS",
  "clientReference": "ORD-12345",
  "description": "Online Purchase",
  "customer": {
    "name": "Kwame Asante",
    "phone": "233245000111",
    "email": "kwame@example.com"
  },
  "channels": ["mtn", "card"],
  "callbackUrl": "https://merchant.com/webhook",
  "returnUrl": "https://merchant.com/thank-you",
  "cancelUrl": "https://merchant.com/cancelled",
}
```

**Enhanced Response:**

```json
{
  "status": "pending",
  "checkoutId": "xtp_123abc",
  "links": {
    "redirect": "https://pay.xtopay.co/xtp_123abc",
  },
  "expiresAt": "2023-12-31T23:59:59Z",
  "clientReference": "ORD-12345"
}
```

### 3. Payment Status Check

```
GET /checkout/status/:clientReference
```

**Response:**

```json
{
  "status": "paid",
  "amount": 100.5,
  "currency": "GHS",
  "paidAt": "2023-06-15T10:05:22Z",
  "channel": "mtn",
  "transactionId": "xtp_pay_789xyz",
  "customerPhone": "233245000111",
  "fees": 1.5,
  "settlementAmount": 99.0
}
```

### 4. Webhook System

**Secure Headers:**

```
X-Xtopay-Signature: sha256=...
X-Xtopay-Timestamp: 1686830722
```

**Payload:**

```json
{
  "event": "payment.completed",
  "data": {
    "checkoutId": "xtp_123abc",
    "clientReference": "ORD-12345",
    "status": "paid",
    "amount": 100.5,
    "channel": "mtn",
    "completePayload": {
      "transactionId": "xtp_pay_789xyz",
      "customerPhone": "233245000111",
      "fees": 1.5
    }
  }
}
```

### 5. Cancel Payment

```
POST /checkout/cancel/:clientReference
```

**Response:**

```json
{
  "status": "cancelled",
  "cancelledAt": "2023-06-15T10:07:15Z"
}
```

## Developer Experience Enhancements

### 1. Frontend Integration Options

**a. Redirect Flow (Simplest)**

```html
<a href="https://pay.xtopay.co/xtp_123abc" class="xtopay-button">
  Pay with Xtopay
</a>
```

**b. Embedded Modal (React Example)**

```jsx
import { XtopayCheckout } from "@xtopay/react-checkout";

function App() {
  return (
    <XtopayCheckout
      checkoutId="xtp_123abc"
      onSuccess={(payment) => console.log("Paid:", payment)}
      onClose={() => console.log("Modal closed")}
      style={{
        buttonColor: "#3B82F6",
        borderRadius: "8px",
      }}
    />
  );
}
```

