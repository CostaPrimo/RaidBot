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

//Emojis
const fugg = client.emojis.get('451380385637466112');

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
var Monday    = new Event(false, false,  new Date(2018, 3, 17,  19).getTime());
var Tuesday   = new Event(false, false,  new Date(2018, 3, 17,  20).getTime());
var Wednesday = new Event(true,  false,  new Date(2018, 3, 18,  20).getTime());
var Thursday  = new Event(false, false,  new Date(2018, 3, 19,  20).getTime());
var Friday    = new Event(true,  false, new Date(2018, 3, 20,  20).getTime());
var Saturday  = new Event(false, false, new Date(2018, 3, 21,  21).getTime());
var Sunday    = new Event(true,  false,  new Date(2018, 3, 22, 19).getTime());

var eventArray = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday];
var eventNameArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

//=======================================================================================================================

//Reset Stuff
var reset   = new Date(2017, 11, 10, 23, 59).getTime();
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

    if(message.member.id == "155095438821687297"){
        var msgContent = message.content;
        if (msgContent.includes("toads")){
            //message.delete();
            message.channel.send('<:ToadsDude:419058681532121098> <:ToadsDude:419058681532121098> <:ToadsDude:419058681532121098> <:ToadsDude:419058681532121098> <:ToadsDude:419058681532121098>');
        }
    }

    if(message.content.includes("<@&419835510580576258>")){
        message.channel.send("get in here!", new Discord.Attachment('div/fractals.png'));
    }

    if(message.content.includes("<:notlikecat:448400158045110273>")){
        message.channel.send("<:eelsbadman:448399989148876810>");
    }

    if(message.content.includes("<:eelsbadman:448399989148876810>") && message.member.id != "293385455930703873"){
        message.channel.send("<:KMS:449189503555469312>");
    }

    if(message.content.toLowerCase().includes("get fucked")){
        message.channel.send("<:EZ:440811436566904835><:stolenclap:449191229452976129>");
    }

    if(message.content.toLowerCase().includes("netto")){
        message.channel.send("fucking rodebutik <:begonereee:449163481724354561>");
    }

    if(message.content.toLowerCase().includes("shit bot")){
        message.channel.send('fight me', new Discord.Attachment('div/hoinoon.jpg'));
    }

    //Testcommand
    if (commandIs("test", message)) {
        if (hasRole(message.member, "Interface") || hasRole(message.member, "RaidBOT")) {
            //message.guild.member("168781774116225024").removeRole(message.guild.member("168781774116225024").highestRole);
            //message.channel.send("Not Broken (but Mirage is)");
            
            /*
            message.channel.send("<@"+message.member.id+"> was here",{embed: {
                //color: 3444123,
                color: 0xffffff,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL
                },
                title: "This is a joke",
                url: "http://nyan.cat",
                description: "RaidDoge",
                fields: [{
                    name: "LI:",
                    value: "Much LI"
                  },
                  {
                    name: "Status:",
                    value: "Such Pro"
                  },
                  {
                    name: "Evaluation:",
                    value: "WOW"
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: "RollBot"
                }
            }
            });
            */

            //message.channel.send('${fugg} fugg :D');
            message.channel.send('<@&467015849669034004>');
        }
        else {
            message.channel.send('Broken (just like Mirage)');
        }
    }

    //nuke
    if (commandIs("nuke", message)){
    	var args = message.content.split(/[ ]+/); 
		if(hasRole(message.member, "Interface") || message.member.id == "154347844730486785"){
			var toNuke = args[1];
			
			if (args[1]!=null){
				if(toNuke != "154347844730486785" && toNuke != "172012092407152640" && toNuke != "293385455930703873"){
					message.guild.member(toNuke).removeRole(message.guild.member(toNuke).highestRole);
					message.channel.send("<@"+ args[1] + "> " + "\n**NUCLEAR LAUNCH DETECTED!**");
					message.channel.send('https://www.tenor.co/HUPX.gif ');

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
        message.channel.send('```\nCurrent list of Commands:\n!about          	- information about the Bot\n!roll [X]D[Y]  	- Rolls a Y sided die X amount of times\n!roster [Day/Event] - Shows the current roster for the given event\n```');
        
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

            for(var x = 0; x<eventNameArray.length;x++){
                var eventName = eventNameArray[x];
                if(args[1].toLowerCase() == eventName){
                    turnon(eventArray[x], message);
                    break;
                }
                else if(x==eventNameArray.length-1){
                    message.channel.send('No events matching the given argument');
                }
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

            for(var x = 0; x<eventNameArray.length;x++){
                var eventName = eventNameArray[x];
                if(args[1].toLowerCase() == eventName){
                    turnoff(eventArray[x], message);
                    break;
                }
                else if(x==eventNameArray.length-1){
                    message.channel.send('No events matching the given argument');
                }
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

        for(var x = 0; x<eventNameArray.length;x++){
                var eventName = eventNameArray[x];
                if(ts.toLowerCase() == eventName){
                    displayRoster(eventArray[x], message, ts);
                    break;
                }
                else if(x==eventNameArray.length-1){
                    message.channel.send('No events matching the given argument');
                }
        }
    }

	//Command for adding people to a given event   
    if (commandIs("add", message)){
        if (hasRole(message.member, "Officers")){
            var args = message.content.split(/[ ]+/); 
            st = args[1];
            day = args[2];

            for(var x = 0; x<eventNameArray.length;x++){
                var eventName = eventNameArray[x];
                if(day.toLowerCase() == eventName){
                    addperson(eventArray[x], message, st);
                    break;
                }
                else if(x==eventNameArray.length-1){
                    message.channel.send('No events matching the given argument');
                }
            }
        }

        else {
            message.delete();
            message.channel.send('Only Officers can use this command', new Discord.Attachment('div/Purge.gif'));
        }
    }

    if (commandIs("remove", message)){
        if (hasRole(message.member, "Officers")){
            var args = message.content.split(/[ ]+/);

            for(var x = 0; x<eventNameArray.length;x++){
                var eventName = eventNameArray[x];
                if(args[1].toLowerCase() == eventName){
                    removeperson(eventArray[x], message, args[2]);
                    break;
                }
                else if(x==eventNameArray.length-1){
                    message.channel.send('No events matching the given argument');
                }
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
        var rolls = [];
        var args = message.content.split(/[ ]+/);
        if (args.length!=2){
            message.channel.send('How to Roll:\n```Use !roll [X]D[Y] to roll\nX = amount of rolls\nY = Die type (D4, D6, D8..)\nExample: !roll 6D20```');
        }
        else{
            var dievalues = [];
            //if(args[1].toLowerCase().split("d").length==2){
            dievalues = args[1].toLowerCase().split("d");
            //}
            
            if(dievalues.length!=2){
                message.channel.send('Please use the proper roll format\n```Use !roll [X]D[Y] to roll\nX = amount of rolls\nY = Die type (D4, D6, D8..)\nExample: !roll 6D20```');
            }

            else{
                if (dievalues[0]==1 && dievalues[1]==20){
                    var RNG = Math.floor(Math.random()*20)+1;
                    if(RNG ==1){
                        message.channel.send('CRITICAL FAILURE', new Discord.Attachment('div/rolled1.PNG'));
                    }
                    else if(RNG == 20){
                        message.channel.send('OVERWHELMING SUCCESS', new Discord.Attachment('div/rolled20.JPG'));
                    }
                    else{
                        message.channel.send('you rolled: '+ RNG);
                    }
                }
                else if(dievalues[0]>0 && dievalues[0]<1000 && dievalues[1]>0 && dievalues[1]<1000){
                    for(var n = 1; n<=dievalues[0];n++){
                        rolls.push(Math.floor(Math.random()*dievalues[1])+1);
                    }
                    var sum = 0;
                    for(var x= 0; x<rolls.length; x++){
                        sum += rolls[x];
                    }

                    if (rolls.length>100){
                        var output = [];
                        var i = 0;
                        
                        while(i<rolls.length){
                            var placeholder = "";
                            for(var x = 1; x<=100; x++){
                                placeholder += rolls[i] + ", ";
                                i++;
                                if(i==rolls.length){
                                    break;
                                }
                            }
                            output.push(placeholder);
                        }
                        message.channel.send('You have rolled:');
                        for(var y = 0; y<output.length;y++){
                            message.channel.send(output[y]);
                        }
                        setTimeout(function(){
                            message.channel.send('your total is: ' + sum);
                        }, 2000);
                    }
                    else{                  
                        message.channel.send('you rolled: ' + rolls);
                        message.channel.send('your total is: ' + sum);
                    }
                }
                else if (dievalues[0]<0 || dievalues[1]<0){
                    message.channel.send('Please only use positive numbers');
                }
                else if (dievalues[0]>=1000 || dievalues[1]>=1000){
                    message.channel.send('Please only use numbers lower than 1000');
                }
                else{
                    message.channel.send('Input error');
                }
            }
        }      
    }

});

//=======================================================================================================================

setInterval(function () {
    var temp = new Date().getTime();
    current  = temp;

    //RESET RESET RESET RESET RESET RESET RESET RESET RESET RESET
    if (current > reset) {
        for(var x=0;x<eventArray.length;x++){
            newtime(eventArray[x]);
        }

        reset += 604800000;
    }

    else if (current < reset) {
        for(var x=0;x<eventArray.length;x++){
            roofupdate(eventArray[x]);
        }

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