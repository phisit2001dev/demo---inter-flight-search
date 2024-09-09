export interface Permission {
  search?: boolean;
  add?: boolean;
  edit?: boolean;
  view?: boolean;
  delete?: boolean;
  export?: boolean;
  regenerate?: boolean;
  retransmit?: boolean;
  viewPNRGOV?: boolean;
  viewRecLocator?: boolean;
  cancel?: boolean;
  generate?: boolean;
  active?: boolean;
  reset?: boolean;
  searchNoEntry?: boolean;
  searchBlacklist?: boolean;
  searchWatchlist?: boolean;
  ack?: boolean;
  viewNoEntry?: boolean;
  viewBlacklist?: boolean;
  viewWatchlist?: boolean;
  overrideNoEntry?: boolean;
  directiveBlacklist?: boolean;
  directiveWatchlist?: boolean;
  addNewFlight?: boolean;
  editActiveStatus?: boolean; // Use in master data > Airport.
  changePasswordStatus?: boolean;
  viewTravellerList?:boolean;
  viewTravellerListNoEntryExit?:boolean;
  manageCaseNoEntryExit?: boolean;
  manageCaseBlacklist?: boolean;
  manageCaseWatchlist?: boolean;
  viewCaseNoEntryExit?: boolean;
  viewCaseBlacklist?: boolean;
  viewCaseWatchlist?: boolean;
  manageFalseAlarm?: boolean;
  supEdit?: boolean;
}
