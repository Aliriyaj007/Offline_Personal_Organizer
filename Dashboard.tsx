
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AppSection, Transaction, TodoTask, GroceryItem, Note, WaterData, NoteFolder, Movie, TVShow, Habit, Book, Homework, Project, Meal, Recipe, FoodLog, FoodItem, Workout, Exercise, Measurement, Birthday, Event, Client, Appointment, SocialMediaPost } from '../types';
import { APP_SECTIONS_CONFIG, LOCAL_STORAGE_KEYS } from '../constants';
import ToolCard from './ToolCard';
import GridViewIcon from './icons/GridViewIcon';
import ListViewIcon from './icons/ListViewIcon';
import TabViewIcon from './icons/TabViewIcon';
import BudgetTracker from './BudgetTracker/BudgetTracker';
import TodoList from './TodoList/TodoList';
import GroceryList from './GroceryList/GroceryList';
import Notes from './Notes/Notes';
import WaterReminder from './WaterReminder/WaterReminder';
import MovieTracker from './MovieTracker/MovieTracker';
import TVShowTracker from './TVShowTracker/TVShowTracker';
import HabitTracker from './HabitTracker/HabitTracker';
import BookTracker from './BookTracker/BookTracker';
import HomeworkTracker from './HomeworkTracker/HomeworkTracker';
import ProjectPlanner from './ProjectPlanner/ProjectPlanner';
import MealPlanner from './MealPlanner/MealPlanner';
import FoodTracker from './FoodTracker/FoodTracker';
import WorkoutPlanner from './WorkoutPlanner/WorkoutPlanner';
import MeasurementTracker from './MeasurementTracker/MeasurementTracker';
import BirthdayTracker from './BirthdayTracker/BirthdayTracker';
import EventTracker from './EventTracker/EventTracker';
import ClientTracker from './ClientTracker/ClientTracker';
import SocialMediaPlanner from './SocialMediaPlanner/SocialMediaPlanner';

type ViewMode = 'grid' | 'list' | 'tab';

