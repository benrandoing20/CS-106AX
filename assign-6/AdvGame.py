# File: AdvGame.py

"""
This module defines the AdvGame class, which records the information
necessary to play a game.
"""

from AdvRoom import AdvRoom
from AdvObject import AdvObject
from tokenscanner import TokenScanner

###########################################################################
# Your job in this assignment is to fill in the definitions of the        #
# methods listed in this file, along with any helper methods you need.    #
# Unless you are implementing extensions, you won't need to add new       #
# public methods (i.e., methods called from other modules), but the       #
# amount of code you need to add is large enough that decomposing it      #
# into helper methods will be essential.                                  #
###########################################################################

# Constants
HELP_TEXT = [
    "Welcome to Adventure!",
    "Somewhere nearby is Colossal Cave, where others have found fortunes in",
    "treasure and gold, though it is rumored that some who enter are never",
    "seen again.  Magic is said to work in the cave.  I will be your eyes",
    "and hands.  Direct me with natural English commands; I don't understand",
    "all of the English language, but I do a pretty good job.",
    "",
    "It's important to remember that cave passages turn a lot, and that",
    "leaving a room to the north does not guarantee entering the next from",
    "the south, although it often works out that way.  You'd best make",
    "yourself a map as you go along.",
    "",
    "Much of my vocabulary describes places and is used to move you there.",
    "To move, try words like IN, OUT, EAST, WEST, NORTH, SOUTH, UP, or DOWN.",
    "I also know about a number of objects hidden within the cave which you",
    "can TAKE or DROP.  To see what objects you're carrying, say INVENTORY.",
    "To reprint the detailed description of where you are, say LOOK.  If you",
    "want to end your adventure, say QUIT."
]

class AdvGame:

    def __init__(self, prefix):
        """Reads the game data from files with the specified prefix."""
        self._prefix = prefix
        self._playerObjects = []

    def run(self):
        """Plays the adventure game stored in this object."""
        # The try/except block creates a dictionary with the rooms
        try:
            filename = self._prefix+"Rooms"
            with open(filename + ".txt") as f:
                rooms = self.readRooms(f)
        except IOError:
            print("Please enter a valid rooms name.")

        # The try/except block creates a dictionary with the objects
        try:
            filename = self._prefix+"Objects"
            with open(filename + ".txt") as f:
                objects = self.readObjects(f)
        except IOError:
            pass

        # The try/except block creates a dictionary with the synonyms
        try:
            filename = self._prefix+"Synonyms"
            with open(filename + ".txt") as f:
                synonyms = self.readSynonyms(f)
        except IOError:
            pass

        # The following code places objects in the correct starting room
        # or with the player
        for obj in objects:
            if (objects[obj].getInitialLocation() == "PLAYER"):
                self._playerObjects.append(objects[obj].getName())
            else:
                rooms[objects[obj].getInitialLocation()].addObject(objects[
                                                                       obj].getName())

        current = "OutsideBuilding"
        # a flag below to avoid reprinting room name after and action verb
        lastActionFlag = False
        force = False
        while current != "QUIT" and current != "EXIT":
            room = rooms[current]
            passages = room.getPassage()
            # The for loop below checks for force cases in the room passages
            for tup in passages:
                if tup[0] == 'FORCED' and tup[2] == None:
                    current = tup[1]
                    force = True
                    break
                elif tup[0] == 'FORCED':
                    if tup[2] in self._playerObjects:
                        current = tup[1]
                        force = True
                        break
            # The logic below print a room short on long name
            if not lastActionFlag:
                if room.hasBeenVisited():
                    print(room.getShortDescription())
                    for object in room.getContents():
                        print("There is " + objects[object].getDescription()
                            + " here.")
                else:
                    for line in room.getLongDescription():
                        print(line)
                    for objectName in room.getContents():
                        print("There is " + objects[objectName].getDescription() + " here.")
                    if force:
                        force = False
                        # lastActionFlag = True
                        continue
                room.setVisited(True)
            lastActionFlag = False

            # The code below reads user inputs into seperate token strings
            verbs = []
            objAction = ""
            userInput = TokenScanner(input("> ").strip().upper())
            while userInput.hasMoreTokens():
                token = userInput.nextToken()
                if token.isalpha():
                    verbs.append(token)
            verb = verbs[0]

            if verb in synonyms:
                verb = synonyms[verb]

            try:
                objAction = verbs[1]
            except IndexError:
                objAction = ""

            if verb == "QUIT":
                current = verb
                lastActionFlag = True
                continue
            elif verb == "HELP":
                for line in HELP_TEXT:
                    print(line)
                lastActionFlag = True
                continue
            elif verb == "LOOK":
                for line in room.getLongDescription():
                    print(line)
                lastActionFlag = True
                continue
            elif verb == "TAKE":
                if objAction in room.getContents():
                    self._playerObjects.append(objAction)
                    room.removeObject(objAction)
                    print("Taken.")
                    lastActionFlag = True
                else:
                    print(objAction + " not in room.")
                continue
            elif verb == "DROP":
                if objAction in self._playerObjects:
                    self._playerObjects.remove(objAction)
                    room.addObject(objAction)
                    print("Dropped.")
                    lastActionFlag = True
                else:
                    print(objAction + " not in player's possession.")
                continue
            elif verb == "INVENTORY":
                print("You are carrying:")
                for item in self._playerObjects:
                    print("\t" + objects[item].getDescription())
                lastActionFlag = True
                continue

            # if an action verb was not specified the next room is
            # determined in accordance with a rooms passages
            next = room.getNextRoom(verb, self._playerObjects)
            if next is None:
                print("I don't understand that response.")
            else:
                current = next

    def readRooms(self, f):
        """Reads the entire set of rooms from the data file f."""
        rooms = {}
        while True:
            room = AdvRoom.readRoom(f)
            if room is None: break
            name = room.getName()
            rooms[name] = room
        return rooms

    def readObjects(self, f):
        """Reads the entire set of objects from the data file f."""
        objects = {}
        while True:
            obj = AdvObject.readObject(f)
            if obj is None: break
            name = obj.getName()
            objects[name] = obj
        return objects

    def readSynonyms(self, f):
        """Reads the entire set of synonyms from the data file f."""
        synonyms = {}
        while True:
            line = f.readline().rstrip()
            if line == "": break
            equals = line.find("=")
            if equals == -1:
                raise ValueError("Missing equal sign in " + line)
            syn = line[:equals].strip().upper()
            fullWord = line[equals + 1:].strip()
            synonyms[syn] = fullWord
        return synonyms

