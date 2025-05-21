export const data = [
  {
    isActive: true,
    name: "Tanner Linsley",
    age: 42,
    salary: 100_000,
    city: "San Francisco",
    state: "California",
  },
  {
    isActive: true,
    name: "Kevin Vandy",
    age: 51,
    salary: 80_000,
    city: "Richmond",
    state: "Virginia",
  },
  {
    isActive: false,
    name: "John Doe",
    age: 27,
    salary: 120_000,
    city: "Riverside",
    state: "South Carolina",
  },
  {
    isActive: true,
    name: "Jane Doe",
    age: 32,
    salary: 150_000,
    city: "San Francisco",
    state: "California",
  },
  {
    isActive: false,
    name: "John Smith",
    age: 42,
    salary: 75_000,
    city: "Los Angeles",
    state: "California",
  },
  {
    isActive: true,
    name: "Jane Smith",
    age: 51,
    salary: 56_000,
    city: "Blacksburg",
    state: "Virginia",
  },
  {
    isActive: false,
    name: "Samuel Jackson",
    age: 27,
    salary: 90_000,
    city: "New York",
    state: "New York",
  },
];

export const citiesList = [
  "San Francisco",
  "Richmond",
  "Riverside",
  "Los Angeles",
  "Blacksburg",
  "New York",
];

export const usStateList = [
  "California",
  "Virginia",
  "South Carolina",
  "New York",
  "Texas",
];

export const Person = {
  isActive: false,
  name: "",
  age: 0,
  salary: 0,
  city: "",
  state: "",
};
export const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  let quarter;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }

  return `${currentYear}-${quarter}`;
};
