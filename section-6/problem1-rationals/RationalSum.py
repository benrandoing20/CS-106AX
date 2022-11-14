# File: RationalSum.py

"""
This module is where you will implement your section problem 1 solution.
"""

from rational import Rational


def unitFractionSum(r):
    """
    Constructs a list of distinct unit fraction
    that add up to the supplied r.
    Examples:
      unitFractionSum(Rational(1, 3)) -> [1/3]
      unitFractionSum(Rational(2, 3)) -> [1/2, 1/6]
      unitFractionSum(Rational(21, 23)) -> [1/2, 1/3, 1/13, 1/359, 1/644046]
    
    Part 2 Examples:
      unitFractionSum(Rational(21, 23)) -> [1/2, 1/3, 1/13, 1/359, 1/644046]
      unitFractionSum(Rational(13, 12)) -> [1/2, 1/3, 1/4]
      unitFractionSum(Rational(5, 2)) ->
      [1/2, 1/3, ..17 terms.. ,1/7894115294, 1/333156570077494116352]
    """
    pass


def RationalSum():
  print(str(unitFractionSum(Rational(1, 3))))
  print(str(unitFractionSum(Rational(2, 3))))
  print(str(unitFractionSum(Rational(21, 23))))


# Startup code
if __name__ == "__main__":
    RationalSum()
