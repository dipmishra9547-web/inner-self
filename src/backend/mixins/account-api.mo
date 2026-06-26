import Time "mo:core/Time";
import Types "../types/account";
import AccountLib "../lib/account";
import ResultsLib "../lib/results";

mixin (
  accounts : AccountLib.AccountMap,
  feedbacks : AccountLib.FeedbackList,
  sessions : AccountLib.SessionMap,
  adminConfig : Types.AdminConfigInternal,
  animalResults : ResultsLib.AnimalResultMap,
  emotionResults : ResultsLib.EmotionResultMap,
  darkSideResults : ResultsLib.DarkSideResultMap,
) {

  // ── Helpers ──────────────────────────────────────────────────────────────

  func isAdmin(caller : Principal) : Bool {
    adminConfig.adminPrincipal != "" and caller.toText() == adminConfig.adminPrincipal;
  };

  func requireAdmin(caller : Principal) : { #ok; #err : Text } {
    if (isAdmin(caller)) #ok else #err("Unauthorized: admin access required.");
  };

  // ── Public auth API ──────────────────────────────────────────────────────

  /// Register a new user account with email/password, profile details, and a security question/answer.
  public shared func createAccount(
    email : Text,
    password : Text,
    name : Text,
    age : Nat,
    gender : Text,
    securityQuestion : Text,
    securityAnswer : Text,
    securityHint : Text,
  ) : async { #ok; #err : Text } {
    if (email.size() == 0) return #err("Email is required.");
    if (password.size() < 6) return #err("Password must be at least 6 characters.");
    if (name.size() == 0) return #err("Name is required.");
    if (securityQuestion.size() == 0) return #err("Security question is required.");
    if (securityAnswer.size() < 2) return #err("Security answer must be at least 2 characters.");
    if (securityAnswer.size() > 100) return #err("Security answer must be at most 100 characters.");
    if (securityHint.size() > 100) return #err("Security hint must be at most 100 characters.");
    let hash = AccountLib.hashPassword(password);
    // Normalize and hash the answer before storing
    let normalizedAnswer = securityAnswer.trim(#predicate(func(c) { c == ' ' }));
    let answerHash = AccountLib.hashPassword(normalizedAnswer.toLower());
    let now = Time.now();
    AccountLib.createAccount(accounts, email, hash, name, age, gender, securityQuestion, answerHash, securityHint, now);
  };

  /// Return the stored security question for a given email (for the "forgot password" flow).
  public shared query func getSecurityQuestion(email : Text) : async ?Text {
    AccountLib.getSecurityQuestion(accounts, email);
  };

  /// Return the stored security hint for a given email (plain-text, shown on forgot-password screen).
  public shared query func getSecurityHint(email : Text) : async ?Text {
    AccountLib.getSecurityHint(accounts, email);
  };

  /// Check whether the provided answer is correct for the given email.
  public shared query func verifySecurityQuestion(email : Text, answer : Text) : async Bool {
    AccountLib.verifySecurityAnswer(accounts, email, answer);
  };

  /// Reset a forgotten password using the security question answer.
  public shared func resetPasswordWithSecurityQuestion(
    email : Text,
    question : Text,
    answer : Text,
    newPassword : Text,
  ) : async { #ok; #err : Text } {
    if (newPassword.size() < 6) return #err("Password must be at least 6 characters.");
    if (answer.size() < 2) return #err("Answer must be at least 2 characters.");
    if (answer.size() > 100) return #err("Answer must be at most 100 characters.");
    let newHash = AccountLib.hashPassword(newPassword);
    AccountLib.resetPasswordWithSecurityQuestion(accounts, email, question, answer, newHash);
  };

  /// Update the security question, answer, and hint for an authenticated user (from profile page).
  public shared func updateSecurityQuestion(
    token : Text,
    newQuestion : Text,
    newAnswer : Text,
    newHint : Text,
  ) : async { #ok; #err : Text } {
    if (newQuestion.size() == 0) return #err("Security question is required.");
    if (newAnswer.size() < 2) return #err("Security answer must be at least 2 characters.");
    if (newAnswer.size() > 100) return #err("Security answer must be at most 100 characters.");
    if (newHint.size() > 100) return #err("Security hint must be at most 100 characters.");
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) {
        let normalizedAnswer = newAnswer.trim(#predicate(func(c) { c == ' ' }));
        let answerHash = AccountLib.hashPassword(normalizedAnswer.toLower());
        AccountLib.updateSecurityQuestion(accounts, email, newQuestion, answerHash, newHint, now);
      };
    };
  };

  /// Return the securityQuestionUpdatedAt timestamp for the authenticated user.
  public shared func getSecurityQuestionUpdatedAt(token : Text) : async { #ok : ?Int; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) #ok(AccountLib.getSecurityQuestionUpdatedAt(accounts, email));
    };
  };

  /// Authenticate with email/password. Returns a session token on success.
  public shared func login(email : Text, password : Text) : async { #ok : Types.SessionToken; #err : Text } {
    switch (accounts.get(email)) {
      case null #err("Invalid email or password.");
      case (?acc) {
        if (not AccountLib.verifyPassword(password, acc.passwordHash)) {
          return #err("Invalid email or password.");
        };
        let now = Time.now();
        AccountLib.recordLogin(accounts, email, now);
        let sess = AccountLib.generateToken(email, now);
        sessions.add(sess.token, sess);
        #ok(sess);
      };
    };
  };

  /// Invalidate a session token.
  public shared func logout(token : Text) : async () {
    sessions.remove(token);
  };

  /// Return the account for a given session token.
  public shared func getMyAccount(token : Text) : async { #ok : Types.UserAccount; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) {
        switch (AccountLib.getAccount(accounts, email)) {
          case null #err("Account not found.");
          case (?acc) #ok(acc);
        };
      };
    };
  };

  /// Save the emotion quiz result for the authenticated user.
  public shared func saveEmotionResult(
    token : Text,
    scores : [Types.EmotionScore],
  ) : async { #ok; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) {
        let summary : Types.EmotionResultSummary = {
          topEmotions = scores;
          takenAt = now;
        };
        AccountLib.saveEmotionResult(accounts, email, summary);
      };
    };
  };

  /// Save the dark-side quiz result for the authenticated user.
  public shared func saveDarkSideResult(
    token : Text,
    scores : [Types.DarkSideScore],
  ) : async { #ok; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) {
        let summary : Types.DarkSideResultSummary = {
          topTypes = scores;
          takenAt = now;
        };
        AccountLib.saveDarkSideResult(accounts, email, summary);
      };
    };
  };

  /// Get the dark-side quiz result for the authenticated user.
  public shared func getDarkSideResult(token : Text) : async { #ok : ?Types.DarkSideResultSummary; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) {
        switch (accounts.get(email)) {
          case null #err("Account not found.");
          case (?acc) #ok(acc.darkSideResult);
        };
      };
    };
  };

  /// Submit feedback. Pass empty string as token for anonymous feedback.
  public shared func submitFeedback(feedback : Text, userEmail : Text) : async { #ok; #err : Text } {
    if (feedback.size() == 0) return #err("Feedback text is required.");
    let now = Time.now();
    AccountLib.addFeedback(feedbacks, userEmail, feedback, now);
    #ok;
  };

  /// Return the current app configuration (public — includes draft mode flag).
  public shared query func getAppConfig() : async Types.AdminConfig {
    {
      adminPrincipal = adminConfig.adminPrincipal;
      isDraftMode = adminConfig.isDraftMode;
    };
  };

  /// Claim admin role via Internet Identity.
  /// Only succeeds if no admin is yet set. First caller becomes super admin.
  public shared ({ caller }) func claimAdmin() : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Must use Internet Identity to claim admin.");
    if (adminConfig.adminPrincipal != "") return #err("Admin already set.");
    adminConfig.adminPrincipal := caller.toText();
    #ok;
  };

  // ── Admin-only API (Internet Identity Principal) ─────────────────────────

  /// List all registered users — admin only.
  public shared ({ caller }) func listAllUsers() : async [Types.UserAccountAdmin] {
    switch (requireAdmin(caller)) {
      case (#err(e)) [];  // return empty on unauthorized (caller checked below)
      case (#ok) AccountLib.listAllAccounts(accounts);
    };
  };

  /// List all feedback submissions — admin only.
  public shared ({ caller }) func listFeedback() : async [Types.FeedbackEntry] {
    switch (requireAdmin(caller)) {
      case (#err(_)) [];
      case (#ok) AccountLib.listFeedback(feedbacks);
    };
  };

  /// Get basic analytics — admin only.
  public shared ({ caller }) func getAnalytics() : async Types.AppAnalytics {
    if (not isAdmin(caller)) {
      return {
        totalUsers = 0;
        totalFeedback = 0;
        totalEmotionResults = 0;
        totalAnimalResults = 0;
        animalResultsCount = 0;
        emotionResultsCount = 0;
        darkSideResultsCount = 0;
      };
    };
    AccountLib.computeAnalytics(accounts, feedbacks, animalResults.size(), emotionResults.size(), darkSideResults.size());
  };

  /// Toggle draft/live mode — admin only.
  public shared ({ caller }) func setDraftMode(isDraft : Bool) : async { #ok; #err : Text } {
    switch (requireAdmin(caller)) {
      case (#err(e)) #err(e);
      case (#ok) {
        adminConfig.isDraftMode := isDraft;
        #ok;
      };
    };
  };

  /// Delete a user account — admin only.
  public shared ({ caller }) func deleteUser(email : Text) : async { #ok; #err : Text } {
    switch (requireAdmin(caller)) {
      case (#err(e)) #err(e);
      case (#ok) {
        AccountLib.deleteAccount(accounts, email);
        #ok;
      };
    };
  };

  /// Delete a feedback entry — admin only.
  public shared ({ caller }) func deleteFeedbackEntry(id : Text) : async { #ok; #err : Text } {
    switch (requireAdmin(caller)) {
      case (#err(e)) #err(e);
      case (#ok) {
        AccountLib.deleteFeedback(feedbacks, id);
        #ok;
      };
    };
  };
};
