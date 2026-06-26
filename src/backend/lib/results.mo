import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Types "../types/account";

module {
  public type AnimalResultMap = Map.Map<Nat, Types.AnimalResultEntry>;
  public type EmotionResultMap = Map.Map<Nat, Types.EmotionResultEntry>;
  public type DarkSideResultMap = Map.Map<Nat, Types.DarkSideResultEntry>;

  /// Save a new animal quiz result entry. Returns the new auto-incremented id.
  public func saveAnimalResult(
    animalResults : AnimalResultMap,
    counter : Nat,
    userId : Types.UserId,
    animalType : Types.AnimalType,
    score : Nat,
    now : Int,
  ) : Nat {
    let id = counter + 1;
    let entry : Types.AnimalResultEntry = {
      id;
      userId;
      animalType;
      score;
      createdAt = now;
    };
    animalResults.add(id, entry);
    id;
  };

  /// Save a new emotion quiz result entry. Returns the new auto-incremented id.
  public func saveEmotionResult(
    emotionResults : EmotionResultMap,
    counter : Nat,
    userId : Types.UserId,
    emotionType : Text,
    score : Float,
    now : Int,
  ) : Nat {
    let id = counter + 1;
    let entry : Types.EmotionResultEntry = {
      id;
      userId;
      emotionType;
      score;
      createdAt = now;
    };
    emotionResults.add(id, entry);
    id;
  };

  /// Save a new dark-side quiz result entry. Returns the new auto-incremented id.
  public func saveDarkSideResult(
    darkSideResults : DarkSideResultMap,
    counter : Nat,
    userId : Types.UserId,
    personalityType : Text,
    dominantPercentage : Float,
    fullResultJson : Text,
    now : Int,
  ) : Nat {
    let id = counter + 1;
    let entry : Types.DarkSideResultEntry = {
      id;
      userId;
      personalityType;
      dominantPercentage;
      fullResultJson;
      createdAt = now;
    };
    darkSideResults.add(id, entry);
    id;
  };

  /// Get all animal results for a given user, sorted newest first.
  public func getUserAnimalResults(
    animalResults : AnimalResultMap,
    userId : Types.UserId,
  ) : [Types.AnimalResultEntry] {
    let matched = animalResults.values()
      .filter(func(e : Types.AnimalResultEntry) : Bool { e.userId == userId })
      .toArray();
    matched.sort(func(a : Types.AnimalResultEntry, b : Types.AnimalResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all emotion results for a given user, sorted newest first.
  public func getUserEmotionResults(
    emotionResults : EmotionResultMap,
    userId : Types.UserId,
  ) : [Types.EmotionResultEntry] {
    let matched = emotionResults.values()
      .filter(func(e : Types.EmotionResultEntry) : Bool { e.userId == userId })
      .toArray();
    matched.sort(func(a : Types.EmotionResultEntry, b : Types.EmotionResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all dark-side results for a given user, sorted newest first.
  public func getUserDarkSideResults(
    darkSideResults : DarkSideResultMap,
    userId : Types.UserId,
  ) : [Types.DarkSideResultEntry] {
    let matched = darkSideResults.values()
      .filter(func(e : Types.DarkSideResultEntry) : Bool { e.userId == userId })
      .toArray();
    matched.sort(func(a : Types.DarkSideResultEntry, b : Types.DarkSideResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  public type SevenSinsResultMap = Map.Map<Nat, Types.SevenSinsResultEntry>;

  /// Save a new Seven Deadly Sins quiz result entry. Returns the new auto-incremented id.
  public func saveSevenSinsResult(
    sevenSinsResults : SevenSinsResultMap,
    counter : Nat,
    userId : Types.UserId,
    name : Text,
    pride : Float,
    greed : Float,
    wrath : Float,
    envy : Float,
    gluttony : Float,
    lust : Float,
    sloth : Float,
    dominantSin : Text,
    now : Int,
  ) : Nat {
    let id = counter + 1;
    let entry : Types.SevenSinsResultEntry = {
      id;
      userId;
      name;
      pride;
      greed;
      wrath;
      envy;
      gluttony;
      lust;
      sloth;
      dominantSin;
      createdAt = now;
    };
    sevenSinsResults.add(id, entry);
    id;
  };

  /// Get all Seven Deadly Sins results for a given user, sorted newest first.
  public func getUserSevenSinsResults(
    sevenSinsResults : SevenSinsResultMap,
    userId : Types.UserId,
  ) : [Types.SevenSinsResultEntry] {
    let matched = sevenSinsResults.values()
      .filter(func(e : Types.SevenSinsResultEntry) : Bool { e.userId == userId })
      .toArray();
    matched.sort(func(a : Types.SevenSinsResultEntry, b : Types.SevenSinsResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all Seven Deadly Sins results (admin use).
  public func getAllSevenSinsResults(
    sevenSinsResults : SevenSinsResultMap,
  ) : [Types.SevenSinsResultEntry] {
    let all = sevenSinsResults.values().toArray();
    all.sort(func(a : Types.SevenSinsResultEntry, b : Types.SevenSinsResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all animal quiz results across all users (admin use).
  public func getAllAnimalResults(
    animalResults : AnimalResultMap,
  ) : [Types.AnimalResultEntry] {
    let all = animalResults.values().toArray();
    all.sort(func(a : Types.AnimalResultEntry, b : Types.AnimalResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all emotion quiz results across all users (admin use).
  public func getAllEmotionResults(
    emotionResults : EmotionResultMap,
  ) : [Types.EmotionResultEntry] {
    let all = emotionResults.values().toArray();
    all.sort(func(a : Types.EmotionResultEntry, b : Types.EmotionResultEntry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Get all three quiz result arrays for a given user (admin use).
  public func getUserResultsAdmin(
    animalResults : AnimalResultMap,
    emotionResults : EmotionResultMap,
    darkSideResults : DarkSideResultMap,
    userId : Types.UserId,
  ) : Types.UserResultsAdmin {
    {
      animal = getUserAnimalResults(animalResults, userId);
      emotion = getUserEmotionResults(emotionResults, userId);
      darkSide = getUserDarkSideResults(darkSideResults, userId);
    };
  };
};
