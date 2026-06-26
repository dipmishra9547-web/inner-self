import Map "mo:core/Map";
import List "mo:core/List";
import Types "types/profile";
import AccountTypes "types/account";
import ProfileLib "lib/profile";
import AccountLib "lib/account";
import ResultsLib "lib/results";
import ProfileApi "mixins/profile-api";
import AccountApi "mixins/account-api";
import ResultsApi "mixins/results-api";





actor {
  // ── Animal archetype state ────────────────────────────────────────────────
  let profiles : ProfileLib.ProfileMap = Map.empty<Types.UserId, Types.UserProfileInternal>();

  // ── Account / auth state ──────────────────────────────────────────────────
  let accounts : AccountLib.AccountMap = Map.empty<Text, AccountTypes.UserAccountInternal>();
  let feedbacks : AccountLib.FeedbackList = List.empty<AccountTypes.FeedbackEntryInternal>();
  let sessions : AccountLib.SessionMap = Map.empty<Text, AccountTypes.SessionToken>();
  let adminConfig : AccountTypes.AdminConfigInternal = {
    var adminPrincipal = "";
    var isDraftMode = false;
  };

  // ── Per-quiz result collections ───────────────────────────────────────────
  let animalResults : ResultsLib.AnimalResultMap = Map.empty<Nat, AccountTypes.AnimalResultEntry>();
  let emotionResults : ResultsLib.EmotionResultMap = Map.empty<Nat, AccountTypes.EmotionResultEntry>();
  let darkSideResults : ResultsLib.DarkSideResultMap = Map.empty<Nat, AccountTypes.DarkSideResultEntry>();
  let sevenSinsResults : ResultsLib.SevenSinsResultMap = Map.empty<Nat, AccountTypes.SevenSinsResultEntry>();

  // ── Mixin composition ────────────────────────────────────────────────────
  include ProfileApi(profiles);
  include AccountApi(accounts, feedbacks, sessions, adminConfig, animalResults, emotionResults, darkSideResults);
  include ResultsApi(accounts, sessions, animalResults, emotionResults, darkSideResults, sevenSinsResults);
};
