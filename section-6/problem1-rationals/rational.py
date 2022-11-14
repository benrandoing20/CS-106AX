# File: rational.py

"""
This module defines a class for representing rational numbers.
"""

import math

class Rational:

# Implementation note
# -------------------
# The Rational class ensures that every number has a unique
# internal representation by guaranteeing that the following
# conditions hold:
#    1. The denominator must be greater than 0.
#    2. The number 0 is always represented as 0/1.
#    3. The fraction is always reduced to lowest terms.

    def __init__(self, num, den=1):
        """Creates a new Rational object from num and den."""
        if den == 0:
            raise ValueError("Illegal denominator value")
        if num == 0:
            den = 1
        elif den < 0:
            den = -den
            num = -num
        g = math.gcd(abs(num), den)
        self._num = num // g
        self._den = den // g
            
    def __str__(self):
        """Returns the string representation of this object."""
        if self._den == 1:
            return str(self._num)
        else:
            return str(self._num) + "/" + str(self._den)
    
    def getNumerator(self):
      return self._num
    
    def getDenominator(self):
      return self._den
    
    @property
    def numerator(self):
      return self._num
    
    @property
    def denominator(self):
      return self._den

    def add(self, r):
        """Creates a new Rational by adding r to self."""
        return Rational(self._num * r._den + self._den * r._num,
                        self._den * r._den)

    def sub(self, r):
        """Creates a new Rational by subtracting r from self."""
        return Rational(self._num * r._den - self._den * r._num,
                        self._den * r._den)

    def mul(self, r):
        """Creates a new Rational by multiplying self by r."""
        return Rational(self._num * r._num, self._den * r._den)

    def div(self, r):
        """Creates a new Rational by dividing self by r."""
        return Rational(self._num * r._den, self._den * r._num)

# Overload the arithmetic operators

    def __add__(self, rhs):
        if type(rhs) is int:
            return self.add(Rational(rhs))
        elif type(rhs) is Rational:
            return self.add(rhs)
        else:
            return NotImplemented

    def __radd__(self, lhs):
        if type(lhs) is int:
            return Rational(lhs).add(self)
        elif type(lhs) is Rational:
            return lhs.add(self)
        else:
            return NotImplemented

    def __sub__(self, rhs):
        if type(rhs) is int:
            return self.sub(Rational(rhs))
        elif type(rhs) is Rational:
            return self.sub(rhs)
        else:
            return NotImplemented

    def __rsub__(self, lhs):
        if type(lhs) is int:
            return Rational(lhs).sub(self)
        elif type(lhs) is Rational:
            return lhs.sub(self)
        else:
            return NotImplemented

    def __mul__(self, rhs):
        if type(rhs) is int:
            return self.mul(Rational(rhs))
        elif type(rhs) is Rational:
            return self.mul(rhs)
        else:
            return NotImplemented

    def __rmul__(self, lhs):
        if type(lhs) is int:
            return Rational(lhs).mul(self)
        elif type(lhs) is Rational:
            return lhs.mul(self)
        else:
            return NotImplemented

    def __truediv__(self, rhs):
        if type(rhs) is int:
            return self.div(Rational(rhs))
        elif type(rhs) is Rational:
            return self.div(rhs)
        else:
            return NotImplemented

    def __rtruediv__(self, lhs):
        if type(lhs) is int:
            return Rational(lhs).div(self)
        elif type(lhs) is Rational:
            return lhs.div(self)
        else:
            return NotImplemented

# Overload the relational operators

    def __eq__(self, rhs):
        if type(rhs) is int:
            return self.__eq__(Rational(rhs))
        elif type(rhs) is Rational:
            return self._num * rhs._den == self._den * rhs._num
        else:
            return False

    def __lt__(self, rhs):
        if type(rhs) is int:
            return self.__lt__(Rational(rhs))
        elif type(rhs) is Rational:
            return self._num * rhs._den < self._den * rhs._num
        else:
            return NotImplemented

    def __gt__(self, rhs):
        if type(rhs) is int:
            return self.__gt__(Rational(rhs))
        elif type(rhs) is Rational:
            return self._num * rhs._den > self._den * rhs._num
        else:
            return NotImplemented

    def __le__(self, rhs):
        if type(rhs) is int:
            return self.__le__(Rational(rhs))
        elif type(rhs) is Rational:
            return self._num * rhs._den <= self._den * rhs._num
        else:
            return NotImplemented

    def __ge__(self, rhs):
        if type(rhs) is int:
            return self.__ge__(Rational(rhs))
        elif type(rhs) is Rational:
            return self._num * rhs._den >= self._den * rhs._num
        else:
            return NotImplemented
