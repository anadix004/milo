
# 1. Technical

- [ ] **Environment Audit:** Verify that all production environment variables in Vercel are correct. Check that you aren't accidentally hitting "Sandbox" or "Test" endpoints for payments or databases.  Double-check that all **Production** keys (Stripe, Firebase, APIs) are set in Vercel and differ from development keys. 
- [ ] **Console Clean-up:** Open DevTools and ensure there are no `console.log` statements, warnings, or failed network requests in the production build.

# 2. Quality Assurance

- [ ] **Form Submissions:** Test every contact form and lead capture. Ensure data reaches your database or email and that users see a success message. 
- [ ] **Cross-Browser/Device Check:** Test on Chrome, Safari, and Firefox. Crucially, test on a physical iOS and Android device to check touch-target sizes.
- [ ] **Broken Link Audit:** Run a crawler (like Screaming Frog) to ensure no 404s exist in your navigation.
- [ ] **Custom 404 & 500 Pages:** Ensure you have branded error pages. A generic Vercel 404 makes a site look unfinished.
- [ ] **Favicon & Branding:** Verify that the favicon, Apple Touch Icon, and manifest file are all present and not using default framework icons (like the Next.js or React logo).
- [ ]  **Form Validation:** Try to "break" your forms. Submit empty fields, invalid emails, and long strings of text. Ensure the error messages are helpful, not just "Error."
- [ ] **Loading States:** If your site fetches data, ensure there are skeletons or spinners. Users shouldn't stare at a blank screen while an API responds.

# 3. Performance Optimization

- [ ] **Font Loading:** Ensure fonts are set to `font-display: swap` to prevent "Flash of Unstyled Text" (FOUT).
- [ ] **Improve** your Largest Contentful Paint (LCP).
- [ ] **Core Web Vitals:** Check your Google PageSpeed Insights score. Aim for 90+ on mobile.
- [ ] **Image Optimization:** Ensure all assets are served in modern formats (WebP/AVIF).
- [ ] **Analytics Setup:** Verify Google Analytics 4 (GA4) or Vercel Speed Insights are firing correctly.
- [ ] **Image Compression:** Run all static assets through **TinyPNG** or ensure your framework is using automatic image optimization (like `next/image`).

# 4 . Security

- [ ]  **Security Headers:** Use a tool like **SecurityHeaders.com** to check your score. Aim for at least an "A" by configuring headers in your `vercel.json` or framework config.
- [ ] **Legal Footer:** Ensure the "Privacy Policy" and "Terms of Service" links are active. Even for a MVP, this is critical for trust and certain API approvals.
- [ ] **Input Sanitization:** Verify that no user inputs (search bars, forms) are vulnerable to basic XSS injections.
- [ ] **Password Policy:** Ensure you aren't allowing weak passwords. At a minimum, enforce 8+ characters with a mix of types.
- [ ] **Production Database Migration:** Ensure your production database (e.g., Supabase, MongoDB Atlas, Prisma) is isolated from your development data. **Do not launch with "test_user_1" still in the DB.**
- [ ] **Session Management:** Verify that "Logout" actually destroys the session/token on the server, not just the client. Test that the "Back" button doesn't reveal private data after logging out.
- [ ] **IDOR Protection:** This is the most common full-stack mistake. Ensure that a user can only edit _their own_ profile.
    > **The Test:** If I change the URL from `/api/user/101` to `/api/user/102`, can I see someone else’s data? **If yes, fix it before launch.**
- [ ] **Verification Flow:** If you have email verification, test it with multiple providers (Gmail, Outlook, iCloud). Often, these emails end up in "Spam" or "Promotions"—consider adding a note on the UI: _"Check your spam folder if you don't see the email."_
- [ ] **The "First Run" Experience:** What does a user see the second they finish signing up?
    - Avoid an empty screen.
    - Use **Empty States** (e.g., "You haven't created any projects yet. Click '+' to start!") to guide them.
- [ ] **Error Clarity:** If a user enters the wrong password, don't just say "Error." Say "Invalid email or password." If the server is down, show a friendly "We're having trouble reaching the server" message.
- [ ] **Password Reset:** This is the #1 support ticket for new apps. Ensure the "Forgot Password" flow is 100% functional and sends a secure, expiring link.
- [  ] **Profile Updates:** Ensure users can change their own name, email, and—crucially—**delete their account**. Modern privacy laws (like GDPR) often require a clear way for users to remove their data
- [ ] **Auth Rate Limiting:** Prevent "Brute Force" attacks. If someone tries to log in 10 times in a minute, your API should block them temporarily.
- [ ] **User Analytics:** Set up an event to track "Sign Up Completed." If you see 100 people hit the signup page but only 2 finish, you have a "friction" problem you need to fix immediately.
- [ ] **Admin Access:** Ensure your team has a way to look at user logs or "Impersonate" a user (securely) to help them if they get stuck.



# 5. SEO

- [ ] **Generate Sitemap & Robots.txt:** Ensure search engines can crawl your site.
- [ ] **Metadata Audit:** Use a tool like **SEO Spyglass** or a simple browser extension to check every page for:
    - Unique `<title>` tags (under 60 characters).
    - Meta descriptions (under 160 characters).
    - `og:image` (Open Graph) for social media previews.