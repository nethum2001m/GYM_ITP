import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "protein", label: "Protein Supplements" },
      { id: "energy", label: "Energy & Pre-Workout Drinks" },
      { id: "hydration", label: "Hydration & Recovery Drinks" },
      { id: "snacks", label: "Healthy Snacks" },
      { id: "boosters", label: "Amino Acids & Performance Boosters" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Manufacture Date",
    name: "manufactureDate",
    componentType: "datepicker",
    placeholder: "Select manufacture date",
  },
  {
    label: "Expiry Date",
    name: "expiryDate",
    componentType: "datepicker",
    placeholder: "Select expiry date",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  protein: "Protein Supplements",
  energy: "Energy & Pre-Workout Drinks",
  hydration: "Hydration & Recovery Drinks",
  snacks: "Healthy Snacks",
  boosters: "Amino Acids & Performance Boosters",
};

export const filterOptions = {
  category: [
    { id: "protein", label: "Protein Supplements" },
    { id: "energy", label: "Energy & Pre-Workout Drinks" },
    { id: "hydration", label: "Hydration & Recovery Drinks" },
    { id: "snacks", label: "Healthy Snacks" },
    { id: "boosters", label: "Amino Acids & Performance Boosters" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const cardFormControls = [
  {
    label: "Card Holder",
    name: "cardholder",
    componentType: "input",
    type: "text",
    placeholder: "Enter card holder's name ",
  },
  {
    label: "Card Number",
    name: "cardnumber",
    componentType: "input",
    type: "text",
    placeholder: "Enter 16 digit card number",
    pattern: "[0-9]{16}",
  },
  {
    label: "Card Type",
    name: "cardType",
    componentType: "select",
    options: [
      { id: "visa", label: "Visa" },
      { id: "mastercard", label: "Mastercard" },
    ],
  },
  {
    label: "Expire Date",
    name: "expire",
    componentType: "datepicker",
    placeholder: "Enter card expire date",
  },
  {
    label: "CVV",
    name: "cvv",
    componentType: "input",
    type: "text",
    placeholder: "Enter 3 or 4 digit CVV",
    pattern: "[0-9]{3,4}",
  },
];
