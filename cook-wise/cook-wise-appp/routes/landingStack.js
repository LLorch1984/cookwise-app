import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Landing from '../src/components/Landing'
import Register from '../src/components/Register'
import Login from '../src/components/Login'
import Home from '../src/components/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Entypo } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import AddRecipe from '../src/components/AddRecipe'
import RecipeBook from '../src/components/RecipeBook'
import Schedule from '../src/components/Schedule'
import Recipe from '../src/components/Recipe'
import GroceryList from '../src/components/GroceryList'
import RecipeIdeas from '../src/components/RecipeIdeas'
import LogoutButton from '../src/components/LogoutButton'


const Tab = createBottomTabNavigator()

const Stack = createStackNavigator()
const StackNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
                name='Landing'
                component={Landing}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='Register'
                component={Register}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='Login'
                component={Login}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='Home'
                options={({navigation}) =>({
                    title: "",
                    headerLeft: null,
                    headerRight: () => (
                        <LogoutButton navigation={navigation}/>
                    ),
                    headerStyle: {
                        backgroundColor: '#F4D35E'
                    },
                
                
                })}
                
                component={MainNavigation}
            />
            <Stack.Screen
                name='Recipe'
                component={Recipe}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='Schedule'
                component={Schedule}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='Grocery'
                component={GroceryList}
                options={{ headerShown: false }} />
            <Stack.Screen
                name='RecipeIdeas'
                component={RecipeIdeas}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
)

function MainNavigation() {
    return (
        <Tab.Navigator initialRouteName="Home" tabBarOptions={{
            labelStyle: { display: 'none' },
            style: {
                height: 80
            }
        }}>
            <Tab.Screen name="Home" component={Home}
                options={{

                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        focused ?

                            <Entypo name="home" size={24} color="#F4D35E" /> :
                            <Entypo name="home" size={24} color="#0D3B66" />
                    )
                }} />
            <Tab.Screen name="Add Recipe" component={AddRecipe}
                options={{

                    title: "Add Recipe",
                    tabBarIcon: ({ focused }) => (
                        focused ?

                            <Entypo name="add-to-list" size={24} color="#F4D35E" /> :
                            <Entypo name="add-to-list" size={24} color="#0D3B66" />
                    )
                }} />
            <Tab.Screen name="Recipe Book" component={RecipeBook}
                options={{

                    title: "Recipe Book",
                    tabBarIcon: ({ focused }) => (
                        focused ?

                            <Entypo name="book" size={24} color="#F4D35E" /> :
                            <Entypo name="book" size={24} color="#0D3B66" />
                    )
                }} />
            <Tab.Screen name="schedule" component={Schedule}
                options={{

                    title: "schedule",
                    tabBarIcon: ({ focused }) => (
                        focused ?



                            <AntDesign name="calendar" size={24} color="#F4D35E" /> :
                            <AntDesign name="calendar" size={24} color="#0D3B66" />
                    )
                }} />



        </Tab.Navigator>

    )
}


export default StackNavigator