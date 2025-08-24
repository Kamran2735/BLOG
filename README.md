# Project Status & Issues

This repository contains our blog platform with features like reactions, roles, and an admin panel.  
Currently, we are facing the following issues that need to be resolved:

---

## 1. Reactions Not Updating
- **Problem:**  
  Reactions (likes, etc.) on blog posts are not persisting.  
  They appear to update in the UI, but after a page refresh or server restart, the values reset back to `0`.  

- **Possible Cause:**  
  The reaction updates are not being saved to the database correctly.  
  Hardcoding values shows them temporarily, but nothing persists after refresh.  

---

## 2. Roles Not Fetching Properly
- **Problem:**  
  Roles are defined in both the database and authentication system.  
  However, when logging in, the correct role is **not being fetched**.  
  The system falls back to the **default role (`editor`)**, even if the user should have a higher role (e.g., `admin`).  

- **Expected Behavior:**  
  Users with an `admin` role should be redirected to the **Admin Panel**.  
  Currently, this is not happening because the role fetch seems to fail.  

---

## Next Steps
- Debug database writes for reactions and confirm that changes persist.  
- Verify the role-fetch logic during authentication.  
- Ensure that the admin role condition correctly redirects users to the Admin Panel.  

---
