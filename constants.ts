import React from 'react';
import { AppSection, Currency, NotePriority, MovieWatchStatus, TVShowWatchStatus, AppointmentStatus, SocialPlatform, PostStatus } from './types';
import BudgetIcon from './components/icons/BudgetIcon';
import TodoIcon from './components/icons/TodoIcon';
import GroceryIcon from './components/icons/GroceryIcon';
import NotesIcon from './components/icons/NotesIcon';
import WaterIcon from './components/icons/WaterIcon';
import MovieIcon from './components/icons/MovieIcon';
import TVShowIcon from './components/icons/TVShowIcon';
import HabitIcon from './components/icons/HabitIcon';
import BookIcon from './components/icons/BookIcon';
import HomeworkIcon from './components/icons/HomeworkIcon';
import ProjectIcon from './components/icons/ProjectIcon';
import MealPlannerIcon from './components/icons/MealPlannerIcon';
import CalorieTrackerIcon from './components/icons/CalorieTrackerIcon';
import WorkoutIcon from './components/icons/WorkoutIcon';
import MeasurementIcon from './components/icons/MeasurementIcon';
import BirthdayIcon from './components/icons/BirthdayIcon';
import EventIcon from './components/icons/EventIcon';
import ClientIcon from './components/icons/ClientIcon';
import SocialMediaIcon from './components/icons/SocialMediaIcon';
import InstagramIcon from './components/icons/InstagramIcon';
import YouTubeIcon from './components/icons/YouTubeIcon';
import TelegramIcon from './components/icons/TelegramIcon';
import WhatsAppIcon from './components/icons/WhatsAppIcon';


export const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'app_transactions',
  TASKS: 'app_todo_tasks',
  GROCERY_ITEMS: 'app_grocery_items',
  NOTES: 'app_notes',
  NOTE_FOLDERS: 'app_note_folders',
  WATER_DATA: 'app_water_data',
  MOVIES: 'app_movies',
  TV_SHOWS: 'app_tv_shows',
  HABITS: 'app_habits',
  BOOKS: 'app_books',
  HOMEWORK: 'app_homeworks',
  PROJECTS: 'app_projects',
  MEALS: 'app_meals',
  RECIPES: 'app_recipes',
  FOOD_LOGS: 'app_food_logs',
  FOOD_ITEMS: 'app_food_items',
  WORKOUTS: 'app_workouts',
  EXERCISES: 'app_exercises',
  MEASUREMENTS: 'app_measurements',
  BIRTHDAYS: 'app_birthdays',
  EVENTS: 'app_events',
  CLIENTS: 'app_clients',
  APPOINTMENTS: 'app_appointments',
  SOCIAL_MEDIA_POSTS: 'app_social_media_posts',
  TRASH_ITEMS: 'app_trash_items',
  ACTIVE_SECTION: 'app_active_section',
  DASHBOARD_VIEW: 'app_dashboard_view',
  THEME: 'app_theme',
  PIN: 'app_security_pin',
};

export interface SectionConfig {
  id: AppSection;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  category: 'Daily Tools' | 'Health & Wellness' | 'Productivity' | 'Organization' | 'Media & Leisure' | 'Professional';
}