interface DashboardProps {
  onNavigate: (section: AppSection) => void;
  // All data props
  transactions: Transaction[]; setTransactions: (value: Transaction[] | ((val: Transaction[]) => Transaction[])) => void; onDeleteTransaction: (transaction: Transaction) => void;
  tasks: TodoTask[]; setTasks: (value: TodoTask[] | ((val: TodoTask[]) => TodoTask[])) => void; onDeleteTask: (task: TodoTask) => void;
  groceryItems: GroceryItem[]; setItems: (value: GroceryItem[] | ((val: GroceryItem[]) => GroceryItem[])) => void; onDeleteItem: (item: GroceryItem) => void;
  notes: Note[]; setNotes: (value: Note[] | ((val: Note[]) => Note[])) => void; onDeleteNote: (note: Note) => void;
  noteFolders: NoteFolder[]; setNoteFolders: (value: NoteFolder[] | ((val: NoteFolder[]) => NoteFolder[])) => void; onDeleteNoteFolder: (folder: NoteFolder) => void;
  waterData: WaterData; setWaterData: (value: WaterData | ((val: WaterData) => WaterData)) => void;
  movies: Movie[]; setMovies: (value: Movie[] | ((val: Movie[]) => Movie[])) => void; onDeleteMovie: (movie: Movie) => void;
  tvShows: TVShow[]; setTvShows: (value: TVShow[] | ((val: TVShow[]) => TVShow[])) => void; onDeleteShow: (show: TVShow) => void;
  habits: Habit[]; setHabits: (value: Habit[] | ((val: Habit[]) => Habit[])) => void; onDeleteHabit: (habit: Habit) => void;
  books: Book[]; setBooks: (value: Book[] | ((val: Book[]) => Book[])) => void; onDeleteBook: (book: Book) => void;
  homeworks: Homework[]; setHomeworks: (value: Homework[] | ((val: Homework[]) => Homework[])) => void; onDeleteHomework: (homework: Homework) => void;
  projects: Project[]; setProjects: (value: Project[] | ((val: Project[]) => Project[])) => void; onDeleteProject: (project: Project) => void;
  meals: Meal[]; setMeals: (value: Meal[] | ((val: Meal[]) => Meal[])) => void; onDeleteMeal: (meal: Meal) => void;
  recipes: Recipe[]; setRecipes: (value: Recipe[] | ((val: Recipe[]) => Recipe[])) => void; onDeleteRecipe: (recipe: Recipe) => void;
  foodLogs: FoodLog[]; setFoodLogs: (value: FoodLog[] | ((val: FoodLog[]) => FoodLog[])) => void;
  foodItems: FoodItem[]; setFoodItems: (value: FoodItem[] | ((val: FoodItem[]) => FoodItem[])) => void;
  workouts: Workout[]; setWorkouts: (value: Workout[] | ((val: Workout[]) => Workout[])) => void;
  exercises: Exercise[]; setExercises: (value: Exercise[] | ((val: Exercise[]) => Exercise[])) => void;
  measurements: Measurement[]; setMeasurements: (value: Measurement[] | ((val: Measurement[]) => Measurement[])) => void; onDeleteMeasurement: (measurement: Measurement) => void;
  birthdays: Birthday[]; setBirthdays: (value: Birthday[] | ((val: Birthday[]) => Birthday[])) => void; onDeleteBirthday: (birthday: Birthday) => void;
  events: Event[]; setEvents: (value: Event[] | ((val: Event[]) => Event[])) => void; onDeleteEvent: (event: Event) => void;
  clients: Client[]; setClients: (value: Client[] | ((val: Client[]) => Client[])) => void; onDeleteClient: (client: Client) => void;
  appointments: Appointment[]; setAppointments: (value: Appointment[] | ((val: Appointment[]) => Appointment[])) => void; onDeleteAppointment: (appointment: Appointment) => void;
  socialMediaPosts: SocialMediaPost[]; setPosts: (value: SocialMediaPost[] | ((val: SocialMediaPost[]) => SocialMediaPost[])) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(LOCAL_STORAGE_KEYS.DASHBOARD_VIEW, 'grid');
  const [activeTab, setActiveTab] = useState<AppSection>(AppSection.TODO);

