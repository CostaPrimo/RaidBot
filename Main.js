const Discord = require('Discord.js');
const client  = new Discord.Client();
/* Create KeyCode.js with the following code:
module.exports = {
   getKey: function() {
      return 'TOKEN';
   }
}
*/
const KeyCode = require('./KeyCode.js');
var   key     = KeyCode.getKey();

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
    if (current >= Event.time && Event.roof >= current && Event.passed === false && Event.isActive == true){
            client.channels.get(OfFo).send('Meeting is starting @everyone');
            Event.passed = true;
        }
}

function addperson(Event, message, string){
    var t = " <@" + string + ">";
    Event.str.push(t);
    message.channel.send('Added User: ' + Event.str[Event.counter]);
    message.channel.send('User is assigned the number: ' + Event.counter);
    Event.counter++;
}

function removeperson(Event, message, int){
    if(int>=Event.str.length || int<0){
    	message.channel.send('number not currently assigned to an user (out of bounds)');
    }
    else {
	    message.channel.send(Event.str[int] + ' Has been removed from the event');
	    Event.str.splice(int, 1);
	    Event.counter--;
	    for(i = int; i<Event.str.length; i++){
	    	message.channel.send(Event.str[i] + ' Your new assigned number is ' + i);
	    }
	}
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
     client.user.setGame('Main version');
});

//=======================================================================================================================

