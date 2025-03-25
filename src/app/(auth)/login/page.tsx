import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
    const supabase = await createClient();  // ✅ Await the async function

    const { data, error } = await supabase.auth.getUser(); // ✅ Now this should work

    if (data.user) {
        redirect("/dashboard");
    }

    return <LoginForm />;
}
