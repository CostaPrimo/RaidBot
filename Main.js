const Discord = require('Discord.js');
const client = new Discord.Client();

//=======================================================================================================================

//Classes
class Event{
    constructor(bol, Date1) {
    this.time    = Date1;
    this.passed  = false;
    this.roof;
    this.str     = [];
    this.counter = 0;
    this.isRaid  = bol;
    } 
}

//=======================================================================================================================

//Channels
var OfFo        = '351305574811697153';
var general     = '247811095115333632';
var testchannel = '342715779491299328';
var raiding     = '321707816199127041';

//=======================================================================================================================

//Events + Dates
var Monday    = new Event(false,  new Date(2017, 8, 4,  19).getTime());
var Tuesday   = new Event(false, new Date(2017, 8, 5,  20).getTime());
var Wednesday = new Event(true,  new Date(2017, 8, 6,  20).getTime());
var Thursday  = new Event(false, new Date(2017, 8, 7,  20).getTime());
var Friday    = new Event(true,  new Date(2017, 8, 8,  20).getTime());
var Saturday  = new Event(true, new Date(2017, 8, 9,  21).getTime());
var Sunday    = new Event(true,  new Date(2017, 8, 10, 19).getTime());

//=======================================================================================================================

//Reset Stuff
var reset   = new Date(2017, 8, 10, 23, 59).getTime();
var current = new Date().getTime();

//=======================================================================================================================

//function for commands
function commandIs(str, msg){
    return msg.content.toLowerCase().startsWith("!" + str);
}

//Find roles for permissions
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role) {
    if (pluck(mem.roles).includes(role)) {
        return true;
    }
    else {
        return false;
    }
}

function newtime(Event) {
        Event.time += 604800000;
        Event.passed = false;
        Event.str = [];
        Event.counter = 0;
}

function roofupdate(Event) {
    Event.roof = Event.time + 3600000;
}

function announce(Event) {    
    if (current >= Event.time && Event.roof >= current && Event.passed === false){
        if (Event.isRaid === true) {
            client.channels.get(general).send('Raid starting in 1 hour!' + Event.str);
            Event.passed = true;
        }
        else {
            client.channels.get(general).send('Guild Missions starting in 1 hour');
            Event.passed = true;
        }    
    }
}

function meeting(Event) {
    if (current >= Event.time && Event.roof >= current && Event.passed === false){
            client.channels.get(OfFo).send('Meeting is starting @everyone');
            Event.passed = true;
        }
}

function addperson(Event, message){
            var t = "";
            var args = message.content.split(/[ ]+/);
            t = " <@" + args[1] + ">";
            Event.str.push(t);
            message.channel.send('Added User: ' + Event.str[Event.counter]);
            Event.counter++;
}

//=======================================================================================================================

//comment for when the bot is ready
client.on('ready',() => {
    console.log('Status:Online');
});

//=======================================================================================================================

//commands
client.on('message', message => {

    //Testcommand
    if (commandIs("test", message)) {
        if (hasRole(message.member, "Officers")) {
            message.delete();
            message.channel.send("Not Broken");
        }
        else {
            message.channel.send('Broken');
        }
    }
    //RANK
    if (commandIs("rank", message)) {
        message.delete();
        message.channel.send('Add it in');
    }

    //postprone meeting
    if (commandIs("postprone", message)) {
        if (hasRole(message.member, "Officers")) {
            message.delete();
            client.channels.get(OfFo).send("´´Meeting moved to tomorrow after Guild Missions´´ @everyone");
            Monday.passed = true;
        }
        else {
            message.delete();
            message.channel.send('Officer Rank required to execute the command');
        }
    }
    //Emergency meeting
    if (commandIs("meeting", message)) {
        if (hasRole(message.member, "Officers")) {
            message.delete();
            client.channels.get(OfFo).send("´´Meeting tonight at 19:00 server time´´ @everyone");
        }
        else {
            message.delete();
            message.channel.send('Officer Rank required to execute the command');
        }
    }


    //Command for adding people wednesday
    if (commandIs("addwed", message)) {
        if (hasRole(message.member, "Officers")) {
            message.delete();
            addperson(Wednesday);
        }
        else {
            message.delete();
            message.channel.send('Only Officers can use this command');
        }
    }
    //command for checking people assigned to wednesday
     if (commandIs("wednesday", message)) {
        if (Wednesday.str.length>0){
            message.delete();
            message.channel.send('Current roster for Wednesday:' + Wednesday.str);
        }
        else{
            message.delete();
            message.channel.send('No one is signed up for Wednesday')
        }
    }



    //Command for adding people sunday
    if (commandIs("addsun", message)) {
        if(hasRole(message.member,"Officers")) {
            message.delete();
            addperson(Sunday);
        }
        else {
            message.delete();
            message.channel.send('Only Officers can use this command');
        }
    }
    //command for checking people assigned to sunday
     if (commandIs("sunday", message)) {
        if (Sunday.str.length>0){
            message.delete();
            message.channel.send('Current roster for Sunday: ' + Sunday.str);
        }
        else{
            message.delete();
            message.channel.send('No one is signed up for Sunday')
        }
    }

//=======================================================================================================================

    //ROLL FUNCTION...
    if (commandIs("roll", message)) {
        var n = 1;
        var random = 0;
        var numbers = [];
        var args = message.content.split(/[ ]+/);
        var dice = args[1];
        var amount = 0;
        amount = args[2];

        if (args.length > 2) {
            if (args[2]<=100 && args[1]<=100){        
                while (amount >= n) {
                    random = Math.floor((Math.random() * dice) + 1);
                    numbers.push(" " + random);
                    n++;
                }
                message.channel.sendMessage('Rolled' + numbers);
            }
            else {
                message.channel.sendMessage('inputs either too large or not valid inputs');
            }           
        }
        else if (args.length = 2){
            if (args[1] <= 1000) {
                random = Math.floor((Math.random() * dice) + 1);
                numbers.push(random);
                message.channel.sendMessage('Rolled ' + numbers);
            }
            else {
                message.channel.sendMessage('input either too large or not a valid input');
            }
        }
        else {
            message.channel.sendMessage('not enough inputs');
        }       
    }
});

//=======================================================================================================================

setInterval(function () {
    var temp = new Date().getTime();
    current = temp;

    //RESET RESET RESET RESET RESET RESET RESET RESET RESET RESET
    if (current > reset) {
        newtime(Monday);
        newtime(Tuesday);
        newtime(Wednesday);
        newtime(Thursday);
        newtime(Friday);
        newtime(Saturday);
        newtime(Sunday);

        reset += 604800000;
    }

    else if (current < reset) {
        roofupdate(Monday);
        roofupdate(Tuesday);
        roofupdate(Wednesday);
        roofupdate(Thursday);
        roofupdate(Friday);
        roofupdate(Saturday);
        roofupdate(Sunday);

        meeting(Monday);
        announce(Tuesday);
        announce(Wednesday);
        announce(Thursday);
        announce(Friday);
        meeting(Saturday);
        announce(Sunday);
    }
    
}, 10000);

//=======================================================================================================================

//HERE BE TOKEN
client.login('MjkzMzg1NDU1OTMwNzAzODcz.C7F0DA.RhECkZEOwYmV9EVykFRJKAu8bt4');