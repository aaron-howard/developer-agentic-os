# Connecting GitHub to your Clerk identity

This describes the "Connect GitHub" button added to the hosted app's account controls
(`src/components/command-centre/auth-controls.tsx`), what happens on GitHub's side, and
why you may not be seeing it yet.

## Prerequisite: GitHub must be enabled as a Clerk connection first

If clicking "Connect GitHub" does nothing, throws an error, or you land on a Clerk error
page instead of GitHub, this step has not been done yet. It is a one-time dashboard
setting, not something the app code can turn on for you.

1. Go to https://dashboard.clerk.com
2. Select your application, then select the **Development** instance (the one your
   local `.env` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` points at).
3. In the left sidebar, go to **User & Authentication** > **Social Connections**.
   Direct path inside the dashboard: `https://dashboard.clerk.com/apps/<your-app-id>/instances/<your-instance-id>/user-authentication/sso-connections`
4. Find **GitHub** in the provider list and toggle it **on**.
5. For a **Development** instance, Clerk provides its own shared GitHub OAuth app
   automatically — you do not need to register anything on GitHub's side yourself.
   (A **Production** instance instead requires you to supply your own GitHub OAuth
   app's Client ID and Client Secret, created at
   `https://github.com/settings/developers` > **OAuth Apps** > **New OAuth App**.)
6. Save. Reload your app's tab so Clerk's client-side config picks up the change.

Once this is enabled, clicking "Connect GitHub" will redirect your browser to GitHub
rather than doing nothing / erroring.

## What you should see once GitHub is enabled

Step by step, with the exact URL patterns involved (not truncated):

1. You click **Connect GitHub** in the app.
2. Your browser navigates to a GitHub URL of this shape:
   `https://github.com/login/oauth/authorize?client_id=Iv1.xxxxxxxxxxxxxxxx&redirect_uri=https%3A%2F%2Fclerk.<your-clerk-instance>.accounts.dev%2Fv1%2Foauth_callback&response_type=code&scope=read%3Auser%20user%3Aemail&state=xxxxxxxx`
   - `client_id` = the GitHub OAuth app's ID (Clerk's shared dev one, or yours in production).
   - `redirect_uri` = Clerk's own callback endpoint (not your app's `/sso-callback` yet —
     that comes one hop later).
   - `scope` = what permissions are being requested (profile/email by default; org
     membership read only if you configured additional scopes).
3. **If you are not already logged into GitHub in that browser**, GitHub shows its
   normal sign-in page first: `https://github.com/login`. Log in there.
4. **If you are already logged into GitHub**, GitHub skips straight to the consent
   screen: a page titled **"Authorize <your Clerk app name>"**, listing the
   permissions being requested, with a green **Authorize <app name>** button.
   - If you have *previously* authorized this same GitHub OAuth app (e.g. you tested
     this before, or it's the same shared Clerk dev app another project of yours also
     uses), **GitHub skips this consent screen entirely** and redirects immediately —
     this is the most likely reason you "don't see any of this." Check
     `https://github.com/settings/applications` (tab: **Authorized OAuth Apps**) — if
     an app matching Clerk's dev client is already listed there, that's why.
5. Clicking **Authorize** (or the instant redirect from step 4's skip case) sends your
   browser to Clerk's callback URL from step 2, which Clerk processes, then redirects
   again to **your app's** `/sso-callback` route (e.g.
   `https://your-app.vercel.app/sso-callback` or `http://localhost:3000/sso-callback`
   locally). That route renders `src/app/sso-callback/page.tsx`, which finishes the
   handshake with Clerk client-side and forwards you to `/`.
6. Back in the app, the button now reads **"GitHub: @your-username"** instead of
   "Connect GitHub."

## If you still don't see any GitHub screen at all

That means the redirect in step 2 above never happened. Check, in this order:

1. **Browser console / network tab** when you click "Connect GitHub" — look for a
   thrown error from `user.createExternalAccount(...)`. A common error message is
   something like `"github" is not enabled for this instance` — this confirms step
   "Prerequisite" above hasn't been done yet.
2. **Clerk Dashboard → Social Connections** — confirm GitHub shows as **Enabled**,
   not just present in the list.
3. **Which Clerk instance you're actually configured against** — check
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in your `.env` / Vercel project settings starts
   with `pk_test_` (development) or `pk_live_` (production), and make sure you edited
   Social Connections on that *same* instance in the dashboard (dev vs. prod are
   configured completely separately).
4. **Dev server restarted** after any `.env` change, since Next.js only reads env vars
   at process start.
