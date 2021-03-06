

module.exports = {
  registerUser: require("./register-user"),
  authenticateUser: require("./authenticate-user"),
  createIngredient: require("./create-ingredient"),
  createRecipe: require("./create-recipe"),
  searchRecipe: require("./search-recipe"),
  toogleFavorite: require("./toogle-favorite"),
  retrieveFavorite: require("./retrieve-favorite"),
  retrieveUser: require("./retrieve-user"),
  retrieveRecipe: require("./retrieve-recipe"),
  toogleMenu: require("./toogle-menu-day"),
  retriveDay: require("./retrive-day"),
  groceryList: require("./grocery-list"),
  recipeIdeas: require("./recipe-ideas"),
  deleteRecipe: require("./delete-recipe"),
  deleteTimelineMenu: require("./delete-timeline-menu"),
  deleteDayMenu: require("./delete-day-menu"),
  retrieveMenu: require("./retrieve-menu"),
};
