import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Int "mo:core/Int";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Message and Conversation Types
  public type UserId = Principal;
  public type ConversationId = Nat;
  public type MessageId = Nat;

  public type Message = {
    id : MessageId;
    author : UserId;
    text : Text;
    timestamp : Time.Time;
    conversationId : ConversationId;
  };

  public type Conversation = {
    id : ConversationId;
    participant1 : UserId;
    participant2 : UserId;
    messages : List.List<MessageId>;
  };

  // Maps for data storage
  var nextConversationId = 0;
  var nextMessageId = 0;

  let conversations = Map.empty<ConversationId, Conversation>();
  let messages = Map.empty<MessageId, Message>();
  let userConversations = Map.empty<UserId, List.List<ConversationId>>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper Functions
  func findConversation(user1 : UserId, user2 : UserId) : ?ConversationId {
    let user1Conversations = getUserConversations(user1);
    switch (
      user1Conversations.find(
        func(conversationId) {
          switch (conversations.get(conversationId)) {
            case (?conv) {
              (conv.participant1 == user1 and conv.participant2 == user2) or (conv.participant1 == user2 and conv.participant2 == user1);
            };
            case (null) { false };
          };
        }
      )
    ) {
      case (?id) { ?id };
      case (null) { null };
    };
  };

  func getUserConversations(user : UserId) : List.List<ConversationId> {
    switch (userConversations.get(user)) {
      case (?convs) { convs };
      case (null) { List.empty<ConversationId>() };
    };
  };

  func addConversationToUser(user : UserId, conversationId : ConversationId) {
    let current = getUserConversations(user);
    current.add(conversationId);
    userConversations.add(user, current);
  };

  func isParticipant(caller : UserId, conversationId : ConversationId) : Bool {
    switch (conversations.get(conversationId)) {
      case (?conv) {
        conv.participant1 == caller or conv.participant2 == caller;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getUserType() : async Principal {
    caller;
  };

  // Start or Get Conversation
  public shared ({ caller }) func getOrCreateConversation(otherUser : UserId) : async ConversationId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create conversations");
    };

    let conversationId : ConversationId = switch (findConversation(caller, otherUser)) {
      case (?existingId) { existingId };
      case (null) {
        nextConversationId += 1;
        let newId = nextConversationId;
        let newConversation : Conversation = {
          id = newId;
          participant1 = caller;
          participant2 = otherUser;
          messages = List.empty<MessageId>();
        };
        conversations.add(newId, newConversation);
        addConversationToUser(caller, newId);
        addConversationToUser(otherUser, newId);
        newId;
      };
    };
    conversationId;
  };

  // Send Message
  public shared ({ caller }) func sendMessage(conversationId : ConversationId, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    if (not conversations.containsKey(conversationId)) {
      Runtime.trap("Conversation does not exist");
    };

    if (not isParticipant(caller, conversationId)) {
      Runtime.trap("Unauthorized: You are not a participant in this conversation");
    };

    nextMessageId += 1;
    let messageId = nextMessageId;
    let newMessage = {
      id = messageId;
      author = caller;
      text;
      timestamp = Time.now();
      conversationId;
    };

    messages.add(messageId, newMessage);
    switch (conversations.get(conversationId)) {
      case (?conv) {
        conv.messages.add(messageId);
      };
      case (null) { Runtime.unreachable() };
    };
  };

  // Fetch Conversation Messages
  public query ({ caller }) func getConversationMessages(conversationId : ConversationId) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (conversations.get(conversationId)) {
      case (?conv) {
        if (not isParticipant(caller, conversationId)) {
          Runtime.trap("Unauthorized: You are not a participant in this conversation");
        };

        conv.messages.map<MessageId, Message>(
          func(msgId) {
            switch (messages.get(msgId)) {
              case (?msg) { msg };
              case (null) {
                {
                  id = 0;
                  author = caller;
                  text = "Message not found";
                  timestamp = 0;
                  conversationId;
                } : Message;
              };
            };
          }
        ).toArray();
      };
      case (null) { Runtime.trap("Conversation not found") };
    };
  };

  // Fetch Conversation List
  module ConversationPreview {
    public type ComparisonResults = {
      #greater;
      #less;
      #equal;
    };

    public type Preview = {
      conversationId : ConversationId;
      lastMessage : Text;
      lastActivity : Time.Time;
    };

    public func compare(a : Preview, b : Preview) : Order.Order {
      Int.compare(b.lastActivity, a.lastActivity);
    };
  };

  public query ({ caller }) func getConversations() : async [ConversationPreview.Preview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let userConvs = switch (userConversations.get(caller)) {
      case (?convs) { convs };
      case (null) { List.empty<ConversationId>() };
    };

    let previews = userConvs.map<ConversationId, ConversationPreview.Preview>(
      func(conversationId) {
        switch (conversations.get(conversationId)) {
          case (?conv) {
            let lastMessageId = if (conv.messages.size() > 0) {
              conv.messages.at(conv.messages.size() - 1) : MessageId;
            } else {
              0;
            };
            let lastMessage = switch (messages.get(lastMessageId)) {
              case (?msg) { msg };
              case (null) {
                {
                  id = 0;
                  author = caller;
                  text = "No messages";
                  timestamp = 0;
                  conversationId = conversationId;
                } : Message;
              };
            };
            {
              conversationId;
              lastMessage = lastMessage.text;
              lastActivity = lastMessage.timestamp;
            } : ConversationPreview.Preview;
          };
          case (null) {
            {
              conversationId = 0;
              lastMessage = "No messages";
              lastActivity = 0;
            } : ConversationPreview.Preview;
          };
        };
      }
    );

    let previewsArray = previews.toArray();
    previewsArray.sort();
  };
};
