/**
 * File: ScalingRecipes.js
 */

"use strict";

const CONVERSIONS = [
  { unit: "dram", amount: 4 / 3 },
  { unit: "teaspoon", amount: 3 },
  { unit: "tablespoon", amount: 2 },
  { unit: "ounce", amount: 8 },
  { unit: "cup", amount: 2 },
  { unit: "pint", amount: 2 },
  { unit: "quart", amount: 4 },
  { unit: "gallon", amount: 2 },
  { unit: "peck", amount: 4 },
  { unit: "bushel", amount: 55 / 7 },
  { unit: "barrel", amount: 6000 },
  { unit: "acre" }, // no larger unit of measure, so no amount field
];

const SOUP_RECIPE = {
  name: "Charred Cauliflower Stew",
  servings: 4,
  ingredients: [
    { amount: 2, unit: "head", name: "cauliflower" },
    { amount: 2, unit: "teaspoon", name: "olive oil" },
    { amount: 1, unit: "cup", name: "watercress" },
  ],
  instructions: [
    "Heat the grill to high and lightly oil the grates.",
    "Toss cauliflower florets with half of the olive oil.",
    "Garnish with remaining watercress and serve.",
  ],
};

/**
 * Accepts a recipe object and a number of serving, and normalizes
 * their amounts according to the section handout.
 */
function scale(recipe, servings) {
  let multFactor = servings / recipe.servings;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    let newAmount = recipe.ingredients[i].amount * multFactor;
    let unit = recipe.ingredients[i].unit;
    for (let j = 0; j < CONVERSIONS.length-1; j++) {
      if (CONVERSIONS[j].unit === unit) {
        if (newAmount >= CONVERSIONS[j].amount) {
          newAmount /= CONVERSIONS[j].amount;
          unit = CONVERSIONS[j+1].unit;
        }
      }
    }
    recipe.ingredients[i].amount = newAmount;
    recipe.ingredients[i].unit = unit;
    console.log(unit)
    console.log(newAmount)
  };
}

/****************************************
 *                Testing               *
 ****************************************/


/** Main Function */
function TestScalingRecipes() {
  for (const { name, input, output } of TESTS) {
    const [recipe, servings] = JSON.parse(JSON.stringify(input));
    scale(recipe, servings);
    const mismatch = findMismatches(recipe, output);
    if (mismatch === null) {
      console.log(`✅ ${name}: Passed!`);
    } else {
      console.log(`❌ ${name}: Failed: ${mismatch}`);
    }
  }
}

function findMismatches(student, expected) {
  if (student.ingredients.length !== expected.ingredients.length) {
    return "Somehow the number of ingredient types changed?";
  }

  for (let i = 0; i < student.ingredients.length; i++) {
    const studentIngredient = student.ingredients[i];
    const expectedIngredient = expected.ingredients[i];
    if (studentIngredient.name !== expectedIngredient.name) {
      return `Expected ingredient index ${i} to be ${expectedIngredient.name}, but it was ${studentIngredient.name} instead.`;
    }
    if (studentIngredient.unit !== expectedIngredient.unit) {
      return `Expected ingredient ${studentIngredient.name} to be use the unit ${expectedIngredient.unit}, but it was ${studentIngredient.unit} instead.`;
    }
    if (studentIngredient.amount !== expectedIngredient.amount) {
      return `Expected the amount of ingredient ${studentIngredient.name} to be ${expectedIngredient.amount}, but it was ${studentIngredient.amount} instead.`;
    }
  }

  return null;
}

const TESTS = [
  {
    name: "No scaling (same number of servings as recipe)",
    input: [SOUP_RECIPE, 4],
    output: SOUP_RECIPE,
  },
  {
    name: "Scale to 16",
    input: [SOUP_RECIPE, 16],
    output: {
      ...SOUP_RECIPE,
      ingredients: [
        { amount: 8, unit: "head", name: "cauliflower" },
        { amount: 1.33, unit: "ounce", name: "olive oil" },
        { amount: 1, unit: "quart", name: "watercress" },
      ],
    },
  },
  {
    name: "Scale to 1600",
    input: [SOUP_RECIPE, 1600],
    output: {
      ...SOUP_RECIPE,
      ingredients: [
        { amount: 800, unit: "head", name: "cauliflower" },
        { amount: 1.042, unit: "gallon", name: "olive oil" },
        { amount: 3.125, unit: "bushel", name: "watercress" },
      ],
    },
  },
];
