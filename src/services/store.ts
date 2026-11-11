import { Category, ToolDefinition, AdSlotConfig, SiteSettings, UserProfile, AuditLog, AdPosition } from '../types';
import { INITIAL_CATEGORIES, INITIAL_TOOLS, INITIAL_AD_SLOTS, INITIAL_SETTINGS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from './seed';

const STORAGE_KEY_CATEGORIES = 'omnitools_categories';
const STORAGE_KEY_TOOLS = 'omnitools_tools';
const STORAGE_KEY_AD_SLOTS = 'omnitools_ad_slots';
const STORAGE_KEY_SETTINGS = 'omnitools_settings';
const STORAGE_KEY_USERS = 'omnitools_users';
const STORAGE_KEY_AUDIT = 'omnitools_audit_logs';
const STORAGE_KEY_FAVORITES = 'omnitools_favorites';
const STORAGE_KEY_RECENTS = 'omnitools_recents';
const STORAGE_KEY_CURRENT_USER = 'omnitools_current_user';

class ToolStoreService {
  private categories: Category[] = [];
  private tools: ToolDefinition[] = [];
  private adSlots: AdSlotConfig[] = [];
  private settings: SiteSettings = INITIAL_SETTINGS;
  private users: UserProfile[] = [];
  private auditLogs: AuditLog[] = [];
  private favorites: string[] = []; // tool IDs
  private recents: string[] = []; // tool IDs
  private currentUser: UserProfile = INITIAL_USERS[0]; // defaults to admin for demo control

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      this.categories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;

      const storedTools = localStorage.getItem(STORAGE_KEY_TOOLS);
      this.tools = storedTools ? JSON.parse(storedTools) : INITIAL_TOOLS;

      const storedAdSlots = localStorage.getItem(STORAGE_KEY_AD_SLOTS);
      this.adSlots = storedAdSlots ? JSON.parse(storedAdSlots) : INITIAL_AD_SLOTS;

      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      this.settings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SETTINGS;

      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      this.auditLogs = storedAudit ? JSON.parse(storedAudit) : INITIAL_AUDIT_LOGS;

      const storedFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      this.favorites = storedFavs ? JSON.parse(storedFavs) : ['image-compressor', 'json-formatter', 'qr-code-generator'];

      const storedRecents = localStorage.getItem(STORAGE_KEY_RECENTS);
      this.recents = storedRecents ? JSON.parse(storedRecents) : ['image-compressor', 'percentage-calculator'];

      const storedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      this.currentUser = storedUser ? JSON.parse(storedUser) : INITIAL_USERS[0];
    } catch {
      this.categories = INITIAL_CATEGORIES;
      this.tools = INITIAL_TOOLS;
      this.adSlots = INITIAL_AD_SLOTS;
      this.settings = INITIAL_SETTINGS;
      this.users = INITIAL_USERS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEY_TOOLS, JSON.stringify(this.tools));
      localStorage.setItem(STORAGE_KEY_AD_SLOTS, JSON.stringify(this.adSlots));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(this.favorites));
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(this.recents));
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('Storage persistence warning:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  }

  public getCategoryById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  public createCategory(cat: Omit<Category, 'id'>): Category {
    const id = cat.slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory: Category = { ...cat, id };
    this.categories.push(newCategory);
    this.logAudit('CREATE_CATEGORY', newCategory.name, `Added category with id ${id}`);
    this.persist();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>): void {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...updates };
      this.logAudit('UPDATE_CATEGORY', this.categories[index].name, `Updated category properties`);
      this.persist();
    }
  }

  public deleteCategory(id: string): void {
    const cat = this.getCategoryById(id);
    this.categories = this.categories.filter(c => c.id !== id);
    this.logAudit('DELETE_CATEGORY', cat?.name || id, `Deleted category`);
    this.persist();
  }

  // --- Tools ---
  public getAllTools(): ToolDefinition[] {
    return [...this.tools];
  }

  public getPublishedTools(): ToolDefinition[] {
    return this.tools.filter(t => t.published);
  }

  public getToolBySlug(slug: string): ToolDefinition | undefined {
    return this.tools.find(t => t.slug.toLowerCase() === slug.toLowerCase());
  }

  public getToolById(id: string): ToolDefinition | undefined {
    return this.tools.find(t => t.id === id);
  }

  public getFeaturedTools(): ToolDefinition[] {
    return this.tools.filter(t => t.published && t.featured);
  }

  public getPopularTools(limit = 6): ToolDefinition[] {
    return this.tools
      .filter(t => t.published)
      .sort((a, b) => b.executionCount - a.executionCount)
      .slice(0, limit);
  }

  public getRecentTools(limit = 6): ToolDefinition[] {
    return this.tools
      .filter(t => t.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public createTool(toolData: Omit<ToolDefinition, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>): ToolDefinition {
    const now = new Date().toISOString();
    const id = toolData.slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTool: ToolDefinition = {
      ...toolData,
      id,
      executionCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.tools.push(newTool);
    this.logAudit('CREATE_TOOL', newTool.name, `Registered new tool`);
    this.persist();
    return newTool;
  }

  public updateTool(id: string, updates: Partial<ToolDefinition>): void {
    const index = this.tools.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tools[index] = {
        ...this.tools[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.logAudit('UPDATE_TOOL', this.tools[index].name, `Updated tool definition`);
      this.persist();
    }
  }

  public deleteTool(id: string): void {
    const tool = this.getToolById(id);
    this.tools = this.tools.filter(t => t.id !== id);
    this.logAudit('DELETE_TOOL', tool?.name || id, `Deleted tool`);
    this.persist();
  }

  public recordExecution(toolId: string): void {
    const tool = this.getToolById(toolId);
    if (tool) {
      tool.executionCount += 1;
      this.addRecentTool(toolId);
      this.persist();
    }
  }

  // --- Ad Slots ---
  public getAdSlots(): AdSlotConfig[] {
    return [...this.adSlots];
  }

  public getAdSlotByPosition(pos: AdPosition): AdSlotConfig | undefined {
    return this.adSlots.find(s => s.position === pos);
  }

  public isAdEnabled(pos: AdPosition): boolean {
    if (!this.settings.adsEnabled) return false;
    const slot = this.getAdSlotByPosition(pos);
    return !!slot?.enabled;
  }

  public updateAdSlot(id: string, updates: Partial<AdSlotConfig>): void {
    const index = this.adSlots.findIndex(s => s.id === id);
    if (index !== -1) {
      this.adSlots[index] = { ...this.adSlots[index], ...updates };
      this.logAudit('UPDATE_AD_SLOT', this.adSlots[index].name, `Updated slot configuration`);
      this.persist();
    }
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.logAudit('SETTINGS_UPDATE', 'Site Settings', `Updated global site settings`);
    this.persist();
  }

  // --- Users & Roles ---
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile): void {
    this.currentUser = user;
    this.persist();
  }

  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public updateUserRole(id: string, role: 'admin' | 'user'): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.role = role;
      if (this.currentUser.id === id) {
        this.currentUser.role = role;
      }
      this.logAudit('USER_ROLE_CHANGE', user.email, `Changed role to ${role}`);
      this.persist();
    }
  }

  public updateUserStatus(id: string, status: 'active' | 'suspended'): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = status;
      this.logAudit('USER_STATUS_CHANGE', user.email, `Changed status to ${status}`);
      this.persist();
    }
  }

  // --- Favorites & Recents ---
  public getFavorites(): string[] {
    return [...this.favorites];
  }

  public isFavorite(toolId: string): boolean {
    return this.favorites.includes(toolId);
  }

  public toggleFavorite(toolId: string): boolean {
    const index = this.favorites.indexOf(toolId);
    let state = false;
    if (index === -1) {
      this.favorites.push(toolId);
      state = true;
    } else {
      this.favorites.splice(index, 1);
      state = false;
    }
    this.persist();
    return state;
  }

  public getUserRecents(): string[] {
    return [...this.recents];
  }

  public addRecentTool(toolId: string): void {
    this.recents = [toolId, ...this.recents.filter(id => id !== toolId)].slice(0, 8);
    this.persist();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public logAudit(action: string, target: string, details?: string): void {
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: this.currentUser.email,
      action,
      target,
      details
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) {
      this.auditLogs.pop();
    }
  }

  // --- Reset to Factory Defaults ---
  public resetToDefaults(): void {
    this.categories = INITIAL_CATEGORIES;
    this.tools = INITIAL_TOOLS;
    this.adSlots = INITIAL_AD_SLOTS;
    this.settings = INITIAL_SETTINGS;
    this.users = INITIAL_USERS;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.favorites = ['image-compressor', 'json-formatter', 'qr-code-generator'];
    this.recents = ['image-compressor', 'percentage-calculator'];
    this.currentUser = INITIAL_USERS[0];
    this.persist();
  }
}

export const toolStore = new ToolStoreService();
