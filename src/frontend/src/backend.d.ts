import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Time = bigint;
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    text: string;
    author: UserId;
    conversationId: ConversationId;
    timestamp: Time;
}
export interface Preview {
    lastActivity: Time;
    lastMessage: string;
    conversationId: ConversationId;
}
export interface UserProfile {
    name: string;
}
export type ConversationId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversationMessages(conversationId: ConversationId): Promise<Array<Message>>;
    getConversations(): Promise<Array<Preview>>;
    getOrCreateConversation(otherUser: UserId): Promise<ConversationId>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserType(): Promise<Principal>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: ConversationId, text: string): Promise<void>;
}
