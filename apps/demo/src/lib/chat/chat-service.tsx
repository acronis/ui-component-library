import React, {
  createContext,
  use,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { chatReducer, createInitialState } from './chat-reducer';
import {
  ChatState,
  ChatService,
  ChatMessage,
  BotMode,
  BotConfig,
} from './types';
import { ChatStorage } from './storage';
import { ElizaBot } from './bots/eliza';
import { Hal9000Bot } from './bots/hal9000';

// Bot configurations
const BOT_CONFIGS: Record<BotMode, BotConfig> = {
  eliza: {
    id: 'eliza',
    name: 'ELIZA',
    description: 'Classic psychotherapist chatbot',
    avatar: '🧑‍⚕️',
    responseDelay: { min: 800, max: 1500 },
  },
  hal9000: {
    id: 'hal9000',
    name: 'HAL 9000',
    description: '2001: A Space Odyssey AI',
    avatar: '🔴',
    responseDelay: { min: 1000, max: 2000 },
  },
  conversation: {
    id: 'conversation',
    name: 'ELIZA ↔ HAL',
    description: 'Watch ELIZA and HAL 9000 talk to each other',
    avatar: '💬',
    responseDelay: { min: 1000, max: 1500 },
  },
};

// Bot instances
const elizaBot = new ElizaBot();
const hal9000Bot = new Hal9000Bot();

const ChatContext = createContext<ChatService | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, createInitialState());

  // The active bot is fully derived from the current mode (and, in conversation
  // mode, from who spoke last), so compute it during render rather than syncing
  // it into state from an effect.
  const botInstance = useMemo<ElizaBot | Hal9000Bot>(() => {
    if (state.botMode === 'hal9000') {
      return hal9000Bot;
    }
    if (state.botMode === 'conversation') {
      const lastBotMessage = state.messages
        .filter((m) => m.sender === 'bot')
        .pop();
      const lastBot = lastBotMessage?.metadata?.botMode;
      return lastBot === 'hal9000' ? elizaBot : hal9000Bot;
    }
    return elizaBot;
  }, [state.botMode, state.messages]);

  // Use refs to always have access to current values
  const stateRef = React.useRef(state);
  const botInstanceRef = React.useRef(botInstance);

  // Update refs when values change
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    botInstanceRef.current = botInstance;
  }, [botInstance]);

  // Load session on mount
  useEffect(() => {
    if (ChatStorage.isAvailable()) {
      const savedState = ChatStorage.load();
      if (savedState) {
        dispatch({ type: 'LOAD_SESSION', payload: savedState });
      }
    }
  }, []);

  // Auto-save session when state changes
  useEffect(() => {
    if (ChatStorage.isAvailable()) {
      ChatStorage.save(state);
    }
  }, [state]);

  const generateBotResponse = async (content: string): Promise<void> => {
    const trimmed = content.trim();
    if (!trimmed || !botInstanceRef.current) return;

    // Set typing indicator
    dispatch({ type: 'SET_TYPING', payload: true });

    let timeoutId: NodeJS.Timeout;

    // Determine which bot is responding
    const currentBotMode =
      stateRef.current.botMode === 'conversation'
        ? botInstanceRef.current === elizaBot
          ? 'eliza'
          : 'hal9000'
        : stateRef.current.botMode;

    const responsePromise = botInstanceRef.current
      .generateResponse(trimmed, stateRef.current.messages)
      .then((response) => {
        clearTimeout(timeoutId);
        return { response, botMode: currentBotMode };
      })
      .catch((err) => {
        console.error('Bot generateResponse error:', err);
        clearTimeout(timeoutId);
        throw err;
      });

    const timeoutPromise = new Promise<{ response: string; botMode: BotMode }>(
      (_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Response timeout'));
        }, 10000);
      }
    );

    Promise.race([responsePromise, timeoutPromise])
      .then(({ response: responseContent, botMode: respondingBot }) => {
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: responseContent,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
          metadata: {
            botMode: respondingBot,
          },
        };
        dispatch({ type: 'RECEIVE_MESSAGE', payload: botMessage });

        // In conversation mode, trigger another response automatically
        if (stateRef.current.botMode === 'conversation') {
          setTimeout(() => {
            generateBotResponse(responseContent);
          }, 3000);
        }
      })
      .catch((error) => {
        console.error('Bot response error:', error);
        clearTimeout(timeoutId);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to generate response' });
        dispatch({ type: 'SET_TYPING', payload: false });
      });
  };

  const sendMessage = async (content: string): Promise<ChatMessage> => {
    // Validate input
    const trimmed = content.trim();
    if (!trimmed) {
      dispatch({ type: 'SET_ERROR', payload: 'Message cannot be empty' });
      throw new Error('Message cannot be empty');
    }

    if (trimmed.length > 500) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Message too long (max 500 characters)',
      });
      throw new Error('Message too long');
    }

    // Clear any existing error
    dispatch({ type: 'CLEAR_ERROR' });

    // Create and return user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    // Send user message immediately
    dispatch({ type: 'SEND_MESSAGE', payload: trimmed });

    // Generate bot response asynchronously without blocking
    console.log(
      'Sending message to bot:',
      botInstanceRef.current?.constructor.name
    );

    if (!botInstanceRef.current) {
      console.error('Bot instance is null!');
      dispatch({ type: 'SET_ERROR', payload: 'Bot not initialized' });
      dispatch({ type: 'SET_TYPING', payload: false });
      return userMessage;
    }

    let timeoutId: NodeJS.Timeout;

    // Determine which bot is responding
    const currentBotMode =
      stateRef.current.botMode === 'conversation'
        ? botInstanceRef.current === elizaBot
          ? 'eliza'
          : 'hal9000'
        : stateRef.current.botMode;

    const responsePromise = botInstanceRef.current
      .generateResponse(trimmed, stateRef.current.messages)
      .then((response) => {
        console.log('Bot response received:', response);
        clearTimeout(timeoutId); // Cancel timeout when response arrives
        return { response, botMode: currentBotMode };
      })
      .catch((err) => {
        console.error('Bot generateResponse error:', err);
        clearTimeout(timeoutId); // Cancel timeout on error too
        throw err;
      });

    const timeoutPromise = new Promise<{ response: string; botMode: BotMode }>(
      (_, reject) => {
        timeoutId = setTimeout(() => {
          console.log('Bot response timeout!');
          reject(new Error('Response timeout'));
        }, 10000);
      }
    );

    Promise.race([responsePromise, timeoutPromise])
      .then(({ response: responseContent, botMode: respondingBot }) => {
        console.log('Creating bot message with content:', responseContent);
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: responseContent,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
          metadata: {
            botMode: respondingBot,
          },
        };
        dispatch({ type: 'RECEIVE_MESSAGE', payload: botMessage });

        // In conversation mode, trigger another response automatically
        if (stateRef.current.botMode === 'conversation') {
          setTimeout(() => {
            // Generate next bot response without adding user message
            generateBotResponse(responseContent);
          }, 1500);
        }
      })
      .catch((error) => {
        console.error('Bot response error:', error);
        clearTimeout(timeoutId); // Ensure timeout is cleared
        const errorMessage =
          error.message === 'Response timeout'
            ? 'Bot response timed out. Please try again.'
            : 'Failed to generate response';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_TYPING', payload: false });
      });

    return userMessage;
  };

  const answerQuestion = async (option: string): Promise<void> => {
    dispatch({ type: 'ANSWER_QUESTION', payload: option });

    try {
      const responseContent = await botInstanceRef.current.generateResponse(
        option,
        stateRef.current.messages
      );

      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: responseContent,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          botMode: stateRef.current.botMode,
        },
      };

      dispatch({ type: 'RECEIVE_MESSAGE', payload: botMessage });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate response' });
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const getMessages = (): ChatMessage[] => {
    return stateRef.current.messages;
  };

  const clearMessages = (): void => {
    dispatch({ type: 'CLEAR_SESSION' });
  };

  const setBotMode = (mode: BotMode): void => {
    dispatch({ type: 'SET_BOT_MODE', payload: mode });
  };

  const getBotMode = (): BotMode => {
    return stateRef.current.botMode;
  };

  const getAvailableBots = (): BotConfig[] => {
    return Object.values(BOT_CONFIGS);
  };

  const saveSession = (): void => {
    ChatStorage.save(stateRef.current);
  };

  const loadSession = (): boolean => {
    const savedState = ChatStorage.load();
    if (savedState) {
      dispatch({ type: 'LOAD_SESSION', payload: savedState });
      return true;
    }
    return false;
  };

  const clearSession = (): void => {
    dispatch({ type: 'CLEAR_SESSION' });
  };

  const listenersRef = React.useRef<Set<(state: ChatState) => void>>(new Set());

  const subscribe = (listener: (state: ChatState) => void): (() => void) => {
    listenersRef.current.add(listener);
    listener(state); // Call immediately with current state
    return () => {
      listenersRef.current.delete(listener);
    };
  };

  // Notify all listeners when state changes
  React.useEffect(() => {
    listenersRef.current.forEach((listener) => listener(state));
  }, [state]);

  const getState = (): ChatState => {
    return stateRef.current;
  };

  const service: ChatService = useMemo(
    () => ({
      sendMessage,
      getMessages,
      clearMessages,
      setBotMode,
      getBotMode,
      getAvailableBots,
      saveSession,
      loadSession,
      clearSession,
      subscribe,
      getState,
      answerQuestion,
    }),
    [
      sendMessage,
      getMessages,
      clearMessages,
      setBotMode,
      getBotMode,
      getAvailableBots,
      saveSession,
      loadSession,
      clearSession,
      subscribe,
      getState,
    ]
  );

  return <ChatContext value={service}>{children}</ChatContext>;
}

export function useChat(): ChatService {
  const context = use(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Export for testing
export { ChatContext };