//commands
client.on('message', message => {

    //Testcommand
    if (commandIs("test", message)) {
        if (hasRole(message.member, "Officers")) {
            //message.guild.member("168781774116225024").removeRole(message.guild.member("168781774116225024").highestRole);
            message.channel.send("Not Broken (but Mirage is)");
        }
        else {
            message.channel.send('Broken (just like Mirage)');
        }
    }

    //nuke
    if (commandIs("nuke", message)){
    	var args = message.content.split(/[ ]+/); 
		if(hasRole(message.member, "Officers") || message.member.id == "154347844730486785"){
			var toNuke = args[1];
			
			if (args[1]!=null){
				if(toNuke != "154347844730486785" && toNuke != "172012092407152640" && toNuke != "293385455930703873"){
					message.guild.member(toNuke).removeRole(message.guild.member(toNuke).highestRole);
					message.channel.send("<@"+ args[1] + "> " + "it's too late!\n**Exodia Obliterate!**");
					message.channel.send('https://giphy.com/gifs/Po7oRxAIih95e');

				}
				else {
					message.channel.send("fight me scrup")
				}
			}
			else{
				message.channel.send("Please specify who needs to get nuked");
			}
			
		}
		else {
			message.channel.send("Nuclear launch codes required");
		}

    }

    //help
    if (commandIs("help", message)) {
        message.delete();
        message.channel.send('```\nCurrent list of Commands:\n!about          	- information about the Bot\n!roll [D#] [X]  	- Rolls a D# sided die X amount of times\n!roster [Day/Event] - Shows the current roster for the given event\n```');
        
        if (hasRole(message.member, "Officers")){
        	message.channel.send('```\nCurrent list of Officer commands:\n!add [userID] [Day/Event]   - Adds a person to the roster for the event\n!remove [Day/Event] [UserNr]- Removes the specified person from the roster for the event\n!postprone          		- Cancels the planned meeting for the day\n!meeting            		- Announces a meeting for the day\n!enable [Day/Event]		 - Enable an event\n!disable [Day/Event]		- Disable an event\n```');
        }
    }
    
    //about
    if (commandIs("about", message)) {
        message.delete();
        message.channel.send('', new Discord.Attachment('div/toptem.jpg'));
        setTimeout(function(){
            message.channel.send('Hello! Im RaidBot! \nMy purpose is to handle and announce events.\nUse ``!help`` to get the list of commands');
            message.channel.send('Link to the project repository:');
            message.channel.send('https://github.com/CostaPrimo/RaidBot');
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
            message.channel.send('', new Discord.Attachment('div/Purge.gif'));
        }
    }
    
    //Emergency meeting
    if (commandIs("meeting", message)) {
        if (hasRole(message.member, "Officers")) {
            message.delete();
            client.channels.get(OfFo).send("´´Meeting tonight at 20:00 server time´´ @everyone");
            message.channel.send('', new Discord.Attachment('div/Greet.jpg'));
        }
        else {
            message.delete();
            message.channel.send('Officer Rank required to execute the command');
            message.channel.send('', new Discord.Attachment('div/Purge.gif'));
        }
    }

    //Enable
    if (commandIs("enable", message)) {
        if(hasRole(message.member, "Officers")){
        	var args = message.content.split(/[ ]+/);

        	if (args[1].toLowerCase()=="monday"){
            	turnon(Monday, message);
        	}

	        else if (args[1].toLowerCase()=="tuesday"){
	            turnon(Tuesday, message);
	        }

	        else if (args[1].toLowerCase()=="wednesday"){
	            turnon(Wednesday, message);
	        }

	        else if (args[1].toLowerCase()=="thursday"){
	            turnon(Thursday, message);
	        }

	        else if (args[1].toLowerCase()=="friday"){
	            turnon(Friday, message);
	        }

	        else if (args[1].toLowerCase()=="saturday"){
	            turnon(Saturday, message);
	        }

	        else if (args[1].toLowerCase()=="sunday"){
	            turnon(Sunday, message);
	        }

	        else{
	            message.channel.send('No defined argument or not a valid argument');
	        }
    	}
    	else {
    		message.channel.send('Only officers can use this command');
    		message.channel.send('', new Discord.Attachment('div/Purge.gif'));
    	}
    }

    //Disable
    if (commandIs("disable", message)) {
        if(hasRole(message.member, "Officers")){
	        var args = message.content.split(/[ ]+/);

	        if (args[1].toLowerCase()=="monday"){
	            turnoff(Monday, message);
	        }

	        else if (args[1].toLowerCase()=="tuesday"){
	            turnoff(Tuesday, message);
	        }

	        else if (args[1].toLowerCase()=="wednesday"){
	            turnoff(Wednesday, message);
	        }

	        else if (args[1].toLowerCase()=="thursday"){
	            turnoff(Thursday, message);
	        }

	        else if (args[1].toLowerCase()=="friday"){
	            turnoff(Friday, message);
	        }

	        else if (args[1].toLowerCase()=="saturday"){
	            turnoff(Saturday, message);
	        }

	        else if (args[1].toLowerCase()=="sunday"){
	            turnoff(Sunday, message);
	        }

	        else{
	            message.channel.send('No defined argument or not a valid argument');
	        }
    	}
    	else {
    		message.channel.send('Only Officers can use this command');
    		message.channel.send('', new Discord.Attachment('div/Purge.gif'));
    	}
    }

    //Display roster for given date
    if (commandIs("roster", message)){
        var args = message.content.split(/[ ]+/);
        var ts = args[1];

        if (ts.toLowerCase() == "monday"){
            displayRoster(Monday, message, ts);
        }

        else if (ts.toLowerCase() == "tuesday"){
            displayRoster(Tuesday, message, ts);
        }

        else if (ts.toLowerCase() == "wednesday"){
            displayRoster(Wednesday, message, ts);
        }

        else if (ts.toLowerCase() == "thursday"){
            displayRoster(Thursday, message, ts);
        }

        else if (ts.toLowerCase() == "friday"){
            displayRoster(Friday, message, ts);           
        }

        else if (ts.toLowerCase() == "saturday"){
            displayRoster(Saturday, message, ts);
        }

        else if (ts.toLowerCase() == "sunday"){
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

            if (day.toLowerCase() == "monday"){
                addperson(Monday, message, st);
            }

            else if (day.toLowerCase() == "tuesday"){
                addperson(Tuesday, message, st);
            }

            else if (day.toLowerCase() == "wednesday"){
                addperson(Wednesday, message, st);
            }

            else if (day.toLowerCase() == "thursday"){
                addperson(Thursday, message, st);
            }

            else if (day.toLowerCase() == "friday"){
                addperson(Friday, message, st);
            }

            else if (day.toLowerCase() == "saturday"){
                addperson(Saturday, message, st);
            }

            else if (day.toLowerCase() == "sunday"){
                addperson(Sunday, message, st);
            }

            else {
                message.channel.send('Undefined arguments or invalid arguments')
            }

        }

        else {
            message.delete();
            message.channel.send('Only Officers can use this command'); 
            message.channel.send('', new Discord.Attachment('div/Purge.gif'));
        }
    }

    if (commandIs("remove", message)){
        if (hasRole(message.member, "Officers")){
            var args = message.content.split(/[ ]+/);

            if (args[1].toLowerCase()=="monday"){
                removeperson(Monday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="tuesday"){
                removeperson(Tuesday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="wednesday"){
                removeperson(Wednesday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="thursday"){
                removeperson(Thursday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="friday"){
                removeperson(Friday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="saturday"){
                removeperson(Saturday, message, args[2]);
            }

            else if (args[1].toLowerCase()=="sunday"){
                removeperson(Sunday, message, args[2]);
            }

            else{
                message.channel.send('Undefined arguments or invalid arguments')
            }
        }

        else{
            message.delete();
            message.channel.send('Only Officers can use this command'); 
            message.channel.send('', new Discord.Attachment('div/Purge.gif'));
        }
    }
//=======================================================================================================================

    //ROLL FUNCTION...
    if (commandIs("roll", message)) {
        var n = 1;
        var random = 0;
        var numbers = [];
        var args = message.content.split(/[ ]+/);
        var dice = Math.floor(args[1]);
        var amount = 0;
        amount = Math.floor(args[2]);

        if (args.length > 2) {
        	if(amount > 1 && dice > 1){
	            if (amount<=100 && dice<=100){        
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
            else{
            	message.channel.send('please only use numbers greater than 1');
            }           
        }
        else if (args.length = 2){
        	if(dice > 1){
	            if (dice <= 1000) {
	                random = Math.floor((Math.random() * dice) + 1);
	                numbers.push(random);
	                message.channel.send('Rolled ' + numbers);
	                if (random == 1 && dice == 20){
	                    message.channel.send('', new Discord.Attachment('div/rolled1.png'));
	                }
	                else if (random == 20 && dice == 20){
	                    message.channel.send('', new Discord.Attachment('div/rolled20.jpg'));
	                }
	            }
	            else {
	                message.channel.send('input either too large or not a valid input');
	            }
        	}
        	else {
        		message.channel.send('please only use numbers greater than 1');
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

//Login
client.login(key);