  const renderTabView = () => {
    const renderActiveTabContent = () => {
      switch (activeTab) {
        case AppSection.BUDGET: return <BudgetTracker transactions={props.transactions} setTransactions={props.setTransactions} onDeleteTransaction={props.onDeleteTransaction} />;
        case AppSection.TODO: return <TodoList tasks={props.tasks} setTasks={props.setTasks} onDeleteTask={props.onDeleteTask} />;
        case AppSection.GROCERY: return <GroceryList items={props.groceryItems} setItems={props.setItems} onDeleteItem={props.onDeleteItem} />;
        case AppSection.NOTES: return <Notes notes={props.notes} setNotes={props.setNotes} onDeleteNote={props.onDeleteNote} folders={props.noteFolders} setFolders={props.setNoteFolders} onDeleteFolder={props.onDeleteNoteFolder} />;
        case AppSection.WATER_REMINDER: return <WaterReminder waterData={props.waterData} setWaterData={props.setWaterData} />;
        case AppSection.MOVIES: return <MovieTracker movies={props.movies} setMovies={props.setMovies} onDeleteMovie={props.onDeleteMovie} />;
        case AppSection.TV_SHOWS: return <TVShowTracker tvShows={props.tvShows} setTvShows={props.setTvShows} onDeleteShow={props.onDeleteShow} />;
        case AppSection.HABITS: return <HabitTracker habits={props.habits} setHabits={props.setHabits} onDeleteHabit={props.onDeleteHabit} />;
        case AppSection.BOOKS: return <BookTracker books={props.books} setBooks={props.setBooks} onDeleteBook={props.onDeleteBook} />;
        case AppSection.HOMEWORK: return <HomeworkTracker homeworks={props.homeworks} setHomeworks={props.setHomeworks} onDeleteHomework={props.onDeleteHomework} />;
        case AppSection.PROJECTS: return <ProjectPlanner projects={props.projects} setProjects={props.setProjects} onDeleteProject={props.onDeleteProject} />;
        case AppSection.MEAL_PLANNER: return <MealPlanner meals={props.meals} setMeals={props.setMeals} recipes={props.recipes} setRecipes={props.setRecipes} onDeleteMeal={props.onDeleteMeal} onDeleteRecipe={props.onDeleteRecipe} />;
        case AppSection.FOOD_TRACKER: return <FoodTracker foodLogs={props.foodLogs} setFoodLogs={props.setFoodLogs} foodItems={props.foodItems} setFoodItems={props.setFoodItems} />;
        case AppSection.WORKOUT_PLANNER: return <WorkoutPlanner workouts={props.workouts} setWorkouts={props.setWorkouts} exercises={props.exercises} setExercises={props.setExercises} />;
        case AppSection.MEASUREMENT_TRACKER: return <MeasurementTracker measurements={props.measurements} setMeasurements={props.setMeasurements} onDeleteMeasurement={props.onDeleteMeasurement} />;
        case AppSection.BIRTHDAY_TRACKER: return <BirthdayTracker birthdays={props.birthdays} setBirthdays={props.setBirthdays} onDeleteBirthday={props.onDeleteBirthday} />;
        case AppSection.EVENT_TRACKER: return <EventTracker events={props.events} setEvents={props.setEvents} onDeleteEvent={props.onDeleteEvent} />;
        case AppSection.CLIENT_TRACKER: return <ClientTracker clients={props.clients} setClients={props.setClients} appointments={props.appointments} setAppointments={props.setAppointments} onDeleteClient={props.onDeleteClient} onDeleteAppointment={props.onDeleteAppointment} />;
        case AppSection.SOCIAL_MEDIA_PLANNER: return <SocialMediaPlanner posts={props.socialMediaPosts} setPosts={props.setPosts} />;
        default: return null;
      }
    };
    
    return (
      <div className="mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {APP_SECTIONS_CONFIG.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                } whitespace-nowrap flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors`}
              >
                <tab.icon className="w-5 h-5"/>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-8">
            {renderActiveTabContent()}
        </div>
      </div>
    );
  };
  
  const renderCardView = (mode: 'grid' | 'list') => (
     <div className={`mt-6 ${mode === 'grid' 
        ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
        : 'flex flex-col gap-5'
      }`}>
        {APP_SECTIONS_CONFIG.map(section => (
            <ToolCard 
                key={section.id}
                label={section.label}
                description={section.description}
                icon={section.icon}
                viewMode={mode}
                onClick={() => props.onNavigate(section.id)}
            />
        ))}
     </div>
  );

  const ViewSwitcherButton: React.FC<{ mode: ViewMode, label: string, Icon: React.FC<{className?: string}> }> = ({ mode, label, Icon }) => (
    <button
        onClick={() => setViewMode(mode)}
        className={`p-2 rounded-md transition-colors ${viewMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'}`}
        aria-label={`Switch to ${label} view`}
        title={label}
    >
        <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b-2 border-indigo-500 dark:border-indigo-400">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-md text-gray-600 dark:text-gray-300">Welcome! Select a tool to get started.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <ViewSwitcherButton mode="grid" label="Grid View" Icon={GridViewIcon} />
          <ViewSwitcherButton mode="list" label="List View" Icon={ListViewIcon} />
          <ViewSwitcherButton mode="tab" label="Tab View" Icon={TabViewIcon} />
        </div>
      </div>
      
      {viewMode === 'tab' ? renderTabView() : renderCardView(viewMode)}
    </div>
  );
};

export default Dashboard;
