import ProfileTypes "profile";

module {
  public type AnimalType = ProfileTypes.AnimalType;

  // In the account/results domain, userId is an email string (the stable key)
  public type UserId = Text;

  // ── Per-quiz result entry types ───────────────────────────────────────────

  /// A single animal quiz attempt, stored in the animal_results collection.
  public type AnimalResultEntry = {
    id : Nat;
    userId : UserId;
    animalType : AnimalType;
    score : Nat;
    createdAt : Int;
  };

  /// A single emotion quiz attempt, stored in the emotion_results collection.
  public type EmotionResultEntry = {
    id : Nat;
    userId : UserId;
    emotionType : Text;     // top emotion name
    score : Float;           // percentage of top emotion
    createdAt : Int;
  };

  /// A single dark-side quiz attempt, stored in the darkside_results collection.
  public type DarkSideResultEntry = {
    id : Nat;
    userId : UserId;
    personalityType : Text;       // dominant dark-side type name
    dominantPercentage : Float;
    fullResultJson : Text;         // JSON of full DarkSideScore[]
    createdAt : Int;
  };

  /// Admin view of per-user result history across all three quiz types.
  public type UserResultsAdmin = {
    animal : [AnimalResultEntry];
    emotion : [EmotionResultEntry];
    darkSide : [DarkSideResultEntry];
  };

  /// Counts returned by adminGetAllResultCounts.
  public type ResultCounts = {
    totalUsers : Nat;
    animalResults : Nat;
    emotionResults : Nat;
    darkSideResults : Nat;
  };

  /// The 10 philosophical emotions.
  public type EmotionType = {
    #Fear;
    #Anger;
    #Happiness;
    #Sadness;
    #Love;
    #Anxiety;
    #Desire;
    #Guilt;
    #Awe;
    #Peace;
  };

  /// Score for a single emotion (shared-safe, no var fields).
  public type EmotionScore = {
    emotion : EmotionType;
    count : Nat;
    percentage : Float;
  };

  /// Summary of top emotions from a quiz session (shared-safe).
  public type EmotionResultSummary = {
    topEmotions : [EmotionScore];
    takenAt : Int;
  };

  /// Full emotion result record stored per user (shared-safe).
  public type EmotionResult = {
    userId : Text;
    topEmotions : [EmotionScore];
    takenAt : Int;
  };

  /// The 7 dark-side personality types (criminology/psychology framing).
  public type DarkSideType = {
    #IntrovertedThinker;
    #ExtravertedThinker;
    #IntrovertedFeeler;
    #ExtravertedFeeler;
    #Manipulator;
    #Psychopath;
    #Sociopath;
  };

  /// Score for a single dark-side type (shared-safe, no var fields).
  public type DarkSideScore = {
    darkType : DarkSideType;
    count : Nat;
    percentage : Float;
  };

  /// Summary of top dark-side types from a quiz session (shared-safe).
  public type DarkSideResultSummary = {
    topTypes : [DarkSideScore];
    takenAt : Int;
  };

  /// Internal user account (contains mutable fields — NOT shared).
  public type UserAccountInternal = {
    id : Text;                          // email used as stable key
    email : Text;
    var passwordHash : Text;
    var name : Text;
    var age : Nat;
    var gender : Text;
    var createdAt : Int;
    var lastLogin : Int;
    var animalArchetype : ?AnimalType;
    var emotionResult : ?EmotionResultSummary;
    var darkSideResult : ?DarkSideResultSummary;
    var securityQuestion : Text;
    var securityAnswer : Text;          // hashed (same algo as password)
    var securityHint : Text;            // plain-text memo shown on forgot-password (NOT secret)
    var securityQuestionUpdatedAt : ?Int; // null for users who never updated via the profile page
  };

  /// Public-facing user account (shared — safe to return over Candid).
  public type UserAccount = {
    id : Text;
    email : Text;
    name : Text;
    age : Nat;
    gender : Text;
    createdAt : Int;
    lastLogin : Int;
    animalArchetype : ?AnimalType;
    emotionResult : ?EmotionResultSummary;
    darkSideResult : ?DarkSideResultSummary;
    securityQuestionUpdatedAt : ?Int;
  };

  /// User account including the password hash — admin only.
  public type UserAccountAdmin = {
    id : Text;
    email : Text;
    passwordHash : Text;
    name : Text;
    age : Nat;
    gender : Text;
    createdAt : Int;
    lastLogin : Int;
    animalArchetype : ?AnimalType;
    emotionResult : ?EmotionResultSummary;
    darkSideResult : ?DarkSideResultSummary;
  };

  /// Session token returned on successful login.
  public type SessionToken = {
    token : Text;
    email : Text;
    expiresAt : Int;
  };

  /// Feedback entry submitted by a user.
  public type FeedbackEntry = {
    id : Text;
    userEmail : Text;
    feedback : Text;
    timestamp : Int;
  };

  /// Internal feedback entry (mutable fields).
  public type FeedbackEntryInternal = {
    id : Text;
    userEmail : Text;
    var feedback : Text;
    var timestamp : Int;
  };

  /// A single Seven Deadly Sins quiz attempt, stored in the sevenSins_results collection.
  public type SevenSinsResultEntry = {
    id : Nat;
    userId : UserId;
    name : Text;
    pride : Float;
    greed : Float;
    wrath : Float;
    envy : Float;
    gluttony : Float;
    lust : Float;
    sloth : Float;
    dominantSin : Text;
    createdAt : Int;
  };

  /// Application-level configuration.
  public type AdminConfig = {
    adminPrincipal : Text;
    isDraftMode : Bool;
  };

  /// Internal admin config (mutable fields).
  public type AdminConfigInternal = {
    var adminPrincipal : Text;
    var isDraftMode : Bool;
  };

  /// Analytics summary for the admin dashboard.
  public type AppAnalytics = {
    totalUsers : Nat;
    totalFeedback : Nat;
    totalEmotionResults : Nat;
    totalAnimalResults : Nat;
    animalResultsCount : Nat;
    emotionResultsCount : Nat;
    darkSideResultsCount : Nat;
  };
};
