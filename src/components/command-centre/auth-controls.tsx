"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthControls() {
  return (
    <div className="auth-controls" aria-label="Account controls">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="auth-button" type="button">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="auth-button primary" type="button">Sign up</button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
