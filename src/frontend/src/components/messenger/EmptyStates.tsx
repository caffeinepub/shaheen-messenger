export default {
  NoConversationSelected: function NoConversationSelected() {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4 max-w-md px-4">
          <img 
            src="/assets/generated/shaheen-empty-state.dim_800x600.png" 
            alt="No conversation selected" 
            className="w-64 h-48 mx-auto object-contain opacity-60"
          />
          <h3 className="text-xl font-semibold text-foreground">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a chat from the sidebar or start a new conversation
          </p>
        </div>
      </div>
    );
  },

  NoMessages: function NoMessages() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3 max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <span className="text-3xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">No messages yet</h3>
          <p className="text-muted-foreground text-sm">
            Start the conversation by sending a message below
          </p>
        </div>
      </div>
    );
  },
};
