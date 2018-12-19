/**
 *	File: https://kevoot.github.io/GUI_Course/final/js/tileConfig.js
 *  Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 12/19/2018 3:34PM
 *  Description: Instead of using JSON, I chose instead to just initialize
 *               an object which contains a key/object pair. The key being
 *               the letter of the tile, and the object representing the value
 *               of that type of tile as well as the total number of that 
 *               specific tile available
 */

let tileConfig = {
    A: { "val": 1, "count": 9 },
    B: { "val": 3, "count": 2 },
    C: { "val": 3, "count": 2 },
    D: { "val": 2, "count": 4 },
    E: { "val": 1, "count": 12 },
    F: { "val": 4, "count": 2 },
    G: { "val": 2, "count": 3 },
    H: { "val": 4, "count": 2 },
    I: { "val": 1, "count": 9 },
    J: { "val": 8, "count": 1 },
    K: { "val": 5, "count": 1 },
    L: { "val": 1, "count": 4 },
    M: { "val": 3, "count": 2 },
    N: { "val": 1, "count": 6 },
    O: { "val": 1, "count": 8 },
    P: { "val": 3, "count": 2 },
    Q: { "val": 10, "count": 1 },
    R: { "val": 1, "count": 6 },
    S: { "val": 1, "count": 4 },
    T: { "val": 1, "count": 6 },
    U: { "val": 1, "count": 4 },
    V: { "val": 4, "count": 2 },
    W: { "val": 4, "count": 2 },
    X: { "val": 8, "count": 1 },
    Y: { "val": 4, "count": 2 },
    Z: { "val": 10, "count": 1 },
    Blank: { "val": 0, "count": 2 }
};

