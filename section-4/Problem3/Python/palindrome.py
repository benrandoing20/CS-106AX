#!/usr/bin/env python3

"""
Exports a longestPalindrome function and the ability to test it from the command line
"""

import sys


def isPalindrome(str):
    return False  # not yet implemented


def longestPalindrome(str1, str2):
    return "[not yet implemented]"


# This provided line is required at the end of a Python file to call the main() function.
if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("You must invoke the program with two addition arguments.")
        sys.exit(0)
    str1 = sys.argv[1]
    str2 = sys.argv[2]
    if not str1.islower() or not str2.islower():
        print("The supplied words must be lowercase.")
        sys.exit(0)
    longest = longestPalindrome(str1, str2)
    print("The longest palindrome is \"%s\"." % longest)
