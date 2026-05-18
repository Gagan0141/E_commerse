# Role-Scoped Authentication Setup

This guide explains how to implement role-scoped sessions for Admin, Vendor, and User roles logged in simultaneously.

## Overview

- **Backend**: Stores separate refresh tokens per role in the User model
- **Frontend**: Maintains separate sessions for each role in state
- **API Calls**: Send the `x-role` header to specify which role's session to use
- **Cookies**: Browser stores separate `refreshToken_Admin`, `refreshToken_Vendor`, `refreshToken_User` cookies

## Backend Implementation ✓ Complete

### User Model
```javascript
refreshTokens: {
  Admin: { type: String, default: null },
  Vendor: { type: String, default: null },
  User: { type: String, default: null },
}
```

### Auth Controller
- **Login**: Sets role-specific refresh token cookie
- **Refresh**: Reads role from request, validates correct refresh token
- **Logout**: Clears role-specific refresh token cookie

All endpoints expect `role` in request body or `x-role` header.

## Frontend Implementation

### 1. Auth Context (Auth.jsx) ✓ Complete
- Maintains separate sessions: `sessions.Admin`, `sessions.Vendor`, `sessions.User`
- Stores role-specific access tokens in localStorage: `accessToken_Admin`, `accessToken_Vendor`, `accessToken_User`
- Request/response interceptors handle role-based token management
- Session restoration on app load

### 2. Login Component (Login.jsx) ✓ Updated
- Shows role selection dropdown
- Sends role with login credentials
- Redirects to role-specific dashboard

### 3. Private Routes (PrivateRoutes.jsx) ✓ Updated
- Automatically detects role from URL path
- Ensures correct role session is active before rendering
- Falls back to any active session if route doesn't specify role

## Using Role-Scoped API Calls

### Method 1: useRoleAPI Hook (Recommended)

Import the hook in your component:
```javascript
import { useRoleAPI } from "../utils/useRoleAPI";

function MyComponent() {
  const { get, post, put, delete } = useRoleAPI();

  const fetchData = async () => {
    const res = await get("/api/products");
    // Role header is automatically added based on current route
  };

  const updateData = async (id, data) => {
    await put(`/api/products/${id}`, data);
  };

  return (/* JSX */);
}
```

**How it works:**
- Hook reads current route path
- Automatically adds `x-role` header: `Admin` for `/admin/*`, `Vendor` for `/vendor/*`, etc.
- Use it everywhere you make API calls

### Method 2: Manual API Calls (Legacy)

If you prefer direct API usage:
```javascript
import api from "../api/axios";

// Admin tab making request
await api.get("/api/orders", {
  headers: { "x-role": "Admin" }
});

// Vendor tab making request
await api.post("/api/products", data, {
  headers: { "x-role": "Vendor" }
});
```

## Example: Admin Dashboard

```javascript
import React, { useEffect, useState } from "react";
import { useRoleAPI } from "../utils/useRoleAPI";
import { useAuth } from "../utils/Auth";

function Admin() {
  const { post, get } = useRoleAPI();
  const { admin } = useAuth(); // Get Admin session
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Role header automatically added (Admin)
        const res = await get("/api/orders");
        setOrders(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [get]);

  const handleLogout = async () => {
    // Logout function already sends correct role
    // (from Auth context)
  };

  if (!admin?.user) return <div>Unauthorized</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Render orders */}
    </div>
  );
}

export default Admin;
```

## Multi-Tab Testing

1. Open your app in two browser tabs
2. **Tab 1**: Login as Admin
3. **Tab 2**: Login as Vendor
4. **Tab 1**: Make requests → Admin session is used
5. **Tab 2**: Make requests → Vendor session is used
6. Sessions do NOT interfere with each other
7. Close tab, come back later → Session restored from refresh token

## FAQ

**Q: How does logout work across tabs?**
- Each tab maintains its own session in localStorage and state
- Logout clears only that role's tokens and cookies
- Other role sessions remain untouched

**Q: What if I forget to send x-role header?**
- The request still executes but uses the access token from the interceptor
- Refresh tokens won't refresh correctly without the role
- Best practice: Always use useRoleAPI hook

**Q: Can I access other role sessions?**
- Yes: `useAuth()` returns all sessions: `sessions.Admin`, `sessions.Vendor`, `sessions.User`
- Use this to show user's other logged-in roles in UI

**Q: How are refresh tokens stored?**
- Browser cookies: `refreshToken_Admin`, `refreshToken_Vendor`, `refreshToken_User`
- Each role has its own secure, httpOnly cookie
- Backend verifies each cookie during refresh

## Troubleshooting

**Issue**: 401 Unauthorized on API calls
- **Cause**: Role header not sent
- **Fix**: Use `useRoleAPI()` hook or manually add `headers: { "x-role": "Admin" }`

**Issue**: Session lost on page refresh
- **Cause**: Refresh tokens not found or not validated
- **Fix**: Check browser DevTools → Cookies for `refreshToken_*` cookies

**Issue**: Only one role can be logged in
- **Cause**: Using old auth implementation
- **Fix**: Ensure `useRoleAPI()` is used for all API calls
