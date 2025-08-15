
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BudgetTracker from './components/BudgetTracker/BudgetTracker';
import TodoList from './components/TodoList/TodoList';
import GroceryList from './components/GroceryList/GroceryList';
import Notes from './components/Notes/Notes';
import WaterReminder from './components/WaterReminder/WaterReminder';
import MovieTracker from './components/MovieTracker/MovieTracker';
import TVShowTracker from './components/TVShowTracker/TVShowTracker';
import HabitTracker from './components/HabitTracker/HabitTracker';
import BookTracker from './components/BookTracker/BookTracker';
import HomeworkTracker from './components/HomeworkTracker/HomeworkTracker';
import ProjectPlanner from './components/ProjectPlanner/ProjectPlanner';
import MealPlanner from './components/MealPlanner/MealPlanner';
import FoodTracker from './components/FoodTracker/FoodTracker';
import WorkoutPlanner from './components/WorkoutPlanner/WorkoutPlanner';
import MeasurementTracker from './components/MeasurementTracker/MeasurementTracker';
import BirthdayTracker from './components/BirthdayTracker/BirthdayTracker';
import EventTracker from './components/EventTracker/EventTracker';
import ClientTracker from './components/ClientTracker/ClientTracker';
import SocialMediaPlanner from './components/SocialMediaPlanner/SocialMediaPlanner';

