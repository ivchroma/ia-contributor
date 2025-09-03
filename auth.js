function parseJwt(token) {
    const base64Url = token.split('.')[1]; // The payload is the 2nd part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    const userObject = parseJwt(response.credential);
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("mainUI").style.display = "block";
    document.getElementById("status").innerText = `${userObject.name}`;
}

// Initialize Google Sign-In
google.accounts.id.initialize({
    client_id: "115396371783-sc29nt2eefmk5o10ev18d5092vgqmrj0.apps.googleusercontent.com",
    callback: handleCredentialResponse
});

// Render the sign-in button
google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" }
);
google.accounts.id.prompt();

// Create a single supabase client for interacting with your database

const client = supabase.createClient('https://zzypezedfkegupwpwsam.supabase.co', 'sb_publishable_pasDUaq9bzG0kQkFIvyaeQ_XdvKTBO_')
async function qryID(){
    const { data, error } = await client
    .from('people')
    .select('id')
    if (error) {
    console.error('Error:', error)
    } else {
    console.log('Data:', data)
    }
}
qryID()
