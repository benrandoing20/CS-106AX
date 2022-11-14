# File: AdvRoom.py

"""
This module is responsible for modeling a single room in Adventure.
"""

###########################################################################
# Your job for Milestone #1 is to fill in the definitions of the         #
# methods listed in this file, along with any helper methods you need.    #
# The public methods shown in this file are the ones you need for         #
# Milestone #1.  You will need to add other public methods for later      #
# milestones, as described in the handout.  For Milestone #7, you will    #
# need to move the getNextRoom method into the AdvGame class and replace  #
# it with a getPassages method that returns the dictionary of passages.   #
###########################################################################

# Constants

MARKER = "-----"

class AdvRoom:

    def __init__(self, name, shortdesc, longdesc, passages):
        """Creates a new room with the specified attributes."""
        self._name = name
        self._shortdesc = shortdesc
        self._longdesc = longdesc
        self._passages = passages
        self._beenVisitedFlag = False
        self._objects = []

    def getName(self):
        """Returns the name of this room.."""
        return self._name

    def getShortDescription(self):
        """Returns a one-line short description of this room.."""
        return self._shortdesc

    def getLongDescription(self):
        """Returns the list of lines describing this room."""
        return self._longdesc

    def getPassage(self):
        """Returns the list of tuple passages within this room."""
        return self._passages

    def getNextRoom(self, verb, inventory):
        """Returns the name of the destination room after applying verb."""
        for passage in self._passages:
            if passage[0] == verb:
                if passage[2] == None:
                    next = passage[1]
                    return next
                else:
                    if passage[2] in inventory:
                        next = passage[1]
                        return next

        return None

    def setVisited(self, beenVisitedFlag):
        """Sets a flag to indicate if a room has been visited."""
        self._beenVisitedFlag = beenVisitedFlag

    def hasBeenVisited(self):
        """Returns the flag indicating if a room has been visited."""
        return self._beenVisitedFlag

    def addObject(self, objName):
        """Adds an object to the current room list of objects."""
        self._objects.append(objName)

    def removeObject(self, objName):
        """Removes an object from the current room list of objects."""
        self._objects.remove(objName)

    def containsObject(self, objName):
        """Returns boolean indicator of obj being in the room or not."""
        return self._objects.count(objName) != 0

    def getContents(self):
        """Returns a copy of the list of object names in the current room."""
        return self._objects

    @staticmethod
    def readRoom(f):
        """Reads a room from the data file."""
        name = f.readline().rstrip()
        if name == "":
            return None
        shortdesc = f.readline().rstrip()
        longdesc = []
        while True:
            line = f.readline().rstrip()
            if line == MARKER: break
            longdesc.append(line)
        passages = []
        while True:
            line = f.readline().rstrip()
            if line == "": break
            colon = line.find(":")
            if colon == -1:
                raise ValueError("Missing colon in " + line)
            slash = line.find("/")
            direction = line[:colon].strip().upper()
            if slash != -1:
                nextLocation = line[colon + 1:slash].strip()
                keyRequired = line[slash + 1:]
            else:
                nextLocation = line[colon + 1:].strip()
                keyRequired = None

            passages.append((direction, nextLocation, keyRequired))
        return AdvRoom(name, shortdesc, longdesc, passages)
