"use client";

import { create } from 'zustand';
import { InstagramPost, InstagramAccount, DateFilter, PostSortType, AutomationRule, InstagramInsights } from './types';
import { InstagramAPI } from './api';
import { persist, PersistOptions } from 'zustand/middleware';

interface PaginationState {
  nextPageToken: string | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

interface InstagramStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  api: InstagramAPI | null;
  setApi: (api: InstagramAPI | null) => void;
  account: InstagramAccount | null;
  setAccount: (account: InstagramAccount | null) => void;
  posts: InstagramPost[];
  setPosts: (posts: InstagramPost[]) => void;
  stats: InstagramInsights | null;
  setStats: (stats: InstagramInsights | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  sortType: PostSortType;
  setSortType: (type: PostSortType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAIKey: string | null;
  setOpenAIKey: (key: string | null) => void;
  hasOpenAIEnabled: () => boolean;
  fetchPosts: (filter?: DateFilter, after?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  initializeAPI: (accessToken: string, userId: string) => Promise<boolean>;
  fetchAccount: () => Promise<void>;
  automationRules: AutomationRule[];
  addAutomationRule: (rule: AutomationRule) => void;
  updateAutomationRule: (ruleId: string, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (ruleId: string) => void;
  getPostAutomation: (postId: string) => AutomationRule | undefined;
  disconnect: () => void;
}

interface InstagramState {
  api: InstagramAPI | null;
  loading: boolean;
  error: string | null;
  posts: InstagramPost[];
  stats: InstagramInsights | null;
  account: InstagramAccount | null;
  openAIKey: string | null;
}

type InstagramPersist = {
  accessToken: string | null;
  account: InstagramAccount | null;
  dateFilter: DateFilter;
  sortType: PostSortType;
  openAIKey: string | null;
  automationRules: AutomationRule[];
}

const initialState: InstagramState = {
  api: null,
  loading: false,
  error: null,
  posts: [],
  stats: null,
  account: null,
  openAIKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || null,
};

const DEFAULT_PAGINATION_STATE: PaginationState = {
  nextPageToken: null,
  hasMore: true,
  loading: false,
  error: null,
};

const persistOptions: PersistOptions<InstagramStore, InstagramPersist> = {
  name: 'instagram-storage',
  partialize: (state) => ({
    accessToken: state.accessToken,
    account: state.account,
    dateFilter: state.dateFilter,
    sortType: state.sortType,
    openAIKey: state.openAIKey,
    automationRules: state.automationRules,
  }),
};

export const useInstagramStore = create<InstagramStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      setAccessToken: (token) => {
        if (token) {
          localStorage.setItem('instagram_token', token);
          set({ accessToken: token });
        } else {
          get().disconnect();
        }
      },
      disconnect: () => {
        localStorage.removeItem('instagram_token');
        localStorage.removeItem('instagram_user_id');
        set({ 
          accessToken: null,
          api: null, 
          account: null,
          posts: [],
          stats: null,
          error: null 
        });
      },
      api: null,
      setApi: (api) => set({ api }),
      account: null,
      setAccount: (account) => set({ account }),
      posts: [],
      setPosts: (posts) => set({ posts }),
      stats: null,
      setStats: (stats) => set({ stats }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      setError: (error) => set({ error }),
      dateFilter: '30days',
      setDateFilter: (filter) => {
        set({ dateFilter: filter });
        get().fetchPosts(filter);
        get().fetchStats();
      },
      sortType: 'date',
      setSortType: (type) => set({ sortType: type }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      openAIKey: null,
      setOpenAIKey: (key) => {
        if (key) {
          localStorage.setItem('openai_key', key);
        } else {
          localStorage.removeItem('openai_key');
        }
        set({ openAIKey: key });
      },
      hasOpenAIEnabled: () => {
        return !!get().openAIKey;
      },
      fetchPosts: async (filter?: DateFilter, after?: string) => {
        const { api } = get();
        if (!api) return;

        try {
          set({ loading: true, error: null });
          const response = await api.getPosts(filter || get().dateFilter, after);
          set({ 
            posts: after ? [...get().posts, ...response.data] : response.data,
            error: null 
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch posts' });
        } finally {
          set({ loading: false });
        }
      },
      fetchStats: async () => {
        const { api } = get();
        if (!api) return;

        try {
          set({ loading: true, error: null });
          const stats = await api.getInsights();
          set({ stats });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch insights' });
        } finally {
          set({ loading: false });
        }
      },
      initializeAPI: async (accessToken: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          // Salvar credenciais
          localStorage.setItem('instagram_token', accessToken);
          localStorage.setItem('instagram_user_id', userId);
          
          // Criar nova instância da API
          const api = new InstagramAPI(accessToken, userId);
          set({ api, accessToken });

          // Buscar dados da conta
          const account = await api.getAccount();
          if (!account) {
            throw new Error('Failed to fetch account data');
          }
          
          set({ account });

          // Buscar posts e estatísticas
          await get().fetchPosts();
          await get().fetchStats();

          return true;
        } catch (error) {
          get().disconnect();
          set({ error: error instanceof Error ? error.message : 'Failed to initialize API' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      fetchAccount: async () => {
        const { api } = get();
        if (!api) return;

        try {
          set({ loading: true, error: null });
          const account = await api.getAccount();
          set({ account });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch account' });
        } finally {
          set({ loading: false });
        }
      },
      automationRules: [],
      addAutomationRule: (rule) => {
        set((state) => ({ automationRules: [...state.automationRules, rule] }));
      },
      updateAutomationRule: (ruleId, updates) => {
        set((state) => ({
          automationRules: state.automationRules.map((rule) =>
            rule.id === ruleId ? { ...rule, ...updates } : rule
          ),
        }));
      },
      deleteAutomationRule: (ruleId) => {
        set((state) => ({
          automationRules: state.automationRules.filter((rule) => rule.id !== ruleId),
        }));
      },
      getPostAutomation: (postId) => {
        const { automationRules } = get();
        return automationRules.find((rule) => rule.postId === postId);
      },
    }),
    persistOptions
  )
);