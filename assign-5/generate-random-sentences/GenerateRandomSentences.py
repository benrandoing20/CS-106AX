# File: GenerateRandomSentences.py
# --------------------------------
# This file exports a program that reads in a grammar file and
# then prints three randomly generated sentences

from filechooser import chooseInputFile
from random import choice

def readGrammar(filename):
   '''
   Parses a text file to store the grammar in a dictionary

   readGrammar creates a dictionary of keys being the heading of each
   section in a grammar with values of all the possible phrases

   Parameters
   ----------
   filename: str indicating the appropriate text file with the grammar

   Returns
   -------
   grammar: dictionary of each grammar heading and potential values
   '''
   with open(filename) as file:

      lines = file.read().splitlines()
      position = 0
      key = ""
      value = []
      grammar = {}

      for i in range(len(lines)):
         if position == 0:
            lhps = lines[i].find("<")
            rhps = lines[i].find(">")
            key = lines[i][lhps+1:rhps]
         elif position > 1:
            if (lines[i] == ""):
               grammar[key] = value
               value = []
               position = 0
               continue
            value.append(lines[i])
         position += 1

   return grammar

def generateRandomSentence(grammar):
   '''
   Uses grammar to construct randomly selected phrases

   generateRandomSentence goes through the start dictionary entry and fills
   in any occurrences of <...> with a potential phrase for the appropriate
   key in <...>

   Parameters
   ----------
   grammar: dictionary of each grammar heading and potential values

   Returns
   -------
   sentence: str that is randomly generated from the grammar dictionary
   '''
   startPoint = grammar["start"]
   sentence = startPoint[0]

   start = 0
   while sentence.find("<") != -1 and start < len(sentence):
      lhps = sentence.find("<", start)
      rhps = sentence.find(">", lhps + 1)
      key = sentence[lhps+1:rhps]
      replacement = choice(grammar[key])
      old = "<"+key+">"
      sentence = sentence.replace(old, replacement, 1)

   return sentence

def GenerateRandomSentences():
   filename = chooseInputFile("grammars")
   grammar = readGrammar(filename)
   for i in range(3):
      print(generateRandomSentence(grammar))

if __name__ == "__main__":
   GenerateRandomSentences()
