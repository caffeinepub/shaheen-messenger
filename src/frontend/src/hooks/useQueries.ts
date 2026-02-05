import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Preview, Message, ConversationId } from '../backend';

export function useGetConversations() {
  const { actor, isFetching } = useActor();

  return useQuery<Preview[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useGetOrCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      const otherUser = Principal.fromText(otherUserPrincipal);
      return actor.getOrCreateConversation(otherUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useGetConversationMessages(conversationId: ConversationId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', conversationId?.toString()],
    queryFn: async () => {
      if (!actor || conversationId === null) return [];
      return actor.getConversationMessages(conversationId);
    },
    enabled: !!actor && !isFetching && conversationId !== null,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: ConversationId; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendMessage(conversationId, text);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
