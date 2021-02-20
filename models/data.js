//meal kit items
var mealKit = [
    {
        title: "Vegan Pasta",
        included: "with zucchini, tomato cooked in extra virgin olive oil.",
        description: "Yummy and fresh vegan pasta.",
        category: "Vegan Meals",
        price: 19.99,
        cookingTime: "20 minutes",
        servings: "3",
        calories: "650",
        imageUrl: '/images/vegan-pasta.jpg',
        topMeal: true,
        
    },
    {
        title: "Lamb Shank",
        included: "with smashed potatoes and curry sauce.",
        description: "Rich with curry sauce.",
        category: "Classic Meals",
        price: 32.99,
        cookingTime: "45 minutes",
        servings: "4",
        calories: "3050",
        imageUrl: '/images/lamb-shank.jpg',
        topMeal: true,
        
    },
    {
        title: "Kimchi Fried Rice",
        included: "with a sunny side up egg and spicy sauce.",
        description: "Hot and spicy fried rice.",
        category: "Classic Meals",
        price: 25.99,
        cookingTime: "30 minutes",
        servings: "5",
        calories: "950",
        imageUrl: '/images/kimchi.jpg',
        topMeal: true,
        
    },
    {
        title: "Classic Steak",
        included: "with pumpkin pure, mushrooms, tomato and red wine sauce",
        description: "Tender, delicious, mouthwatering steak.",
        category: "Classic Meals",
        price: 36.99,
        cookingTime: "50 minutes",
        servings: "1",
        calories: "2550",
        imageUrl: '/images/steak.jpg',
        topMeal: true,
    },
    {
        title: "Vegan Skewer",
        included: "with zucchini, carrot, bell paper and onions.",
        description: "Very healthy with veggies!",
        category: "Vegan Meals",
        price: 25.99,
        cookingTime: "25 minutes",
        servings: "2",
        calories: "650",
        imageUrl: '/images/skewer.jpg',
        topMeal: false,
    },
    {
        title: "Pumpkin Soup",
        included: "with cream and roasted breads.",
        description: "Rich, creamy, silky smooth soup.",
        category: "Classic Meals",
        price: 29.99,
        cookingTime: "32 minutes",
        servings: "2",
        calories: "1050",
        imageUrl: '/images/soup.jpg',
        topMeal: false,
    },
    {
        title: "Shrimp Fried Rice",
        included: "with hot pepper and sausages.",
        description: "Spicy, hot and flavoured rice.",
        category: "Classic Meals",
        price: 20.99,
        cookingTime: "30 minutes",
        servings: "4",
        calories: "1250",
        imageUrl: '/images/shrimp.jpg',
        topMeal: false,
    },
    {
    title: "Chicken Biriyani",
        included: "with spicy chicken and potato.",
        description: "Rich rice with tandoori chicken.",
        category: "Classic Meals",
        price: 26.99,
        cookingTime: "120 minutes",
        servings: "4",
        calories: "2200",
        imageUrl: '/images/biriyani.jpg',
        topMeal: false,
    }
];


//for meal by category
module.exports.getAllMeal = function () {
  return mealKit.reduce(
    function (sum, meal) {
      sum[meal.category] = sum[meal.category] || [];
      sum[meal.category].push(meal);
      return sum
  }, 
  new Object()
)
};
  
 

  //for top meals
module.exports.getTopMeal = function () {
    
    let filtered = mealKit.filter((item) => {
      console.log(item);
      return item.topMeal === true;
    });
  
    return filtered;
  };
  
 