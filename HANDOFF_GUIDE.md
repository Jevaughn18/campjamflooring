# CampJam Flooring - Website Handoff Guide

## For Your Friend (The Business Owner)

This document explains how your friend can manage the website independently.

---

## 1. Managing Reviews (Deleting Inappropriate Comments)

### Access the Admin Panel
1. Visit: **https://your-domain.com/admin** (or http://localhost:8080/admin for local)
2. Enter the password: **CampJam2025!**
3. You'll see all customer reviews

### Delete a Review
1. Click the red trash icon next to any review
2. Confirm the deletion
3. The review is permanently removed

### Change Admin Password
- The password is set in the code: `src/pages/Admin.tsx` (line 17)
- Change `const ADMIN_PASSWORD = "CampJam2025!";` to any password
- Redeploy the site

---

## 2. Domain & Account Ownership Solutions

You have **3 options** for handling domain and accounts:

### Option A: Transfer Everything to Your Friend (Recommended)

#### Vercel Account
1. Go to Vercel project settings
2. Transfer project to your friend's Vercel account (free)
3. He creates a Vercel account with his email
4. You transfer ownership

#### Supabase Account
1. Go to Supabase project settings
2. Invite your friend as an "Owner"
3. Transfer billing to his credit card
4. You can leave or stay as backup admin

#### Domain
- Register domain in **his name** from the start
- Use: Namecheap, GoDaddy, or Google Domains
- Point domain to Vercel (Vercel provides instructions)
- He pays annually for the domain (~$10-15/year)

**Cost:**
- Domain: ~$12/year
- Vercel: Free (or $20/month for Pro if needed)
- Supabase: Free (or $25/month for Pro if needed)

---

### Option B: You Manage, He Pays

1. **Set up billing with his card:**
   - Add his credit card to Vercel
   - Add his credit card to Supabase
   - Register domain with his payment info

2. **Give him access:**
   - Add him as collaborator on Vercel
   - Add him as member on Supabase
   - Share admin password for review management

3. **Document everything:**
   - Give him login credentials
   - Show him how to manage reviews
   - Provide this handoff guide

---

### Option C: Hybrid Approach

1. **Domain in his name** (he owns it, pays for it)
2. **Vercel/Supabase in your name** (you have admin access)
3. **Add him as collaborator** (he can manage reviews, content)
4. **Set up his payment method** for monthly bills

---

## 3. What Your Friend Needs to Know

### To Manage the Website:
- **Admin Panel:** https://your-domain.com/admin
- **Password:** CampJam2025! (can be changed)
- **Can delete reviews:** Yes
- **Can see all reviews:** Yes
- **Needs coding knowledge:** No

### Monthly Costs (Typical):
- **Domain:** ~$1/month ($12/year)
- **Vercel Hosting:** Free (hobby plan)
- **Supabase Database:** Free (hobby plan)
- **Total:** ~$12/year (just domain!)

### When to Upgrade:
- Vercel Pro ($20/month): If site gets 100k+ visitors/month
- Supabase Pro ($25/month): If database grows beyond 500MB or needs more features

---

## 4. Important Credentials to Share

Create a secure document (password manager) with:

### Vercel (Hosting)
- Account email: _____________
- Password: _____________
- Project URL: https://vercel.com/dashboard

### Supabase (Database)
- Account email: _____________
- Password: _____________
- Project URL: https://bwhjvxiuemwbtwqgzpfh.supabase.co

### Domain Registrar
- Provider: _____________
- Account email: _____________
- Password: _____________

### Website Admin
- Admin URL: https://your-domain.com/admin
- Password: CampJam2025!

---

## 5. Emergency Contact

If something breaks:
- You (the developer): [Your contact]
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support

---

## 6. Common Tasks

### Add New Project Photos
1. Add images to `src/assets/projectX/` folder
2. Update `src/components/Gallery.tsx`
3. Push to GitHub → Auto-deploys to Vercel

### Update Contact Info
- Edit `src/components/Contact.tsx`
- Edit `src/components/Footer.tsx`
- Push changes

### Monitor Reviews
- Visit `/admin` regularly
- Delete inappropriate content
- No need to approve each review (auto-published)

---

## Recommendation

**Best approach for your situation:**

1. **Create accounts in HIS name** (Vercel, Supabase, Domain)
2. **Add yourself as collaborator** (backup admin)
3. **Set up HIS payment methods**
4. **Share the admin panel** for review management
5. **Provide this guide** and credentials securely

This way:
- ✅ He owns everything
- ✅ He pays for everything
- ✅ You can help if needed
- ✅ He can manage reviews independently
- ✅ No dependency on you long-term
