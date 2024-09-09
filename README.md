## :bookmark: Internal Audit UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

## :notebook: Pre-Requisites
List all the pre-requisites the system needs to develop this project.
- Visual Studio Code

## :nut_and_bolt: Development Environment
Setting up about the working environment for your project.

| Angular CLI | Angular version | Node.js version | TypeScript version | RxJS version  
|---------|---------|----------------------------------|--------|-----------------|
| ~15.0.5 | ~15.0.4 | &#94;14.20.0 &#124;&#124; &#94;16.13.0 &#124;&#124; &#94;18.10.0 | ~4.8.4 | &#94;6.5.5 &#124;&#124; &#94;7.4.0


## :desktop_computer: Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## :file_folder: File Structure
File structure here with the basic details about files.

```
.
src
└── app
    └── project
        ├── core
        ├── modules
        │   ├── master-data
        │   │   ├── airport
        │   │   ├── air-carrier
        │   │   ├── country
        │   │   ├── province
        │   │   ├── district-postcode
        │   │   ├── prefix
        │   │   └── master-data-shared
        │   ├── user-management
        │   │   ├── user
        │   │   ├── user-groups
        │   │   ├── audit-log
        │   │   └── user-management-shared
        │   ├── ioc
        │   │   ├── risk-assessment
        │   │   │   ├── no-entry-exit-list
        │   │   │   │   ├── temp-no-entry-exit-list
        │   │   │   │   └── iapi
        │   │   │   │       ├── no-entry-exit-hit-search
        │   │   │   │       └── no-entry-exit-alert
        │   │   │   ├── blacklist  
        │   │   │   │   ├── temp-blacklist
        │   │   │   │   └── iapi
        │   │   │   │       ├── blacklist-hit-search
        │   │   │   │       └── blacklist-alert
        │   │   │   ├── watchlist
        │   │   │   │   ├── temp-watchlist
        │   │   │   │   └── iapi
        │   │   │   │       ├── watchlist-hit-search
        │   │   │   │       └── watchlist-alert
        │   │   │   └── risk-assessment-shared
        │   │   │       ├── traveler-data-dialog (เปิดจากหน้า directive ของ BL/WL ใช้ html เดียวกับ traveler-data ใน ioc-shared)
        │   │   │       ├── directive-history-no-entry-exit-dialog (เปิดจากหน้า override-no-entry-exit)
        │   │   │       ├── directive-history-blacklist-dialog (เปิดจากหน้า directive-blacklist)
        │   │   │       └── directive-history-watchlist-dialog (เปิดจากหน้า directive-watchlist)
        │   │   ├── travel-information
        │   │   │   ├── iapi
        │   │   │   │   ├── inter-flight-search
        │   │   │   │   └── inter-traveler-search
        │   │   │   └── travel-information-shared
        │   │   │       └── traveler-no-entry-exit-list (เปิดจากหน้า flight-search)
        │   │   └── ioc-shared
        │   │       ├── traveler-list (เปิดหน้า inter-flight-search)
        │   │       ├── traveler-data (เปิดจาก traveler-list, directive-blacklist, directive-watchlist)
        │   │       ├── override-no-entry-exit (เปิดจาก no-entry-exit-alert, hit-search, flight-search, traveler-search)
        │   │       ├── directive-blacklist (เปิดจาก blacklist-alert, hit-search, flight-search, traveler-search)
        │   │       └── directive-watchlist (เปิดจาก watchlist-alert, hit-search)
        │   └── csc
        │       ├── travel-information
        │       │   ├── iapi
        │       │   │   └── inter-flight-search
        │       │   └── travel-information-shared
        │       │       └── traveler-info-dialog
        │       ├── carrier-engagement
        │       │   └── inter-air-carrier-engagement
        │       └── csc-shared
        └── shared

```

| No | File Name | Details 
|----|------------|-------|
| 1  | environment.ts | Development Environment
| 2  | build.xml | Apache Ant's buildfiles 

## :hammer: Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## :cactus: Branches

This project use an agile continuous integration methodology, so the version is frequently updated and development is really fast.
1. **`master`** is the production branch.
2. **`feature/feature-name`** is the development branch.
3. No other permanent branches should be created in the main repository, you can create feature branches but they should get merged with the master.

**Steps to work with feature branch**

1. To start working on a new feature, create a new branch prefixed with `feature` and followed by feature name. (ie. `feature/feature-name`)
2. Once you are done with your changes, you can commit and create merge request to maintainer.

**Steps to create a merge request**

1. Make a merge request to `master` branch.
2. Comply with the best practices and guidelines. 
3. It must pass all checks and get positive reviews.

After this, changes will be merged.
