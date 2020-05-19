//https://web.archive.org/web/20200413102542/https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
export const FB_ADVANCED_MATCHING_PARAMETERS = {
  "ud[em]": "Email",
  "ud[fn]": "First Name",
  "ud[ln]": "Last Name",
  "ud[ph]": "Phone",
  "ud[ge]": "Gender",
  "ud[db]": "Birthdate",
  "ud[city]": "City",
  "ud[ct]": "City",
  "ud[state]": "State or Province",
  "ud[st]": "State or Province",
  "ud[zp]": "Zip Code",
  "ud[cn]": "Country",
  "ud[country]": "Country",
  "ud[external_id]": "An ID from another database.",
};
// https://web.archive.org/web/20200519201636/https://developers.facebook.com/docs/facebook-pixel/reference
export const FB_STANDARD_EVENTS = [
  {
    eventName: "AddPaymentInfo",
    eventDescription: `When payment information is added in the checkout flow. For example - A person clicks on a save billing information button`,
  },
  {
    eventName: "AddToCart",
    eventDescription: `When a product is added to the shopping cart. For example - A person clicks on an add to cart button.`,
  },
  {
    eventName: "AddToWishlist",
    eventDescription:
      "When a product is added to a wishlist. For example - A person clicks on an add to wishlist button. ",
  },
  {
    eventName: "CompleteRegistration",
    eventDescription:
      "When a registration form is completed. For example - A person submits a completed subscription or signup form.",
  },
  {
    eventName: "Contact",
    eventDescription:
      "When a person initiates contact with your business via telephone, SMS, email, chat, etc. For example - A person submits a question about a product",
  },
  {
    eventName: "CustomizeProduct",
    eventDescription:
      "When a person customizes a product. For example - A person selects the color of a t-shirt.",
  },
  {
    eventName: "Donate",
    eventDescription:
      "When a person donates funds to your organization or cause. For example - A person adds a donation to the Humane Society to their cart",
  },
  {
    eventName: "FindLocation",
    eventDescription:
      "When a person searches for a location of your store via a website or app, with an intention to visit the physical location. For example - A person wants to find a specific product in a local store. ",
  },
  {
    eventName: "InitiateCheckout",
    eventDescription:
      "When a person enters the checkout flow prior to completing the checkout flow. For example - A person clicks on a checkout button.",
  },
  {
    eventName: "Lead",
    eventDescription:
      "When a sign up is completed. For example - A person clicks on pricing.",
  },
  {
    eventName: "PageView",
    eventDescription:
      "This is the default pixel tracking page visits. For example - A person lands on your website pages.",
  },
  {
    eventName: "Purchase",
    eventDescription:
      "When a purchase is made or checkout flow is completed. A person has finished the purchase or checkout flow and lands on thank you or confirmation page",
  },
  {
    eventName: "Schedule",
    eventDescription:
      "When a person books an appointment to visit one of your locations. A person selects a date and time for a dentist appointment.",
  },
  {
    eventName: "Search",
    eventDescription:
      "When a search is made. A person searches for a product on your website.",
  },
  {
    eventName: "StartTrial",
    eventDescription:
      "When a person starts a free trial of a product or service you offer. A person selects a free week of your game",
  },
  {
    eventName: "SubmitApplication",
    eventDescription:
      "When a person applies for a product, service, or program you offer. For example - A person applies for a credit card, educational program, or job. ",
  },
  {
    eventName: "Subscribe",
    eventDescription:
      "When a person applies to a start a paid subscription for a product or service you offer.",
  },
  {
    eventName: "ViewContent",
    eventDescription:
      "A visit to a web page you care about (for example, a product page or landing page). ViewContent tells you if someone visits a web page's URL, but not what they see or do on that page. For example - A person lands on a product details page",
  },
];
// const parseFacebookPixesParamete