export const APP_SECTIONS_CONFIG: SectionConfig[] = [
  // Daily Tools
  { 
    id: AppSection.TODO, 
    label: 'To-Do List',
    icon: TodoIcon,
    description: 'Organize your day and keep track of important tasks to boost your productivity.',
    category: 'Daily Tools',
  },
  { 
    id: AppSection.WATER_REMINDER, 
    label: 'Water Reminder',
    icon: WaterIcon,
    description: 'Stay hydrated by tracking your daily water intake and setting personal goals.',
    category: 'Daily Tools',
  },
  { 
    id: AppSection.HABITS, 
    label: 'Habit Tracker',
    icon: HabitIcon,
    description: 'Build good habits and break bad ones with a visual and motivating tracker.',
    category: 'Daily Tools',
  },
  // Health & Wellness
  {
    id: AppSection.MEAL_PLANNER,
    label: 'Meal Planner',
    icon: MealPlannerIcon,
    description: 'Plan your weekly meals for breakfast, lunch, dinner, and snacks.',
    category: 'Health & Wellness',
  },
  {
    id: AppSection.FOOD_TRACKER,
    label: 'Food & Calorie Tracker',
    icon: CalorieTrackerIcon,
    description: 'Log your food intake and monitor calories and macronutrients.',
    category: 'Health & Wellness',
  },
  {
    id: AppSection.WORKOUT_PLANNER,
    label: 'Workout Planner',
    icon: WorkoutIcon,
    description: 'Schedule your weekly workouts and track your exercises.',
    category: 'Health & Wellness',
  },
  {
    id: AppSection.MEASUREMENT_TRACKER,
    label: 'Body Measurements',
    icon: MeasurementIcon,
    description: 'Track your weight, height, and other body measurements over time.',
    category: 'Health & Wellness',
  },
  // Productivity
  { 
    id: AppSection.BUDGET, 
    label: 'Budget Tracker',
    icon: BudgetIcon,
    description: 'Monitor income, expenses, and analyze your financial habits with monthly reports.',
    category: 'Productivity', 
  },
   { 
    id: AppSection.PROJECTS, 
    label: 'Project Planner',
    icon: ProjectIcon,
    description: 'Break down large goals into small, manageable steps and track your progress.',
    category: 'Productivity',
  },
  { 
    id: AppSection.HOMEWORK, 
    label: 'Homework Tracker',
    icon: HomeworkIcon,
    description: 'Stay on top of your academic assignments and never miss a deadline.',
    category: 'Productivity',
  },
  // Organization
  { 
    id: AppSection.NOTES, 
    label: 'Notes',
    icon: NotesIcon,
    description: 'Capture your thoughts, ideas, and multimedia content with a powerful rich-text editor.',
    category: 'Organization',
  },
  { 
    id: AppSection.GROCERY, 
    label: 'Grocery List',
    icon: GroceryIcon,
    description: 'Create, categorize, and track multiple shopping lists. Analyze your spending with visual reports.',
    category: 'Organization',
  },
  {
    id: AppSection.BIRTHDAY_TRACKER,
    label: 'Birthday Tracker',
    icon: BirthdayIcon,
    description: 'Never forget a birthday again. Keep track of important dates and gift ideas.',
    category: 'Organization',
  },
  {
    id: AppSection.EVENT_TRACKER,
    label: 'Event Tracker',
    icon: EventIcon,
    description: 'Manage your personal and professional events in a simple calendar view.',
    category: 'Organization',
  },
  // Media & Leisure
  { 
    id: AppSection.MOVIES, 
    label: 'Movie Tracker',
    icon: MovieIcon,
    description: 'Catalog your movie collection. Track what you\'ve watched, rate your favorites, and keep personal notes.',
    category: 'Media & Leisure',
  },
  { 
    id: AppSection.TV_SHOWS, 
    label: 'TV Show Tracker',
    icon: TVShowIcon,
    description: 'Never lose your place in a series again. Track your watch progress, manage your watchlist, and rate completed series.',
    category: 'Media & Leisure',
  },
  { 
    id: AppSection.BOOKS, 
    label: 'Book Tracker',
    icon: BookIcon,
    description: 'Your personal digital library. Catalog books, track reading progress, and write reviews.',
    category: 'Media & Leisure',
  },
  // Professional
  {
    id: AppSection.CLIENT_TRACKER,
    label: 'Client & Appointments',
    icon: ClientIcon,
    description: 'Manage your client list and schedule appointments.',
    category: 'Professional',
  },
  {
    id: AppSection.SOCIAL_MEDIA_PLANNER,
    label: 'Social Media Planner',
    icon: SocialMediaIcon,
    description: 'Plan your content for various social media platforms with a visual calendar and Kanban board.',
    category: 'Professional',
  },
];

export const MOVIE_WATCH_STATUSES = Object.values(MovieWatchStatus);
export const TV_SHOW_WATCH_STATUSES = Object.values(TVShowWatchStatus);
export const APPOINTMENT_STATUSES: AppointmentStatus[] = ['Scheduled', 'Completed', 'Canceled'];

export const DEFAULT_GROCERY_CATEGORIES = [
    'Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Pantry', 'Frozen Foods', 'Beverages', 'Household', 'Personal Care', 'Pets', 'Other'
];

export const USD_TO_INR_RATE = 83.0;

export const SUPPORTED_CURRENCIES: { code: Currency, symbol: string, name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const TRASH_RETENTION_DAYS = 30;

export const NOTE_PRIORITIES: { id: NotePriority; label: string }[] = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
];

export const NOTE_COLORS = [
    { id: 'default', value: 'dark:bg-slate-800 bg-white' },
    { id: 'red', value: 'bg-red-100 dark:bg-red-900/40' },
    { id: 'yellow', value: 'bg-yellow-100 dark:bg-yellow-900/40' },
    { id: 'green', value: 'bg-green-100 dark:bg-green-900/40' },
    { id: 'blue', value: 'bg-blue-100 dark:bg-blue-900/40' },
    { id: 'purple', value: 'bg-purple-100 dark:bg-purple-900/40' },
    { id: 'gray', value: 'bg-gray-200 dark:bg-gray-700/40' },
];

export const FONT_FACES = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS'];
export const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px'];

export const EVENT_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#78716c', // stone-500
];

export const DEFAULT_EVENT_CATEGORIES = [
    'Personal', 'Work', 'Family', 'Health', 'Finance', 'Social', 'Other'
];

export const POST_STATUSES: { id: PostStatus, label: string, color: string }[] = [
    { id: 'Idea', label: '💡 Idea', color: 'bg-gray-400' },
    { id: 'In Progress', label: '✍️ In Progress', color: 'bg-blue-500' },
    { id: 'Scheduled', label: '🗓️ Scheduled', color: 'bg-purple-500' },
    { id: 'Published', label: '✅ Published', color: 'bg-green-500' },
];

export const SOCIAL_PLATFORMS: { id: SocialPlatform, label: string, icon: React.FC<{className?: string; style?: React.CSSProperties}>, color: string }[] = [
    { id: 'Instagram', label: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
    { id: 'YouTube', label: 'YouTube', icon: YouTubeIcon, color: '#FF0000' },
    { id: 'Telegram', label: 'Telegram', icon: TelegramIcon, color: '#24A1DE' },
    { id: 'WhatsApp', label: 'WhatsApp', icon: WhatsAppIcon, color: '#25D366' },
];