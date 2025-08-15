export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export type Currency = 'USD' | 'INR';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  currency: Currency;
}

export interface TodoTask {
  id:string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
  createdAt: number;
  category: string;
  price?: number;
  store?: string;
  isUrgent?: boolean;
}

export type NotePriority = 'low' | 'medium' | 'high';

export interface Attachment {
  id: string;
  type: 'image' | 'audio';
  data: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folderId: string | null;
  priority: NotePriority;
  color: string;
  attachments: Attachment[];
}

export interface NoteFolder {
  id: string;
  name: string;
  createdAt: number;
}

export interface WaterLog {
    amount: number;
    timestamp: number;
}

export interface WaterData {
    dailyGoal: number;
    logs: WaterLog[];
    date: string;
}

export enum MovieWatchStatus {
  Watched = 'Watched',
  WantToWatch = 'Want to Watch',
}

export interface Movie {
  id: string;
  title: string;
  releaseYear: number | null;
  director: string;
  genre: string;
  status: MovieWatchStatus;
  rating: number | null;
  notes: string;
  watchedDate: string | null;
  createdAt: number;
}

export enum TVShowWatchStatus {
  Watching = 'Watching',
  Completed = 'Completed',
  OnHold = 'On Hold',
  Dropped = 'Dropped',
  PlanToWatch = 'Plan to Watch',
}

export interface TVShow {
  id: string;
  title: string;
  startYear: number | null;
  genre: string;
  status: TVShowWatchStatus;
  rating: number | null;
  notes: string;
  progress: {
    season: number;
    episode: number;
  };
  totalSeasons: number | null;
  createdAt: number;
}

export type HabitFrequency = 'daily' | { days: number[] };

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  completions: { [date: string]: boolean };
  createdAt: number;
}

export enum BookStatus {
  ToRead = 'To Read',
  Reading = 'Reading',
  Finished = 'Finished',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  coverImage?: string;
  pageCount: number | null;
  currentPage: number;
  rating: number | null;
  review: string;
  createdAt: number;
}

export type HomeworkPriority = 'low' | 'medium' | 'high';
export enum HomeworkStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: HomeworkPriority;
  status: HomeworkStatus;
  notes: string;
  createdAt: number;
}

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
  subTasks: ProjectTask[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  tasks: ProjectTask[];
  createdAt: number;
}

// --- New Types for all new sections ---

// Meal Planner
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  type: MealType;
  recipeId?: string;
  customText: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string; // Simple text for now
  instructions: string; // Simple text
}

// Food & Calorie Tracker
export interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string; // e.g., "100g", "1 cup"
}

export interface FoodLog {
    id: string;
    date: string; // YYYY-MM-DD
    foodItemId: string;
    servings: number;
}

// Workout Planner
export interface Exercise {
    id: string;
    name: string;
    type: 'Cardio' | 'Strength';
    muscleGroup?: string;
}
export interface Workout {
    id: string;
    date: string; // YYYY-MM-DD
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number; // for strength
    duration?: number; // in minutes, for cardio
    completed: boolean;
}

// Measurement Tracker
export type MeasurementUnit = 'kg' | 'lbs' | 'cm' | 'in';
export interface Measurement {
    id: string;
    date: string; // YYYY-MM-DD
    weight?: { value: number; unit: MeasurementUnit };
    height?: { value: number; unit: MeasurementUnit };
    bodyFat?: number; // percentage
    custom: { [key: string]: { value: number; unit: MeasurementUnit } };
}

// Birthday Tracker
export interface Birthday {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    notes?: string; // gift ideas
    createdAt: number;
}

// Event Tracker
export interface Event {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time?: string; // HH:MM
    location?: string;
    description?: string;
    category: string; // e.g., 'Work', 'Personal'
    color: string;
    createdAt: number;
}

// Client & Appointment Tracker
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled';
export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
    createdAt: number;
}
export interface Appointment {
    id: string;
    clientId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    service: string;
    notes?: string;
    status: AppointmentStatus;
    createdAt: number;
}

// Social Media Planner
export type SocialPlatform = 'Instagram' | 'YouTube' | 'Telegram' | 'WhatsApp';
export type PostStatus = 'Idea' | 'In Progress' | 'Scheduled' | 'Published';
export interface SocialMediaPost {
    id: string;
    platform: SocialPlatform;
    content: string;
    mediaUrl?: string; // placeholder
    status: PostStatus;
    scheduledAt: number | null; // timestamp
    publishedAt?: number;
    createdAt: number;
}


// --- End of New Types ---

export enum AppSection {
  BUDGET = 'Budget Tracker',
  TODO = 'To-Do List',
  GROCERY = 'Grocery and Shopping List',
  NOTES = 'Notes',
  WATER_REMINDER = 'Water Reminder',
  HABITS = 'Habit Tracker',
  MOVIES = 'Movie Tracker',
  TV_SHOWS = 'TV Show Tracker',
  BOOKS = 'Book Tracker',
  HOMEWORK = 'Homework Tracker',
  PROJECTS = 'Project Planner',
  MEAL_PLANNER = 'Meal Planner',
  FOOD_TRACKER = 'Food & Calorie Tracker',
  WORKOUT_PLANNER = 'Workout Planner',
  MEASUREMENT_TRACKER = 'Body Measurements',
  BIRTHDAY_TRACKER = 'Birthday Tracker',
  EVENT_TRACKER = 'Event Tracker',
  CLIENT_TRACKER = 'Client & Appointments',
  APPOINTMENT_TRACKER = 'Appointments', // Can be part of Client Tracker or separate
  SOCIAL_MEDIA_PLANNER = 'Social Media Planner',
}

export type AllDataTypes = Transaction | TodoTask | GroceryItem | Note | NoteFolder | Movie | TVShow | Habit | Book | Homework | Project | Meal | Recipe | FoodLog | FoodItem | Workout | Exercise | Measurement | Birthday | Event | Client | Appointment | SocialMediaPost;

export interface TrashItem {
  id: string;
  deletedAt: number;
  originalSection: AppSection | 'NoteFolders' | 'Recipes' | 'FoodItems' | 'Exercises';
  data: AllDataTypes;
}


export interface BackupData {
  transactions: Transaction[];
  tasks: TodoTask[];
  groceryItems: GroceryItem[];
  notes: Note[];
  noteFolders: NoteFolder[];
  waterData: WaterData;
  movies: Movie[];
  tvShows: TVShow[];
  habits: Habit[];
  books: Book[];
  homeworks: Homework[];
  projects: Project[];
  meals: Meal[];
  recipes: Recipe[];
  foodLogs: FoodLog[];
  foodItems: FoodItem[];
  workouts: Workout[];
  exercises: Exercise[];
  measurements: Measurement[];
  birthdays: Birthday[];
  events: Event[];
  clients: Client[];
  appointments: Appointment[];
  socialMediaPosts: SocialMediaPost[];
  trashItems: TrashItem[];
  activeSection: AppSection | null;
  backupDate: string;
  appName: string;
  version: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface SearchResult {
    id: string;
    title: string;
    context: string;
    section: AppSection;
    originalId: string;
}