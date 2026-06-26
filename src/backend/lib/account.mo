import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Types "../types/account";

module {
  public type AccountMap = Map.Map<Text, Types.UserAccountInternal>;
  public type FeedbackList = List.List<Types.FeedbackEntryInternal>;
  public type SessionMap = Map.Map<Text, Types.SessionToken>;

  // 7 days in nanoseconds (7 * 24 * 60 * 60 * 1_000_000_000)
  let SESSION_TTL_NS : Int = 604_800_000_000_000;

  /// Deterministic password hash: salt + password folded into a numeric string.
  /// Simple but sufficient for on-chain storage where the execution environment
  /// is already access-controlled.
  public func hashPassword(password : Text) : Text {
    let salt = "AnimalMind_salt_v1";
    let combined = salt # password;
    var h : Nat = 5381;
    for (c in combined.toIter()) {
      let code = c.toNat32().toNat();
      h := (h * 33 + code) % 4_294_967_296;
    };
    "hash_" # h.toText();
  };

  /// Verify a plain-text password against a stored hash.
  public func verifyPassword(password : Text, hash : Text) : Bool {
    hashPassword(password) == hash;
  };

  /// Generate a new session token for a given email.
  /// Token uniqueness relies on email + nanosecond timestamp.
  public func generateToken(email : Text, now : Int) : Types.SessionToken {
    let raw = email # "_" # now.toText();
    var h : Nat = 7919;
    for (c in raw.toIter()) {
      let code = c.toNat32().toNat();
      h := (h * 31 + code) % 1_000_000_000_000_000_007;
    };
    let token = "tok_" # h.toText();
    {
      token;
      email;
      expiresAt = now + SESSION_TTL_NS;
    };
  };

  /// Resolve the email from an active (non-expired) session token.
  /// Returns null if the token is missing or expired.
  public func resolveSession(sessions : SessionMap, token : Text, now : Int) : ?Text {
    switch (sessions.get(token)) {
      case null null;
      case (?sess) {
        if (now > sess.expiresAt) {
          null; // expired — do NOT mutate here; mixin handles removal
        } else {
          ?sess.email;
        };
      };
    };
  };

  /// Look up an account by email, returning the public form.
  public func getAccount(accounts : AccountMap, email : Text) : ?Types.UserAccount {
    switch (accounts.get(email)) {
      case null null;
      case (?internal) ?toPublic(internal);
    };
  };

  /// Look up the internal account (admin use — includes passwordHash).
  public func getAccountAdmin(accounts : AccountMap, email : Text) : ?Types.UserAccountAdmin {
    switch (accounts.get(email)) {
      case null null;
      case (?internal) ?toPublicAdmin(internal);
    };
  };

  /// Normalize an answer for secure comparison: lowercase and trim whitespace.
  func normalizeAnswer(answer : Text) : Text {
    answer.trim(#predicate(func(c) { c == ' ' })).toLower();
  };

  /// Create a new account and store it. Returns #ok or #err if email already exists.
  public func createAccount(
    accounts : AccountMap,
    email : Text,
    passwordHash : Text,
    name : Text,
    age : Nat,
    gender : Text,
    securityQuestion : Text,
    securityAnswer : Text,     // already hashed by the caller
    securityHint : Text,       // plain-text memo, stored as-is
    now : Int,
  ) : { #ok; #err : Text } {
    if (accounts.containsKey(email)) {
      return #err("An account with that email already exists.");
    };
    let account : Types.UserAccountInternal = {
      id = email;
      email;
      var passwordHash;
      var name;
      var age;
      var gender;
      var createdAt = now;
      var lastLogin = now;
      var animalArchetype = null;
      var emotionResult = null;
      var darkSideResult = null;
      var securityQuestion;
      var securityAnswer;
      var securityHint;
      var securityQuestionUpdatedAt = null;
    };
    accounts.add(email, account);
    #ok;
  };

  /// Return the security hint for a given email, or null if empty / account not found.
  public func getSecurityHint(accounts : AccountMap, email : Text) : ?Text {
    switch (accounts.get(email)) {
      case null null;
      case (?acc) {
        if (acc.securityHint == "") null else ?acc.securityHint;
      };
    };
  };

  /// Return the securityQuestionUpdatedAt timestamp for a given email.
  public func getSecurityQuestionUpdatedAt(accounts : AccountMap, email : Text) : ?Int {
    switch (accounts.get(email)) {
      case null null;
      case (?acc) acc.securityQuestionUpdatedAt;
    };
  };

  /// Update the security question, hashed answer, hint, and timestamp for a logged-in user.
  public func updateSecurityQuestion(
    accounts : AccountMap,
    email : Text,
    newQuestion : Text,
    newAnswerHash : Text,   // already normalized + hashed by the caller
    newHint : Text,
    now : Int,
  ) : { #ok; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("Account not found.");
      case (?acc) {
        acc.securityQuestion := newQuestion;
        acc.securityAnswer := newAnswerHash;
        acc.securityHint := newHint;
        acc.securityQuestionUpdatedAt := ?now;
        #ok;
      };
    };
  };

  /// Return the security question for a given email, or null if the account doesn't exist.
  public func getSecurityQuestion(accounts : AccountMap, email : Text) : ?Text {
    switch (accounts.get(email)) {
      case null null;
      case (?acc) {
        if (acc.securityQuestion == "") null else ?acc.securityQuestion;
      };
    };
  };

  /// Verify that the provided answer (plain-text) matches the stored hashed answer.
  public func verifySecurityAnswer(accounts : AccountMap, email : Text, answer : Text) : Bool {
    switch (accounts.get(email)) {
      case null false;
      case (?acc) {
        let normalized = normalizeAnswer(answer);
        hashPassword(normalized) == acc.securityAnswer;
      };
    };
  };

  /// Reset password using the security question + answer.
  public func resetPasswordWithSecurityQuestion(
    accounts : AccountMap,
    email : Text,
    question : Text,
    answer : Text,
    newPasswordHash : Text,
  ) : { #ok; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("User not found.");
      case (?acc) {
        if (acc.securityQuestion != question) return #err("Security question does not match.");
        let normalized = normalizeAnswer(answer);
        if (hashPassword(normalized) != acc.securityAnswer) return #err("Incorrect answer.");
        acc.passwordHash := newPasswordHash;
        #ok;
      };
    };
  };

  /// Update the lastLogin timestamp for an account.
  public func recordLogin(accounts : AccountMap, email : Text, now : Int) : () {
    switch (accounts.get(email)) {
      case null ();
      case (?acc) { acc.lastLogin := now };
    };
  };

  /// Update the emotion result on an account.
  public func saveEmotionResult(
    accounts : AccountMap,
    email : Text,
    summary : Types.EmotionResultSummary,
  ) : { #ok; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("Account not found.");
      case (?acc) {
        acc.emotionResult := ?summary;
        #ok;
      };
    };
  };

  /// Update the dark-side result on an account.
  public func saveDarkSideResult(
    accounts : AccountMap,
    email : Text,
    summary : Types.DarkSideResultSummary,
  ) : { #ok; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("Account not found.");
      case (?acc) {
        acc.darkSideResult := ?summary;
        #ok;
      };
    };
  };

  /// Update the animal archetype on an account.
  public func saveAnimalArchetype(
    accounts : AccountMap,
    email : Text,
    archetype : Types.AnimalType,
  ) : { #ok; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("Account not found.");
      case (?acc) {
        acc.animalArchetype := ?archetype;
        #ok;
      };
    };
  };

  /// Return all accounts as admin records (includes passwordHash).
  public func listAllAccounts(accounts : AccountMap) : [Types.UserAccountAdmin] {
    accounts.values().map<Types.UserAccountInternal, Types.UserAccountAdmin>(toPublicAdmin).toArray();
  };

  /// Delete an account by email. No-op if not found.
  public func deleteAccount(accounts : AccountMap, email : Text) : () {
    accounts.remove(email);
  };

  /// Add a feedback entry.
  public func addFeedback(
    feedbacks : FeedbackList,
    userEmail : Text,
    text : Text,
    now : Int,
  ) : () {
    let id = "fb_" # feedbacks.size().toText() # "_" # now.toText();
    let entry : Types.FeedbackEntryInternal = {
      id;
      userEmail;
      var feedback = text;
      var timestamp = now;
    };
    feedbacks.add(entry);
  };

  /// Return all feedback entries (shared-safe).
  public func listFeedback(feedbacks : FeedbackList) : [Types.FeedbackEntry] {
    feedbacks.toArray().map<Types.FeedbackEntryInternal, Types.FeedbackEntry>(feedbackToPublic);
  };

  /// Delete a feedback entry by id.
  public func deleteFeedback(feedbacks : FeedbackList, id : Text) : () {
    let remaining = feedbacks.filter(func(f : Types.FeedbackEntryInternal) : Bool {
      f.id != id
    });
    feedbacks.clear();
    feedbacks.append(remaining);
  };

  /// Compute basic analytics.
  public func computeAnalytics(
    accounts : AccountMap,
    feedbacks : FeedbackList,
    animalResultsCount : Nat,
    emotionResultsCount : Nat,
    darkSideResultsCount : Nat,
  ) : Types.AppAnalytics {
    var totalEmotionResults = 0;
    var totalAnimalResults = 0;
    accounts.forEach(func(_k : Text, acc : Types.UserAccountInternal) {
      switch (acc.emotionResult) { case (?_) totalEmotionResults += 1; case null () };
      switch (acc.animalArchetype) { case (?_) totalAnimalResults += 1; case null () };
    });
    {
      totalUsers = accounts.size();
      totalFeedback = feedbacks.size();
      totalEmotionResults;
      totalAnimalResults;
      animalResultsCount;
      emotionResultsCount;
      darkSideResultsCount;
    };
  };

  /// Convert an internal account to its public form.
  /// Convert an internal account to its public form.
  public func toPublic(internal : Types.UserAccountInternal) : Types.UserAccount {
    {
      id = internal.id;
      email = internal.email;
      name = internal.name;
      age = internal.age;
      gender = internal.gender;
      createdAt = internal.createdAt;
      lastLogin = internal.lastLogin;
      animalArchetype = internal.animalArchetype;
      emotionResult = internal.emotionResult;
      darkSideResult = internal.darkSideResult;
      securityQuestionUpdatedAt = internal.securityQuestionUpdatedAt;
    };
  };

  /// Convert an internal account to its admin form (includes passwordHash).
  public func toPublicAdmin(internal : Types.UserAccountInternal) : Types.UserAccountAdmin {
    {
      id = internal.id;
      email = internal.email;
      passwordHash = internal.passwordHash;
      name = internal.name;
      age = internal.age;
      gender = internal.gender;
      createdAt = internal.createdAt;
      lastLogin = internal.lastLogin;
      animalArchetype = internal.animalArchetype;
      emotionResult = internal.emotionResult;
      darkSideResult = internal.darkSideResult;
    };
  };

  /// Convert an internal feedback to its shared form.
  public func feedbackToPublic(internal : Types.FeedbackEntryInternal) : Types.FeedbackEntry {
    {
      id = internal.id;
      userEmail = internal.userEmail;
      feedback = internal.feedback;
      timestamp = internal.timestamp;
    };
  };
};
