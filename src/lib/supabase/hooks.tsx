import { createClient, type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useSupabase() {
    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    return supabase;
}

export function useUserInfo() {
    const supabase = useSupabase();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        supabase.auth.getUser().then(({ data }) => {
            setLoading(false);
            setUser(data.user);
        }).catch((e) => {
            setError(e.message);
            setUser(null);
            setLoading(false);
        }).finally(
            () => {
            setLoading(false); 
            }
        );
    }, []);

    return { user, error, loading };
}

export function useLoginWithPassword() {
    return ({ email, password }: { email: string, password: string }): Promise<{ data: { user: User | null }, error: Error | null }> =>{
        const supabase = useSupabase();
    
        return supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
    }
}

// Good to have feature to login with Google
export function useLoginWithGoogle() {
    const supabase = useSupabase();

    return supabase.auth.signInWithOAuth({
        provider: 'google',
    });
}

export function useSignUpWithEmail() {
    const supabase = useSupabase();

    return ({ email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }): Promise<{ data: { user: User | null }, error: Error | null }> => {
        return supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                firstName: firstName,
                lastName: lastName,
            }
        }
    })};
}