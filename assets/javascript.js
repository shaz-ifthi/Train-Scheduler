var config = {
    apiKey: "AIzaSyCvHMN7v_3MT5BQN-6JvABQ9e8Rv3iJP_c",
    authDomain: "train-scheduler-85af2.firebaseapp.com",
    databaseURL: "https://train-scheduler-85af2.firebaseio.com",
    projectId: "train-scheduler-85af2",
    storageBucket: "train-scheduler-85af2.appspot.com",
    messagingSenderId: "955538316909"
};
firebase.initializeApp(config)
var database = firebase.database()
var users = database.ref('/users')
var destination
var train_dest
var train_name
var first_train
var frequency = $("#frequency").val().trim();

$('#submitBTN').on('click', function (event) {

    event.preventDefault()
    var name = $("#trainName").val().trim()
    destination = $("#destination").val().trim()
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim()
    clearSearch()
    users.push({
        train_name: name,
        train_dest: destination,
        first_train: firstTrain,
        train_freq: frequency
        //number: number
    })

    retrieve_train()
  

   

})
function retrieve_train() {
    var first = true

    users.orderByChild('train_name').limitToLast(1).on('child_added', function (snap) {
        // console.log(snap.val().train_name)
        if (first === true) {

            var firstTrain = snap.val().first_train;
            var trainFreq = snap.val().train_freq;
            // Normalize firstTrain time
            var firstTrainNormalized = moment(firstTrain, "hh:mm").subtract(1, "years");
            // time right now
            var timeNow = moment();
            first = false
            // delta between the current time and time of the first train in minutes
            var deltaTime = moment().diff(moment(firstTrainNormalized), "minutes");
            // Time remaining
            var timeRem = deltaTime % trainFreq;
            // time in minutes before next train
            var minBeforeNxtTrain = trainFreq - timeRem;
            // next train arrival time
            var nxtArrivalTimeRaw = moment().add(minBeforeNxtTrain, "minutes");
            var nxtArrivalTime = moment(nxtArrivalTimeRaw).format("hh:mma")
            // console.log("Next Arrival Time: " + nxtArrivalTime);
            $("tbody").append("<tr><td>" + snap.val().train_name + "</td><td>" + snap.val().train_dest + "</td><td>" + snap.val().train_freq + "</td><td>" + nxtArrivalTime + "</td><td>" + minBeforeNxtTrain)

        }
    })
}

//Function to Clear search field when submit button is clicked
function clearSearch() {
    // console.log("calling clear search")
    $("#trainName").val("")
    $("#destination").val("")
    $("#firstTrain").val("")
    $("#frequency").val("")

}
