# IWANNABERICH Owner setup

1. In Supabase Dashboard → Authentication → Users, create an Email/Password user for the owner.
2. Copy the exact owner email.
3. In Supabase Edge Function secrets, add:
   OWNER_EMAIL=<your owner email>
4. Run the migration:
   supabase/migrations/202608180001_owner_replies.sql
   in Supabase SQL Editor.
5. Deploy the updated submit-prediction Edge Function.
6. Open /owner.html on the site and log in.
7. Open /support.html. Logged-in owner mode will show reply boxes and OWNER badges.

Do not put the password or service-role key into frontend files.
