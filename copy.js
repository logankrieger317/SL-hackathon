const OpenAI = require("openai");
const apiKey = "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";

// MAIN FUNCTION
async function getChatGPTPrices() {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
    //   {
    //     role: "user",
    //     content: [
    //       {
    //         type: "text",
    //         text: "Please share the detail information of each item on this product on a nice structure JSON",
    //       },
    //       {
    //         type: "image_url",
    //         image_url: {
    //           url: "https://i.ibb.co/F8nGWk5/Clean-Shot-2024-01-17-at-13-46-43.png",
    //         },
    //       },
    //     ],
    //   },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Please assume the role of a senior insurance adjuster. In this role you will revieve one or many photos of either a storage unit or individual items. You will need to provide a name for each item labeled product. you will then need to provide a suggested retail price for each item based on the photo and the replacement value of the item with the name of suggested_price. If you can identify any brand names or model numbers please utilize those in finding and suggesting a value. Finally, please calculate the total value of all items in the photo and provide that value as total_value. The response should be in a JSON format with no additional text or descriptions. do not include any disclaimers or warnings before or after the JSON. The structure should be as follows: { items: [ { product: "item1", suggested_price: 100, quantity: 1, }, { product: "item2", suggested_price: 200, quantity: 1, } ], total_value: 300 }',
          },
          {
            type: "image_url",
            image_url: {
              url: "https://cdn.hibid.com/img.axd?id=7788918573&wid=&rwl=false&p=&ext=&w=0&h=0&t=&lp=&c=true&wt=false&sz=MAX&checksum=q200Bw6gEQwVlogAqAGkS57WcTZwbziu",
            },
          },
        ],
      },
    ],
    max_tokens: 1000, // Add more token
  });
  console.log(response.choices[0].message.content.replace("```json", "").replace("```", ""));
  return JSON.parse(response.choices[0].message.content.replace("```json", "").replace("```", ""));
}
 /**
   * {
   *  items: [
    *  {
    *   product: "item1",
    *   suggested_price: 100,
    *   quantity: 1,
    *  }
    * ]
   * }
   */
function addUpChatGPTPrices(chatGPTResponse) {
  let totalPrice = 0;

  chatGPTResponse.items.forEach(item => {
    console.log(item.suggested_price, item.quantity ?? 1);
    totalPrice += item.suggested_price * item.quantity;
  });
  return totalPrice;
};

async function main() {
  const priceJSON = await getChatGPTPrices();
  console.log({ priceJSON })
  const totalPrice = addUpChatGPTPrices(priceJSON);
  return totalPrice
};

// RUN THE MAIN FUNCTION AND PRINT THE RESULTS
main()
  .then((response) => console.log("Final price:", response))
  .catch((err) => console.error("Error", err));
