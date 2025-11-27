# Vendor Management Backend


## Quick start


1. copy `.env.example` to `.env` and edit values
2. `cd backend`
3. `npm install`
4. `npm run seed` (creates an admin user and sample vendor/item)
5. `npm run dev` (requires nodemon) or `npm start`


Default admin credentials (seed): `admin@example.com` / `password`.


API base: `http://localhost:5000/api/`


Endpoints: `/auth`, `/vendors`, `/items`, `/purchase-orders`, `/invoices`, `/payments`.


Notes:
- Invoice upload endpoint accepts multipart/form-data with field `file`.
- The uploads are served at `/uploads/<filename>`.