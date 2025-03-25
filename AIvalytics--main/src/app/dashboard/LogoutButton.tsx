"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";

export default function LogoutButton() {
  return <Button onClick={() => logout()}>Logout</Button>;
}
