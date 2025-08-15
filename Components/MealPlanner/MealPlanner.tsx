
import React, { useState, useMemo } from 'react';
import { Meal, Recipe, MealType } from '../../types';
import MealPlannerIcon from '../icons/MealPlannerIcon';
import RecipeBookIcon from '../icons/RecipeBookIcon';
import PlusIcon from '../icons/PlusIcon';
import TrashIcon from '../icons/TrashIcon';
import RecipeBoxModal from './RecipeBoxModal';
import MealFormModal from './MealFormModal';

interface MealPlannerProps {
  meals: Meal[];
  setMeals: (value: Meal[] | ((val: Meal[]) => Meal[])) => void;
  recipes: Recipe[];
  setRecipes: (value: Recipe[] | ((val: Recipe[]) => Recipe[])) => void;
  onDeleteMeal: (meal: Meal) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
}

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
};

const MealPlanner: React.FC<MealPlannerProps> = ({ meals, setMeals, recipes, setRecipes, onDeleteMeal, onDeleteRecipe }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isRecipeBoxOpen, setIsRecipeBoxOpen] = useState(false);
    const [isMealFormOpen, setIsMealFormOpen] = useState(false);
    const [selectedMealSlot, setSelectedMealSlot] = useState<{ date: string; type: MealType; meal: Meal | null } | null>(null);

    const weekStartDate = getWeekStartDate(currentDate);

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + i);
        return date;
    });

    const mealsByDateAndType = useMemo(() => {
        return meals.reduce((acc, meal) => {
            const key = `${meal.date}_${meal.type}`;
            acc[key] = meal;
            return acc;
        }, {} as Record<string, Meal>);
    }, [meals]);

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const openMealForm = (date: Date, type: MealType) => {
        const dateString = date.toISOString().split('T')[0];
        const meal = mealsByDateAndType[`${dateString}_${type}`] || null;
        setSelectedMealSlot({ date: dateString, type, meal });
        setIsMealFormOpen(true);
    };
    
    const handleSaveMeal = (mealData: Omit<Meal, 'id'>) => {
        if(selectedMealSlot?.meal) { // Editing existing meal
             const updatedMeal = { ...selectedMealSlot.meal, ...mealData };
             setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
        } else { // Adding new meal
            const newMeal: Meal = {
                id: Date.now().toString(),
                ...mealData,
            };
            setMeals(prev => [...prev, newMeal]);
        }
        setIsMealFormOpen(false);
        setSelectedMealSlot(null);
    };

    const handleDeleteMeal = () => {
        if (selectedMealSlot?.meal) {
            onDeleteMeal(selectedMealSlot.meal);
            setIsMealFormOpen(false);
            setSelectedMealSlot(null);
        }
    }

  return (
    <>
    <div className="space-y-6">
      <header className="flex items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
        <MealPlannerIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex-grow">
          Meal Planner
        </h2>
        <button onClick={() => setIsRecipeBoxOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors">
            <RecipeBookIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Recipe Box</span>
        </button>
      </header>

       <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevWeek} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">&lt; Prev</button>
                <h3 className="text-lg font-semibold">{weekStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={handleNextWeek} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-slate-700">Next &gt;</button>
            </div>
            
            <div className="grid grid-cols-8 gap-1">
                {/* Header Row */}
                <div /> {/* Empty corner */}
                {dayNames.map(day => <div key={day} className="text-center font-bold text-sm">{day}</div>)}
                
                {/* Meal Rows */}
                {mealTypes.map(type => (
                    <React.Fragment key={type}>
                        <div className="font-bold text-sm self-center text-right pr-2">{type}</div>
                        {weekDays.map(day => {
                            const dateString = day.toISOString().split('T')[0];
                            const meal = mealsByDateAndType[`${dateString}_${type}`];
                            const recipe = meal?.recipeId ? recipes.find(r => r.id === meal.recipeId) : null;
                            const isToday = dateString === new Date().toISOString().split('T')[0];

                            return (
                                <div key={dateString} className={`min-h-[100px] p-1.5 rounded-lg border flex flex-col justify-between ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-300' : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'}`}>
                                   {meal ? (
                                        <button onClick={() => openMealForm(day, type)} className="text-left w-full h-full flex flex-col">
                                            <p className="text-sm font-semibold flex-grow break-words">{recipe ? `📖 ${recipe.name}` : meal.customText}</p>
                                        </button>
                                   ) : (
                                       <button onClick={() => openMealForm(day, type)} className="m-auto p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600">
                                            <PlusIcon className="w-5 h-5"/>
                                       </button>
                                   )}
                                </div>
                            )
                        })}
                    </React.Fragment>
                ))}
            </div>
       </div>
    </div>

    {isRecipeBoxOpen && (
        <RecipeBoxModal
            isOpen={isRecipeBoxOpen}
            onClose={() => setIsRecipeBoxOpen(false)}
            recipes={recipes}
            setRecipes={setRecipes}
            onDeleteRecipe={onDeleteRecipe}
        />
    )}

    {isMealFormOpen && selectedMealSlot && (
        <MealFormModal 
            isOpen={isMealFormOpen}
            onClose={() => setIsMealFormOpen(false)}
            onSave={handleSaveMeal}
            onDelete={handleDeleteMeal}
            recipes={recipes}
            mealSlot={selectedMealSlot}
        />
    )}
    </>
  );
};

export default MealPlanner;
