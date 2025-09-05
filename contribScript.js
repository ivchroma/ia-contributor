

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

function insAddEvent(personID, timeBegin, timeEnd, stateVar){
  client
    .from('calendar')
    .insert({time_begin: timeBegin, time_end: timeEnd, state: stateVar, person_id: personID })
    .then(({ error }) => {
      if (error) {
        console.error('insAddEvent error:', error);
      }
      else{
        console.log('event added!');
      }
    });
}

function insRemoveEvent(e_id, p_id){
  client
    .from('calendar')
    .delete()
    .eq('event_id', e_id)
    .eq('person_id', p_id)
    .then(({ error }) => {
      if (error) {
        console.error('insAddEvent error:', error);
      }
      else{
        console.log('event removed!');
      }
    });
}

async function qryAvailabilityByID(personID){
  console.log('my personid is: ', personID)
  const {data, error} = await client
    .from('calendar')
    .select()
    .eq('person_id', personID)
    if (error) {
      console.error('qryAvailabilityByID error:', error);
    }
    else{
      console.log('events obtained!');
      return data;
    }
    ;
}

function displayTable(schedule){
  let row, begin, end, repeat, e_id;
  let tableBody = document.getElementById("tableBody");
  let tr = document.createElement("tr");
  document.getElementById("tableBody").innerHTML = ``;
  for(let i = 0; i < schedule.length; i++){
    begin = new Date(schedule[i].time_begin).toLocaleString();
    end = new Date(schedule[i].time_end).toLocaleString();
    repeat = schedule[i].state;
    if(repeat == "once"){
      repeat = "Once";
    }
    else{
      repeat = "Weekly";
    }
    e_id = schedule[i].event_id;
    row = `<tr><td>${begin}</td><td>${end}</td><td>${repeat}</td><td>${e_id}</td><td><button id="remove${e_id}" type="submit" class="btn btn-primary">Remove</button></td></tr>`;
    document.getElementById("tableBody").insertAdjacentHTML("beforeend", row);

  }
}
var funcForm = function insAddEventForm(e){
  e.preventDefault();
  const personID = uID;
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
async function refreshTable(){
  uID = await qryID();
  schedule = await qryAvailabilityByID(uID);
  displayTable(schedule);
}
var funcRemoveForm = function insRemoveEventForm(e){
  e.preventDefault();
  const e_id = document.getElementById("removeID").value;
  insRemoveEvent(e_id, uID);
}
var funcRemoveShortcut = function insRemoveEventShortcut(e){
  e.preventDefault();
  let target = e.target;
  target = target.id.slice(6);
  console.log(target);
  insRemoveEvent(target, uID);
}


document.getElementById("timeAddButton").addEventListener("click", funcForm)
document.getElementById("refreshButton").addEventListener("click", refreshTable)
document.getElementById("removeButton").addEventListener("click", funcRemoveForm)
document.getElementById("tableBody").addEventListener("click", funcRemoveShortcut)

let uID;
let schedule;
(async () => {
  uID = await qryID();
  console.log('uID:', uID);
  schedule = await qryAvailabilityByID(uID);
  console.log('schedule:', schedule);
  displayTable(schedule);
})();