import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LockScreen from './components/LockScreen';
import { AppSection, Transaction, TodoTask, GroceryItem, Note, NoteFolder, WaterData, Movie, TVShow, Habit, Book, Homework, Project, SearchResult, TrashItem, Meal, Recipe, FoodLog, FoodItem, Workout, Exercise, Measurement, Birthday, Event, Client, Appointment, SocialMediaPost } from './types';
import { LOCAL_STORAGE_KEYS, TRASH_RETENTION_DAYS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

const APP_VERSION = "1.8.0";

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const App: React.FC = () => {
  const [pin, setPin] = useLocalStorage<string | null>(LOCAL_STORAGE_KEYS.PIN, null);
  const [isLocked, setIsLocked] = useState<boolean>(!!pin);

  const [activeSection, setActiveSection] = useLocalStorage<AppSection | null>(
    LOCAL_STORAGE_KEYS.ACTIVE_SECTION,
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Existing states
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS, []);
  const [tasks, setTasks] = useLocalStorage<TodoTask[]>(LOCAL_STORAGE_KEYS.TASKS, []);
  const [groceryItems, setGroceryItems] = useLocalStorage<GroceryItem[]>(LOCAL_STORAGE_KEYS.GROCERY_ITEMS, []);
  const [notes, setNotes] = useLocalStorage<Note[]>(LOCAL_STORAGE_KEYS.NOTES, []);
  const [noteFolders, setNoteFolders] = useLocalStorage<NoteFolder[]>(LOCAL_STORAGE_KEYS.NOTE_FOLDERS, []);
  const [waterData, setWaterData] = useLocalStorage<WaterData>(LOCAL_STORAGE_KEYS.WATER_DATA, { dailyGoal: 2000, logs: [], date: getTodayDateString() });
  const [movies, setMovies] = useLocalStorage<Movie[]>(LOCAL_STORAGE_KEYS.MOVIES, []);
  const [tvShows, setTvShows] = useLocalStorage<TVShow[]>(LOCAL_STORAGE_KEYS.TV_SHOWS, []);
  const [habits, setHabits] = useLocalStorage<Habit[]>(LOCAL_STORAGE_KEYS.HABITS, []);
  const [books, setBooks] = useLocalStorage<Book[]>(LOCAL_STORAGE_KEYS.BOOKS, []);
  const [homeworks, setHomeworks] = useLocalStorage<Homework[]>(LOCAL_STORAGE_KEYS.HOMEWORK, []);
  const [projects, setProjects] = useLocalStorage<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS, []);
  
  // New section states
  const [meals, setMeals] = useLocalStorage<Meal[]>(LOCAL_STORAGE_KEYS.MEALS, []);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(LOCAL_STORAGE_KEYS.RECIPES, []);
  const [foodLogs, setFoodLogs] = useLocalStorage<FoodLog[]>(LOCAL_STORAGE_KEYS.FOOD_LOGS, []);
  const [foodItems, setFoodItems] = useLocalStorage<FoodItem[]>(LOCAL_STORAGE_KEYS.FOOD_ITEMS, []);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(LOCAL_STORAGE_KEYS.WORKOUTS, []);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(LOCAL_STORAGE_KEYS.EXERCISES, []);
  const [measurements, setMeasurements] = useLocalStorage<Measurement[]>(LOCAL_STORAGE_KEYS.MEASUREMENTS, []);
  const [birthdays, setBirthdays] = useLocalStorage<Birthday[]>(LOCAL_STORAGE_KEYS.BIRTHDAYS, []);
  const [events, setEvents] = useLocalStorage<Event[]>(LOCAL_STORAGE_KEYS.EVENTS, []);
  const [clients, setClients] = useLocalStorage<Client[]>(LOCAL_STORAGE_KEYS.CLIENTS, []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(LOCAL_STORAGE_KEYS.APPOINTMENTS, []);
  const [socialMediaPosts, setSocialMediaPosts] = useLocalStorage<SocialMediaPost[]>(LOCAL_STORAGE_KEYS.SOCIAL_MEDIA_POSTS, []);
  
  const [trashItems, setTrashItems] = useLocalStorage<TrashItem[]>(LOCAL_STORAGE_KEYS.TRASH_ITEMS, []);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const retentionPeriod = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const freshTrash = trashItems.filter(item => (now - item.deletedAt) < retentionPeriod);
    if (freshTrash.length < trashItems.length) {
      console.log(`Auto-cleaned ${trashItems.length - freshTrash.length} items from trash.`);
      setTrashItems(freshTrash);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveToTrash = (item: any, section: AppSection | 'NoteFolders' | 'Recipes' | 'FoodItems' | 'Exercises') => {
    const newTrashItem: TrashItem = {
      id: `trash-${item.id}-${Date.now()}`,
      deletedAt: Date.now(),
      originalSection: section,
      data: item,
    };
    setTrashItems(prev => [newTrashItem, ...prev]);

    switch (section) {
      case AppSection.BUDGET: setTransactions(prev => prev.filter(t => t.id !== item.id)); break;
      case AppSection.TODO: setTasks(prev => prev.filter(t => t.id !== item.id)); break;
      case AppSection.GROCERY: setGroceryItems(prev => prev.filter(i => i.id !== item.id)); break;
      case AppSection.NOTES: setNotes(prev => prev.filter(n => n.id !== item.id)); break;
      case 'NoteFolders': setNoteFolders(prev => prev.filter(f => f.id !== item.id)); break;
      case AppSection.MOVIES: setMovies(prev => prev.filter(m => m.id !== item.id)); break;
      case AppSection.TV_SHOWS: setTvShows(prev => prev.filter(s => s.id !== item.id)); break;
      case AppSection.HABITS: setHabits(prev => prev.filter(h => h.id !== item.id)); break;
      case AppSection.BOOKS: setBooks(prev => prev.filter(b => b.id !== item.id)); break;
      case AppSection.HOMEWORK: setHomeworks(prev => prev.filter(h => h.id !== item.id)); break;
      case AppSection.PROJECTS: setProjects(prev => prev.filter(p => p.id !== item.id)); break;
      case AppSection.MEAL_PLANNER: setMeals(prev => prev.filter(m => m.id !== item.id)); break;
      case 'Recipes': setRecipes(prev => prev.filter(r => r.id !== item.id)); break;
      case AppSection.FOOD_TRACKER: setFoodLogs(prev => prev.filter(fl => fl.id !== item.id)); break;
      case 'FoodItems': setFoodItems(prev => prev.filter(fi => fi.id !== item.id)); break;
      case AppSection.WORKOUT_PLANNER: setWorkouts(prev => prev.filter(w => w.id !== item.id)); break;
      case 'Exercises': setExercises(prev => prev.filter(e => e.id !== item.id)); break;
      case AppSection.MEASUREMENT_TRACKER: setMeasurements(prev => prev.filter(m => m.id !== item.id)); break;
      case AppSection.BIRTHDAY_TRACKER: setBirthdays(prev => prev.filter(b => b.id !== item.id)); break;
      case AppSection.EVENT_TRACKER: setEvents(prev => prev.filter(e => e.id !== item.id)); break;
      case AppSection.CLIENT_TRACKER: setClients(prev => prev.filter(c => c.id !== item.id)); break;
      case AppSection.APPOINTMENT_TRACKER: setAppointments(prev => prev.filter(a => a.id !== item.id)); break;
      case AppSection.SOCIAL_MEDIA_PLANNER: setSocialMediaPosts(prev => prev.filter(p => p.id !== item.id)); break;
    }
  };

  const handleDeleteNoteFolder = (folderToDelete: NoteFolder) => {
    const notesInFolder = notes.filter(note => note.folderId === folderToDelete.id);
    if (notesInFolder.length > 0) {
      if (!window.confirm(`This folder contains ${notesInFolder.length} note(s). Deleting the folder will also move all its notes to the trash. Are you sure?`)) {
        return;
      }
      notesInFolder.forEach(note => moveToTrash(note, AppSection.NOTES));
    }
    moveToTrash(folderToDelete, 'NoteFolders');
  };

  const handleRestoreItem = (itemToRestore: TrashItem) => {
    const restore = (setter: Function, sortFn?: (a: any, b: any) => number) => {
        setter((prev: any[]) => {
            const newArr = [...prev, itemToRestore.data];
            if (sortFn) newArr.sort(sortFn);
            return newArr;
        });
    };
    
    switch (itemToRestore.originalSection) {
      case AppSection.BUDGET: restore(setTransactions, (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case AppSection.TODO: restore(setTasks, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.GROCERY: restore(setGroceryItems, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.NOTES: restore(setNotes, (a,b) => b.updatedAt - a.updatedAt); break;
      case 'NoteFolders': restore(setNoteFolders, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.MOVIES: restore(setMovies, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.TV_SHOWS: restore(setTvShows, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.HABITS: restore(setHabits, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.BOOKS: restore(setBooks, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.HOMEWORK: restore(setHomeworks, (a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()); break;
      case AppSection.PROJECTS: restore(setProjects, (a,b) => b.createdAt - a.createdAt); break;
      case AppSection.MEAL_PLANNER: restore(setMeals); break;
      case 'Recipes': restore(setRecipes, (a,b) => a.name.localeCompare(b.name)); break;
      case AppSection.FOOD_TRACKER: restore(setFoodLogs, (a,b) => b.date.localeCompare(a.date)); break;
      case 'FoodItems': restore(setFoodItems, (a,b) => a.name.localeCompare(b.name)); break;
      case AppSection.WORKOUT_PLANNER: restore(setWorkouts); break;
      case 'Exercises': restore(setExercises, (a,b) => a.name.localeCompare(b.name)); break;
      case AppSection.MEASUREMENT_TRACKER: restore(setMeasurements, (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case AppSection.BIRTHDAY_TRACKER: restore(setBirthdays, (a,b) => a.name.localeCompare(b.name)); break;
      case AppSection.EVENT_TRACKER: restore(setEvents, (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case AppSection.CLIENT_TRACKER: restore(setClients, (a,b) => a.name.localeCompare(b.name)); break;
      case AppSection.APPOINTMENT_TRACKER: restore(setAppointments, (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case AppSection.SOCIAL_MEDIA_PLANNER: restore(setSocialMediaPosts, (a,b) => (b.scheduledAt || 0) - (a.scheduledAt || 0)); break;
    }
    setTrashItems(prev => prev.filter(item => item.id !== itemToRestore.id));
  };

  const handlePermanentlyDeleteItem = (id: string) => {
    setTrashItems(prev => prev.filter(item => item.id !== id));
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in the trash? This action cannot be undone.')) {
        setTrashItems([]);
    }
  };
  
  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];
    const tempDiv = document.createElement('div');

    // Add search logic for all sections...
    transactions.forEach(t => { if (t.description.toLowerCase().includes(lowerCaseQuery)) results.push({ id: `txn-${t.id}`, title: t.description, context: `Budget: ${t.amount.toString()}`, section: AppSection.BUDGET, originalId: t.id }); });
    tasks.forEach(task => { if (task.text.toLowerCase().includes(lowerCaseQuery)) results.push({ id: `todo-${task.id}`, title: task.text, context: 'In To-Do List', section: AppSection.TODO, originalId: task.id }); });
    notes.forEach(n => { tempDiv.innerHTML = n.content; const contentText = tempDiv.textContent || ""; if (n.title.toLowerCase().includes(lowerCaseQuery) || contentText.toLowerCase().includes(lowerCaseQuery)) results.push({ id: `note-${n.id}`, title: n.title, context: `Note: ${contentText.substring(0, 50)}...`, section: AppSection.NOTES, originalId: n.id }); });
    birthdays.forEach(b => { if (b.name.toLowerCase().includes(lowerCaseQuery)) results.push({ id: `bday-${b.id}`, title: b.name, context: 'Birthday Tracker', section: AppSection.BIRTHDAY_TRACKER, originalId: b.id }); });
    clients.forEach(c => { if (c.name.toLowerCase().includes(lowerCaseQuery)) results.push({ id: `client-${c.id}`, title: c.name, context: 'Client List', section: AppSection.CLIENT_TRACKER, originalId: c.id }); });
    
    setSearchResults(results.slice(0, 10)); // Limit results
  };

  const handleNavigate = (section: AppSection | null) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
    setSearchResults([]);
    setIsSearching(false);
  };
  
  const handleDeleteFoodLog = (log: FoodLog) => moveToTrash(log, AppSection.FOOD_TRACKER);
  const handleDeleteFoodItem = (item: FoodItem) => moveToTrash(item, 'FoodItems');
  const handleDeleteWorkout = (workout: Workout) => moveToTrash(workout, AppSection.WORKOUT_PLANNER);
  const handleDeleteExercise = (exercise: Exercise) => moveToTrash(exercise, 'Exercises');

  const renderActiveSection = () => {
    switch (activeSection) {
      case AppSection.BUDGET: return <BudgetTracker transactions={transactions} setTransactions={setTransactions} onDeleteTransaction={(t) => moveToTrash(t, AppSection.BUDGET)} />;
      case AppSection.TODO: return <TodoList tasks={tasks} setTasks={setTasks} onDeleteTask={(t) => moveToTrash(t, AppSection.TODO)}/>;
      case AppSection.GROCERY: return <GroceryList items={groceryItems} setItems={setGroceryItems} onDeleteItem={(i) => moveToTrash(i, AppSection.GROCERY)} />;
      case AppSection.NOTES: return <Notes notes={notes} setNotes={setNotes} onDeleteNote={(n) => moveToTrash(n, AppSection.NOTES)} folders={noteFolders} setFolders={setNoteFolders} onDeleteFolder={handleDeleteNoteFolder} />;
      case AppSection.WATER_REMINDER: return <WaterReminder waterData={waterData} setWaterData={setWaterData} />;
      case AppSection.MOVIES: return <MovieTracker movies={movies} setMovies={setMovies} onDeleteMovie={(m) => moveToTrash(m, AppSection.MOVIES)} />;
      case AppSection.TV_SHOWS: return <TVShowTracker tvShows={tvShows} setTvShows={setTvShows} onDeleteShow={(s) => moveToTrash(s, AppSection.TV_SHOWS)} />;
      case AppSection.HABITS: return <HabitTracker habits={habits} setHabits={setHabits} onDeleteHabit={(h) => moveToTrash(h, AppSection.HABITS)} />;
      case AppSection.BOOKS: return <BookTracker books={books} setBooks={setBooks} onDeleteBook={(b) => moveToTrash(b, AppSection.BOOKS)} />;
      case AppSection.HOMEWORK: return <HomeworkTracker homeworks={homeworks} setHomeworks={setHomeworks} onDeleteHomework={(h) => moveToTrash(h, AppSection.HOMEWORK)} />;
      case AppSection.PROJECTS: return <ProjectPlanner projects={projects} setProjects={setProjects} onDeleteProject={(p) => moveToTrash(p, AppSection.PROJECTS)} />;
      case AppSection.MEAL_PLANNER: return <MealPlanner meals={meals} setMeals={setMeals} recipes={recipes} setRecipes={setRecipes} onDeleteMeal={(m) => moveToTrash(m, AppSection.MEAL_PLANNER)} onDeleteRecipe={(r) => moveToTrash(r, 'Recipes')} />;
      case AppSection.FOOD_TRACKER: return <FoodTracker foodLogs={foodLogs} setFoodLogs={setFoodLogs} foodItems={foodItems} setFoodItems={setFoodItems} onDeleteFoodLog={handleDeleteFoodLog} onDeleteFoodItem={handleDeleteFoodItem} />;
      case AppSection.WORKOUT_PLANNER: return <WorkoutPlanner workouts={workouts} setWorkouts={setWorkouts} exercises={exercises} setExercises={setExercises} onDeleteWorkout={handleDeleteWorkout} onDeleteExercise={handleDeleteExercise} />;
      case AppSection.MEASUREMENT_TRACKER: return <MeasurementTracker measurements={measurements} setMeasurements={setMeasurements} onDeleteMeasurement={(m) => moveToTrash(m, AppSection.MEASUREMENT_TRACKER)} />;
      case AppSection.BIRTHDAY_TRACKER: return <BirthdayTracker birthdays={birthdays} setBirthdays={setBirthdays} onDeleteBirthday={(b) => moveToTrash(b, AppSection.BIRTHDAY_TRACKER)} />;
      case AppSection.EVENT_TRACKER: return <EventTracker events={events} setEvents={setEvents} onDeleteEvent={(e) => moveToTrash(e, AppSection.EVENT_TRACKER)} />;
      case AppSection.CLIENT_TRACKER: return <ClientTracker clients={clients} setClients={setClients} appointments={appointments} setAppointments={setAppointments} onDeleteClient={(c) => moveToTrash(c, AppSection.CLIENT_TRACKER)} onDeleteAppointment={(a) => moveToTrash(a, AppSection.APPOINTMENT_TRACKER)} />;
      case AppSection.SOCIAL_MEDIA_PLANNER: return <SocialMediaPlanner posts={socialMediaPosts} setPosts={setSocialMediaPosts} onDeletePost={(p) => moveToTrash(p, AppSection.SOCIAL_MEDIA_PLANNER)} />;
      default: return null;
    }
  };

  const handleUnlock = () => setIsLocked(false);
  
  const handleSetPin = (newPin: string | null) => {
    setPin(newPin);
    if (!newPin) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }
  };

  if (isLocked && pin) {
    return <LockScreen onUnlock={handleUnlock} correctPin={pin} />;
  }

  const allData = {
    transactions, tasks, groceryItems, notes, noteFolders, waterData, movies, tvShows, habits, books, homeworks, projects,
    meals, recipes, foodLogs, foodItems, workouts, exercises, measurements, birthdays, events, clients, appointments, socialMediaPosts,
    trashItems, activeSection,
  };

  const dashboardProps = {
    onNavigate: handleNavigate,
    transactions, setTransactions, onDeleteTransaction: (t: Transaction) => moveToTrash(t, AppSection.BUDGET),
    tasks, setTasks, onDeleteTask: (t: TodoTask) => moveToTrash(t, AppSection.TODO),
    groceryItems, setItems: setGroceryItems, onDeleteItem: (i: GroceryItem) => moveToTrash(i, AppSection.GROCERY),
    notes, setNotes, onDeleteNote: (n: Note) => moveToTrash(n, AppSection.NOTES),
    noteFolders, setNoteFolders, onDeleteNoteFolder: handleDeleteNoteFolder,
    waterData, setWaterData,
    movies, setMovies, onDeleteMovie: (m: Movie) => moveToTrash(m, AppSection.MOVIES),
    tvShows, setTvShows, onDeleteShow: (s: TVShow) => moveToTrash(s, AppSection.TV_SHOWS),
    habits, setHabits, onDeleteHabit: (h: Habit) => moveToTrash(h, AppSection.HABITS),
    books, setBooks, onDeleteBook: (b: Book) => moveToTrash(b, AppSection.BOOKS),
    homeworks, setHomeworks, onDeleteHomework: (h: Homework) => moveToTrash(h, AppSection.HOMEWORK),
    projects, setProjects, onDeleteProject: (p: Project) => moveToTrash(p, AppSection.PROJECTS),
    meals, setMeals, onDeleteMeal: (m: Meal) => moveToTrash(m, AppSection.MEAL_PLANNER),
    recipes, setRecipes, onDeleteRecipe: (r: Recipe) => moveToTrash(r, 'Recipes'),
    foodLogs, setFoodLogs, foodItems, setFoodItems, onDeleteFoodLog: handleDeleteFoodLog, onDeleteFoodItem: handleDeleteFoodItem,
    workouts, setWorkouts, exercises, setExercises, onDeleteWorkout: handleDeleteWorkout, onDeleteExercise: handleDeleteExercise,
    measurements, setMeasurements, onDeleteMeasurement: (m: Measurement) => moveToTrash(m, AppSection.MEASUREMENT_TRACKER),
    birthdays, setBirthdays, onDeleteBirthday: (b: Birthday) => moveToTrash(b, AppSection.BIRTHDAY_TRACKER),
    events, setEvents, onDeleteEvent: (e: Event) => moveToTrash(e, AppSection.EVENT_TRACKER),
    clients, setClients, appointments, setAppointments, onDeleteClient: (c: Client) => moveToTrash(c, AppSection.CLIENT_TRACKER), onDeleteAppointment: (a: Appointment) => moveToTrash(a, AppSection.APPOINTMENT_TRACKER),
    socialMediaPosts, setPosts: setSocialMediaPosts, onDeletePost: (p: SocialMediaPost) => moveToTrash(p, AppSection.SOCIAL_MEDIA_PLANNER)
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <Navbar 
             onOpenSidebar={() => setIsSidebarOpen(true)} 
             onOpenSettings={() => setIsSettingsModalOpen(true)}
             onGoHome={() => handleNavigate(null)}
             onSearch={handleSearch}
             searchResults={searchResults}
             onNavigateToResult={handleNavigate}
             isSearching={isSearching}
             setIsSearching={setIsSearching}
           />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === null && !isSearching ? (
          <Dashboard {...dashboardProps} />
        ) : (
          renderActiveSection()
        )}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Made by Riyajul Ali | v{APP_VERSION}
      </footer>
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentData={allData}
        onRestoreData={(data) => {
          setTransactions(data.transactions || []);
          setTasks(data.tasks || []);
          setGroceryItems(data.groceryItems || []);
          setNotes(data.notes || []);
          setNoteFolders(data.noteFolders || []);
          setWaterData(data.waterData || { dailyGoal: 2000, logs: [], date: getTodayDateString() });
          setMovies(data.movies || []);
          setTvShows(data.tvShows || []);
          setHabits(data.habits || []);
          setBooks(data.books || []);
          setHomeworks(data.homeworks || []);
          setProjects(data.projects || []);
          setMeals(data.meals || []);
          setRecipes(data.recipes || []);
          setFoodLogs(data.foodLogs || []);
          setFoodItems(data.foodItems || []);
          setWorkouts(data.workouts || []);
          setExercises(data.exercises || []);
          setMeasurements(data.measurements || []);
          setBirthdays(data.birthdays || []);
          setEvents(data.events || []);
          setClients(data.clients || []);
          setAppointments(data.appointments || []);
          setSocialMediaPosts(data.socialMediaPosts || []);
          setTrashItems(data.trashItems || []);
          setActiveSection(data.activeSection !== undefined ? data.activeSection : null);
        }}
        appVersion={APP_VERSION}
        pin={pin}
        onSetPin={handleSetPin}
        trashItems={trashItems}
        onRestoreItem={handleRestoreItem}
        onPermanentlyDeleteItem={handlePermanentlyDeleteItem}
        onEmptyTrash={handleEmptyTrash}
      />
    </div>
  );
};

export default App;