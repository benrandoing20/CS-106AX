# File: Reassemble.py
# -------------------
# This file exports a program that reads in a large number
# of text fragments from a file you choose, and then reconstructs
# the original text so it can be printed out.

from filechooser import chooseInputFile

def extractFragments(filename):
   '''
   Creates a list where each entry is a fragment from the filename text file

   extractFragments takes in a text file. After separating each line,
   empty strings are removed if present. All of the strings are removed from {}
   brackets and added to the fragments list.

   Parameters
   ----------
   filename: str name of the text file with the fragments

   Returns
   -------
   fragments: str list of each fragment excluding the {} brackets
   '''
   with open(filename) as file:
      lines = file.readlines()
      combinedInput = ""
      fragments = []

      # Removes empty entries
      for i in range(lines.count('')):
         lines.remove('')

      for i in range(len(lines)):
         if lines[i][0] != "{" and lines[i][0] != "}" and lines[i-1][len(lines[i-1])-1] != "{":
            combinedInput += " " + lines[i]
         else:
            combinedInput += lines[i]

      # Isolates inner string fragments from {} brackets
      start = 0
      while combinedInput.find("{") != -1 and start < len(combinedInput):
         lhps = combinedInput.find("{", start)
         rhps = combinedInput.find("}", lhps + 1)
         frag = combinedInput[lhps + 1:rhps]
         start = rhps + 1
         fragments.append(frag)

   # Sorts from lngest to shortest to help with run time
   fragsSingle = []
   [fragsSingle.append(frag) for frag in fragments if frag not in fragsSingle]
   fragments = fragsSingle

   # Sorts fragments from longest to shortest in order to shorten run time
   fragments.sort(key=len, reverse=True)
   print(fragments)
   return fragments

def reconstruct(fragments):
   '''
   Identifies fragment overlap to reconstruct a fragment of text

   reconstruct goes through many iterations of comparing potential two
   fragments pairs to see if overlap occurs. The fragments are then combined
   and returned as a single string.

   Parameters
   ----------
   fragments: str name of the text file with the fragments

   Returns
   -------
   fragments[0]: str combination of fragments put back together
   '''
   while (len(fragments) > 1):
      totalMax = 0
      totalIndx1 = 0
      totalIndx2 = 0
      totalOffset = 0

      # The first two for loops iterate through each potential fragment pairing
      for i in range(len(fragments)):
         for j in range(i+1, len(fragments)):
            lenI = len(fragments[i])
            lenJ = len(fragments[j])
            similar = 0
            index1 = 0
            index2 = 0
            offset = 0

            # Saves time if the length of J is less than the totalMax
            if totalMax >= lenJ:
               continue

            # The following for loop implements an offset to identify the
            # appropriate substrings to compare
            for compNums in range((totalMax-1), ((lenI+lenJ)-1-(totalMax-1))):
               compareI = ""
               compareJ = ""
               if compNums < lenI and compNums < lenJ:
                  compareI = fragments[i][0:compNums+1]
                  compareJ = fragments[j][lenJ-1-compNums:]
               elif compNums < lenI and compNums >= lenJ:
                  compareI = fragments[i][compNums-(lenJ-1):compNums + 1]
                  compareJ = fragments[j]
               elif compNums >= lenI and compNums < lenJ:
                  compareI = fragments[i]
                  compareJ = fragments[j][lenJ-1-(compNums):lenJ-1-(
                          compNums-lenI)]
               elif compNums >= lenI and compNums >= lenJ:
                  compareI = fragments[i][(compNums+1-lenJ):]
                  compareJ = fragments[j][:lenJ-1-(compNums-lenI)]

               rangeNums = compNums + 1
               localSimilar = 0
               localMaxSimilar = 0
               allOverlap = True
               length = len(compareI)

               # The for loop below compares each substring entry fro equality
               for val in range(length):
                  if compareI[val] == compareJ[val]:
                     localSimilar += 1
                     if localSimilar > localMaxSimilar:
                        localMaxSimilar = localSimilar
                  else:
                     localSimilar = 0
                     allOverlap = False
                     break

               if localMaxSimilar > similar and allOverlap:
                  similar = localMaxSimilar
                  index1 = i
                  index2 = j
                  offset = compNums
               if localMaxSimilar >= lenJ:
                  break

            if similar > totalMax:
               totalMax = similar
               totalIndx1 = index1
               totalIndx2 = index2
               totalOffset = offset

            print(similar, index1, index2, offset, totalMax)
            similar = 0

      if totalMax > 0:
         newWord = combineStringsOver(fragments[totalIndx1], fragments[totalIndx2], totalOffset)
         print(newWord)
         fragments.pop(totalIndx2)
         fragments.pop(totalIndx1)
         fragments.append(newWord)
         fragments.sort(key=len, reverse=True)
         print(fragments)
      else:
         out = ""
         for frag in fragments:
            out += frag
         return out

   return fragments[0]

def combineStringsOver(word1, word2, offset):
   '''
   combines two strings that can be combined from two fragments into one phrase

   combineStringsOver takes two strings and an offset that details the
   increments the last index of word 2 has moved in relation to index 0 of
   word1.

   Parameters
   ----------
   word1: str fragment from the original txt file
   word2: str a second fragment >= in len than word1
   offset: int depicting the offset mentioned above between word1 and word2

   Returns
   -------
   result: str combination of word1 and word2
   '''
   result = ""
   resultFront = ""
   resultBack = ""
   len1 = len(word1)
   len2 = len(word2)

   if len1 > len2:
      if offset >= len1 :
         include = (offset+1) - len1
         resultBack = word2[len2-include:]
      if offset < len1 and (offset + 1) < len2:
         resultFront = word2[:len2-offset-1]
      elif offset < len1 and (offset + 1) >= len2:
         return word1

   elif len2 > len1:
      if offset < len1:
         resultFront = word2[:len2-offset-1]
      if offset >= len1 and (offset + 1) >= len2:
         include = (offset + 1) - len1
         resultBack = word2[len2 - include:]
      elif offset >= len1 and (offset + 1) < len2:
         return word2

   elif len1 == len2:
      if offset >= len1 :
         include = (offset+1) - len1
         resultBack = word2[len2-include:]
      elif offset == (len1 - 1):
         return word1
      else:
         resultFront = word2[:len2 - offset - 1]

   result = resultFront + word1 + resultBack

   return result

def Reassemble():
   filename = chooseInputFile("reassemble-files")
   if filename == "":
      print("User canceled file selection. Quitting!")
      return
   fragments = extractFragments(filename)
   if fragments == None:
      print("File didn't respect reassemble file format. Quitting!")
      return
   reconstruction = reconstruct(fragments)
   print(reconstruction)

if __name__ == "__main__":
   Reassemble()
