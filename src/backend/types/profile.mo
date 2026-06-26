import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// The 12 animal archetypes derived from personality and criminology frameworks.
  public type AnimalType = {
    #Lion;
    #Otter;
    #GoldenRetriever;
    #Beaver;
    #Wolf;
    #Sheep;
    #Shepherd;
    #Fox;
    #Owl;
    #Elephant;
    #Dolphin;
    #Bear;
  };

  /// Stored user profile (internal — contains mutable fields).
  public type UserProfileInternal = {
    userId : UserId;
    var archetype : AnimalType;
    var takenAt : Timestamp;
  };

  /// Public-facing profile (shared — safe to return over Candid).
  public type UserProfile = {
    userId : UserId;
    archetype : AnimalType;
    takenAt : Timestamp;
  };
};
