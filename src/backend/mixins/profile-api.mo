import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "../types/profile";
import ProfileLib "../lib/profile";

mixin (profiles : ProfileLib.ProfileMap) {
  /// Get the profile of the calling authenticated user.
  /// Returns null if the caller has not yet taken the quiz, or if anonymous.
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    if (caller.isAnonymous()) {
      return null;
    };
    ProfileLib.getProfile(profiles, caller);
  };

  /// Save or overwrite the archetype result for the calling authenticated user.
  /// Anonymous callers are rejected.
  public shared ({ caller }) func saveMyProfile(archetype : Types.AnimalType) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers are not allowed to save profiles.");
    };
    ProfileLib.saveProfile(profiles, caller, archetype);
  };
};
