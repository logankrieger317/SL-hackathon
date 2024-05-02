const OpenAI = require("openai");
const apiKey = "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";

/**
 * @description Get the prices of the items in the image using ChatGPT
 * @param { String } imageUrl
 * @returns { items: [{ product, suggested_price, quantity }] }
 */
async function getChatGPTPrices(
  imageUrl = "https://i.pinimg.com/736x/19/d9/06/19d9065a186b9e7ec7a38026da707bfe.jpg",
) {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'You will receive a URL link to one or more photos of either a storage unit or individual items. Your task is to analyze the photos and provide the following information in JSON format without any additional text or descriptions:1. A list of items in the photo, each with a name (product), a suggested retail price (suggested_price), and a quantity (quantity).2. The total value of all items in the photo (total_value).Please provide the information in the following format: {items: [{ product: "item1", suggested_price: 100, quantity: 1},{product: "item2", suggested_price: 200, quantity: 1 }],total_value: 300 }.The "product" field should be a concise name or brief description of the item.The "suggested_price" should be the estimated retail price for a new, undamaged item of the same kind and quality as the one in the photo.The "quantity" should be the number of items of that type visible in the photo(s).The "total_value" should be the sum of all suggested_prices multiplied by their respective quantities.Your response should only contain the JSON data as structured above, with no additional text or descriptions. Do not include any disclaimers or warnings before or after the JSON.Please complete this task 5 times and get an average of the suggested prices for each individual item and create a total value for all items in the photo.',
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    max_tokens: 1000, // Add more token
  });
  return JSON.parse(
    response.choices[0].message.content
      .replace("```json", "")
      .replace("```", ""),
  );
}

/**
 * @description Adds up the prices of all items in the chatGPT response
 * @param { items: [{ product, suggested_price, quantity }] }
 * @returns { Number } total_price
 */
function addUpChatGPTPrices(chatGPTResponse) {
  let totalPrice = 0;

  chatGPTResponse.items.forEach((item) => {
    totalPrice += item.suggested_price * item.quantity;
  });
  return totalPrice;
}

// Current SafeLease coverage plans
const policies = [
  {
    premium: 12,
    coverage: 2000,
  },
  {
    premium: 17,
    coverage: 3000,
  },
  {
    premium: 27,
    coverage: 5000,
  },
];

/**
 * @description Recommends a plan
 * @returns { premium, coverage }
 */
function recommendPlan(totalPrice) {
  for (const plan of policies) {
    if (plan.coverage >= totalPrice) {
      return {
        premium: plan.premium,
        coverage: plan.coverage,
      };
    }
  }

  return {
    premium: policies[policies.length - 1].premium,
    coverage: policies[policies.length - 1].coverage,
  };
}

async function main() {
  const priceJSON = await getChatGPTPrices();
  const totalPrice = addUpChatGPTPrices(priceJSON);
  console.log(priceJSON);
  const suggestedPlan = recommendPlan(totalPrice);
  return { totalPrice, suggestedPlan };
}

// RUN THE MAIN FUNCTION AND PRINT THE RESULTS
main()
  .then((response) => console.log("Recomendation:", response))
  .catch((err) => console.error("Error", err));
// console.log(recommendPlan(0));
// console.log(recommendPlan(1999));
// console.log(recommendPlan(2000));
// console.log(recommendPlan(2001));
// console.log(recommendPlan(2999));
// console.log(recommendPlan(3000));
// console.log(recommendPlan(3069));
// console.log(recommendPlan(4999));
// console.log(recommendPlan(5000));
// console.log(recommendPlan(5420));;
