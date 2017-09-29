const Discord = require('Discord.js');
const client = new Discord.Client();

//=======================================================================================================================

//Classes
class Event{
    constructor(bol1, bol2, Date1) {
    this.time     = Date1;
    this.passed   = false;
    this.roof;
    this.str      = [];
    this.counter  = 0;
    this.isRaid   = bol1;
    this.isActive = bol2
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
var Monday    = new Event(false, true,  new Date(2017, 8, 4,  19).getTime());
var Tuesday   = new Event(false, true,  new Date(2017, 8, 5,  20).getTime());
var Wednesday = new Event(true,  true,  new Date(2017, 8, 6,  20).getTime());
var Thursday  = new Event(false, true,  new Date(2017, 8, 7,  20).getTime());
var Friday    = new Event(true,  false, new Date(2017, 8, 8,  20).getTime());
var Saturday  = new Event(false, false, new Date(2017, 8, 9,  21).getTime());
var Sunday    = new Event(true,  true,  new Date(2017, 8, 10, 19).getTime());

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
        Event.time 	  += 604800000;
        Event.passed  = false;
        Event.str 	  = [];
        Event.counter = 0;
}

function roofupdate(Event) {
    Event.roof = Event.time + 3600000;
}

function announce(Event) {    
    if (current >= Event.time && Event.roof >= current && Event.passed === false && Event.isActive == true){
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

function addperson(Event, message, string){
    var t = " <@" + string + ">";
    Event.str.push(t);
    message.channel.send('Added User: ' + Event.str[Event.counter]);
    Event.counter++;
}

function displayRoster(Event, message, string){
    var tempString = string;
    if (Event.str.length>0){
        message.delete();
        message.channel.send('Current roster for ' + tempString + ": " + Event.str);
    }
    else{
        message.delete();
        message.channel.send('No one is signed up for ' + tempString);
    }
}


function turnon(Event, message){
    Event.isActive = true;
    message.channel.send('Event is now enabled')
}

function turnoff(Event, message){
    Event.isActive = false;
    message.channel.send('Event is now disabled')
}

//=======================================================================================================================

//comment for when the bot is ready
client.on('ready',() => {
    console.log('Status:Online');
     client.user.setGame('main version');
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

    //help
    if (commandIs("help", message)) {
        message.delete();
        message.channel.send('```\nCurrent list of Commands:\n!about          	- information about the Bot\n!roll [D#] [X]  	- Rolls a D# sided die X amount of times\n!roster [Day/Event] - Shows the current roster for the given event\n```');
        
        if (hasRole(message.member, "Officers")){
        	message.channel.send('```\nCurrent list of Officer commands:\n!add [userID] [Day/Event]   - Adds a person to the roster for Sunday\n!postprone          		- Cancels the planned meeting for the day\n!meeting            		- Announces a meeting for the day\n!enable [Day/Event]		 - Enable an event\n!disable [Day/Event]		- Disable an event\n```');
        }
    }

    //about
    if (commandIs("about", message)) {
        message.delete();
        message.channel.send('', new Discord.Attachment('div/toptem.jpg'));
        setTimeout(function(){
            message.channel.send('Hello! Im RaidBot! \nMy purpose is to handle and announce events.\nUse ``!help`` to get the list of commands');
        }, 500);
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

    //Enable
    if (commandIs("enable", message)) {
        if(hasRole(message.member, "Officers")){
        	var args = message.content.split(/[ ]+/);

        	if (args[1]=="monday"){
            	turnon(Monday, message);
        	}

	        else if (args[1]=="tuesday"){
	            turnon(Tuesday, message);
	        }

	        else if (args[1]=="wednesday"){
	            turnon(Wednesday, message);
	        }

	        else if (args[1]=="thursday"){
	            turnon(Thursday, message);
	        }

	        else if (args[1]=="friday"){
	            turnon(Friday, message);
	        }

	        else if (args[1]=="saturday"){
	            turnon(Saturday, message);
	        }

	        else if (args[1]=="sunday"){
	            turnon(Sunday, message);
	        }

	        else{
	            message.channel.send('No defined argument or not a valid argument');
	        }
    	}
    	else {
    		message.channel.send('Only officers can use this command');
    	}
    }

    //Disable
    if (commandIs("disable", message)) {
        if(hasRole(message.member, "Officers")){
	        var args = message.content.split(/[ ]+/);

	        if (args[1]=="monday"){
	            turnoff(Monday, message);
	        }

	        else if (args[1]=="tuesday"){
	            turnoff(Tuesday, message);
	        }

	        else if (args[1]=="wednesday"){
	            turnoff(Wednesday, message);
	        }

	        else if (args[1]=="thursday"){
	            turnoff(Thursday, message);
	        }

	        else if (args[1]=="friday"){
	            turnoff(Friday, message);
	        }

	        else if (args[1]=="saturday"){
	            turnoff(Saturday, message);
	        }

	        else if (args[1]=="sunday"){
	            turnoff(Sunday, message);
	        }

	        else{
	            message.channel.send('No defined argument or not a valid argument');
	        }
    	}
    	else {
    		message.channel.send('Only Officers can use this command');
    	}
    }

    //Display roster for given date
    if (commandIs("roster", message)){
        var args = message.content.split(/[ ]+/);
        var ts = args[1];

        if (ts == "monday"){
            displayRoster(Monday, message, ts);
        }

        else if (ts == "tuesday"){
            displayRoster(Tuesday, message, ts);
        }

        else if (ts == "wednesday"){
            displayRoster(Wednesday, message, ts);
        }

        else if (ts == "thursday"){
            displayRoster(Thursday, message, ts);
        }

        else if (ts == "friday"){
            displayRoster(Friday, message, ts);           
        }

        else if (ts == "saturday"){
            displayRoster(Saturday, message, ts);
        }

        else if (ts == "sunday"){
            displayRoster(Sunday, message, ts);
        }

        else {
            message.channel.send('Not valid argument or undefined argument');
        }
    }

	//Command for adding people to a given event   
    if (commandIs("add", message)){
        if (hasRole(message.member, "Officers")){
            var args = message.content.split(/[ ]+/); 
            st = args[1];
            day = args[2];

            if (day == "monday"){
                addperson(Monday, message, st);
            }

            else if (day == "tuesday"){
                addperson(Tuesday, message, st);
            }

            else if (day == "wednesday"){
                addperson(Wednesday, message, st);
            }

            else if (day == "thursday"){
                addperson(Thursday, message, st);
            }

            else if (day == "friday"){
                addperson(Friday, message, st);
            }

            else if (day == "saturday"){
                addperson(Saturday, message, st);
            }

            else if (day == "sunday"){
                addperson(Sunday, message, st);
            }

            else {
                message.channel.send('Undefined arguments or invalid arguments')
            }

        }

        else {
            message.delete();
            message.channel.send('Only Officers can use this command'); 
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
                message.channel.send('Rolled' + numbers);
            }
            else {
                message.channel.send('inputs either too large or not valid inputs');
            }           
        }
        else if (args.length = 2){
            if (args[1] <= 1000) {
                random = Math.floor((Math.random() * dice) + 1);
                numbers.push(random);
                message.channel.send('Rolled ' + numbers);
            }
            else {
                message.channel.send('input either too large or not a valid input');
            }
        }
        else {
            message.channel.send('not enough inputs');
        }       
    }
});

//=======================================================================================================================

setInterval(function () {
    var temp = new Date().getTime();
    current  = temp;

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