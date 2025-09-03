

document.getElementById("mainUI").style.display = "block";



const client = supabase.createClient('https://zzypezedfkegupwpwsam.supabase.co', 'sb_publishable_pasDUaq9bzG0kQkFIvyaeQ_XdvKTBO_')


const {data:{session}} = await client.auth.getSession()

if(!session){
const { data, error } = await client.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.href
  }
})
}
else {
    console.log("User logged in:", session.user)
    document.getElementById("buttonDiv").style.display = "none";
    document.getElementById("mainUI").style.display = "block";
    let username = session.user.user_metadata.full_name
    document.getElementById("status").innerText = `${username}`;
}



async function qryID() {
  const { data, error } = await client
    .from('people')
    .select('person_id')
    .eq('email', session.user.user_metadata.email);

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data[0].person_id;
}
let uID;
(async () => {
  uID = await qryID();
  console.log('uID:', uID);
})();


function insAddEvent(personID, timeBegin, timeEnd, stateVar){
  client
    .from('calendar')
    .insert({time_begin: timeBegin, time_end: timeEnd, state: stateVar, person_id: personID })
    .then(({ error }) => {
      if (error) {
        console.error('Error:', error);
        console.error('We fucked up bro');
      }
      else{
        console.log('event added!');
      }
    });
}
var funcForm = function insAddEventForm(e){
  e.preventDefault();
  const personID = uID
  const timeBeginRaw = document.getElementById("startTime").value;
  const timeBegin = new Date(timeBeginRaw).toISOString();
  const timeEndRaw = document.getElementById("endTime").value;
  const timeEnd = new Date(timeEndRaw).toISOString();
  let varState;
  if (document.getElementById("weekly").checked){
    varState = "weekly";
  }
  else {varState = "once";}
  
  insAddEvent(personID, timeBegin, timeEnd, varState);
}


document.getElementById("timeAddButton").addEventListener("click", funcForm)