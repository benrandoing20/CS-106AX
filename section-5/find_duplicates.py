def findDuplicate(array):
    # TODO: implement this function
    pass


def tryTestCase(array):
    print("findDuplicate({!r}) -> {!r}".format(array, findDuplicate(array)))


def main():
    tryTestCase([1, 2, 3, 4, 3, 2])
    tryTestCase(["a", "b", "c", "d", "c"])
    tryTestCase([1, 2, 3, 4, 5, 6, 7])
    tryTestCase([])

if __name__ == '__main__':
    main()