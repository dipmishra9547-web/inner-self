import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/profile";

module {
  public type ProfileMap = Map.Map<Types.UserId, Types.UserProfileInternal>;

  /// Retrieve the profile for a given user, or null if not found.
  public func getProfile(profiles : ProfileMap, userId : Types.UserId) : ?Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?internal) ?toPublic(internal);
      case null null;
    };
  };

  /// Save or overwrite the profile for a given user.
  public func saveProfile(profiles : ProfileMap, userId : Types.UserId, archetype : Types.AnimalType) : () {
    let now = Time.now();
    switch (profiles.get(userId)) {
      case (?existing) {
        existing.archetype := archetype;
        existing.takenAt := now;
      };
      case null {
        let newProfile : Types.UserProfileInternal = {
          userId;
          var archetype;
          var takenAt = now;
        };
        profiles.add(userId, newProfile);
      };
    };
  };

  /// Convert an internal profile to a public-safe profile.
  public func toPublic(internal : Types.UserProfileInternal) : Types.UserProfile {
    {
      userId = internal.userId;
      archetype = internal.archetype;
      takenAt = internal.takenAt;
    };
  };
};
