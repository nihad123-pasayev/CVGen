const SUPABASE_URL = "https://hfunikysianzmimnpybx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__kjoEZDvZjPUVXkKatmMdA_73BaXojg";

if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}


async function registerUser(fullName, email, password) {
    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })
    if (error) {
        return { success: false, message: error.message }
    } return { success: true, data: data }
}
async function loginUser(email, password) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        return { success: false, message: error.message }
    }
    return { success: true, data: data }


}
async function logoutUser() {
    const { error } = await window.supabaseClient.auth.signOut();
    return { success: !error };
}

async function getCurrentUser() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    return session ? session.user : null;
}