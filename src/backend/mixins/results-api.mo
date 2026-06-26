import Time "mo:core/Time";
import Types "../types/account";
import AccountLib "../lib/account";
import ResultsLib "../lib/results";

mixin (
  accounts : AccountLib.AccountMap,
  sessions : AccountLib.SessionMap,
  animalResults : ResultsLib.AnimalResultMap,
  emotionResults : ResultsLib.EmotionResultMap,
  darkSideResults : ResultsLib.DarkSideResultMap,
  sevenSinsResults : ResultsLib.SevenSinsResultMap,
) {
  var animalResultCounter : Nat = 0;
  var emotionResultCounter : Nat = 0;
  var darkSideResultCounter : Nat = 0;
  var sevenSinsResultCounter : Nat = 0;

  // ── Helpers ──────────────────────────────────────────────────────────────

  func resolveOrErr(token : Text) : { #ok : Text; #err : Text } {
    let now = Time.now();
    switch (AccountLib.resolveSession(sessions, token, now)) {
      case null #err("Session expired or invalid. Please log in again.");
      case (?email) #ok(email);
    };
  };

  func requireNonAnon(caller : Principal) : Bool {
    not caller.isAnonymous()
  };

  // ── Public result API ────────────────────────────────────────────────────

  /// Save an animal quiz result for the authenticated user.
  /// Also updates the user's animalArchetype profile field.
  /// Blocks save and returns Err if user_id cannot be resolved.
  public shared func saveAnimalResult(
    token : Text,
    animalType : Types.AnimalType,
    score : Nat,
  ) : async { #ok : Text; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        let now = Time.now();
        animalResultCounter += 1;
        let id = ResultsLib.saveAnimalResult(animalResults, animalResultCounter - 1, email, animalType, score, now);
        // Also update the user's latest archetype on their account
        ignore AccountLib.saveAnimalArchetype(accounts, email, animalType);
        #ok("Animal result saved with id " # id.toText());
      };
    };
  };

  /// Save an emotion quiz result for the authenticated user.
  /// Also updates the user's emotionResult profile field.
  /// Blocks save and returns Err if user_id cannot be resolved.
  public shared func saveEmotionResultEntry(
    token : Text,
    emotionType : Text,
    score : Float,
  ) : async { #ok : Text; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        let now = Time.now();
        emotionResultCounter += 1;
        let id = ResultsLib.saveEmotionResult(emotionResults, emotionResultCounter - 1, email, emotionType, score, now);
        #ok("Emotion result saved with id " # id.toText());
      };
    };
  };

  /// Save a dark-side quiz result for the authenticated user.
  /// Also updates the user's darkSideResult profile field.
  /// Blocks save and returns Err if user_id cannot be resolved.
  public shared func saveDarkSideResultEntry(
    token : Text,
    personalityType : Text,
    dominantPercentage : Float,
    fullResultJson : Text,
  ) : async { #ok : Text; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        let now = Time.now();
        darkSideResultCounter += 1;
        let id = ResultsLib.saveDarkSideResult(darkSideResults, darkSideResultCounter - 1, email, personalityType, dominantPercentage, fullResultJson, now);
        #ok("Dark side result saved with id " # id.toText());
      };
    };
  };

  /// Get all animal quiz attempts for the authenticated user, newest first.
  public shared func getMyAnimalResults(token : Text) : async { #ok : [Types.AnimalResultEntry]; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        #ok(ResultsLib.getUserAnimalResults(animalResults, email));
      };
    };
  };

  /// Get all emotion quiz attempts for the authenticated user, newest first.
  public shared func getMyEmotionResults(token : Text) : async { #ok : [Types.EmotionResultEntry]; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        #ok(ResultsLib.getUserEmotionResults(emotionResults, email));
      };
    };
  };

  /// Get all dark-side quiz attempts for the authenticated user, newest first.
  public shared func getMyDarkSideResults(token : Text) : async { #ok : [Types.DarkSideResultEntry]; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        #ok(ResultsLib.getUserDarkSideResults(darkSideResults, email));
      };
    };
  };

  /// Save a Seven Deadly Sins quiz result for the authenticated user.
  /// Blocks save and returns Err if user_id cannot be resolved.
  public shared func saveSevenSinsResult(
    token : Text,
    name : Text,
    pride : Float,
    greed : Float,
    wrath : Float,
    envy : Float,
    gluttony : Float,
    lust : Float,
    sloth : Float,
    dominantSin : Text,
  ) : async { #ok : Text; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        let now = Time.now();
        sevenSinsResultCounter += 1;
        let id = ResultsLib.saveSevenSinsResult(sevenSinsResults, sevenSinsResultCounter - 1, email, name, pride, greed, wrath, envy, gluttony, lust, sloth, dominantSin, now);
        #ok("Seven sins result saved with id " # id.toText());
      };
    };
  };

  /// Get all Seven Deadly Sins quiz attempts for the authenticated user, newest first.
  public shared func getMySevenSinsResults(token : Text) : async { #ok : [Types.SevenSinsResultEntry]; #err : Text } {
    switch (resolveOrErr(token)) {
      case (#err(e)) #err(e);
      case (#ok(email)) {
        #ok(ResultsLib.getUserSevenSinsResults(sevenSinsResults, email));
      };
    };
  };

  /// Admin: get all Seven Deadly Sins quiz results across all users.
  public shared ({ caller }) func adminGetAllSevenSinsResults() : async { #ok : [Types.SevenSinsResultEntry]; #err : Text } {
    if (not requireNonAnon(caller)) return #err("Unauthorized: admin access required.");
    #ok(ResultsLib.getAllSevenSinsResults(sevenSinsResults));
  };

  /// Admin: get all animal quiz results across all users.
  public shared ({ caller }) func adminGetAllAnimalResults() : async { #ok : [Types.AnimalResultEntry]; #err : Text } {
    if (not requireNonAnon(caller)) return #err("Unauthorized: admin access required.");
    #ok(ResultsLib.getAllAnimalResults(animalResults));
  };

  /// Admin: get all emotion quiz results across all users.
  public shared ({ caller }) func adminGetAllEmotionResults() : async { #ok : [Types.EmotionResultEntry]; #err : Text } {
    if (not requireNonAnon(caller)) return #err("Unauthorized: admin access required.");
    #ok(ResultsLib.getAllEmotionResults(emotionResults));
  };

  /// Admin: get all three quiz result collections for a specific user by email.
  public shared ({ caller }) func adminGetUserResults(
    userEmail : Text,
  ) : async { #ok : Types.UserResultsAdmin; #err : Text } {
    if (not requireNonAnon(caller)) return #err("Unauthorized: admin access required.");
    #ok(ResultsLib.getUserResultsAdmin(animalResults, emotionResults, darkSideResults, userEmail));
  };

  /// Admin: return counts of all result collections plus total users.
  public shared ({ caller }) func adminGetAllResultCounts() : async { #ok : Types.ResultCounts; #err : Text } {
    if (not requireNonAnon(caller)) return #err("Unauthorized: admin access required.");
    #ok({
      totalUsers = accounts.size();
      animalResults = animalResults.size();
      emotionResults = emotionResults.size();
      darkSideResults = darkSideResults.size();
    });
  };
};
