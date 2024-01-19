# food-expiry-tracking

App that helps a user track groceries and their expiry date.
It also has an option to pick up a pre-parsed text file output by this python script https://github.com/JoWilks25/expiry_date_extractor

## How to run locally
1. Install dependencies using command `npm install`
2. Run locally by running command `npm run start`
3. Use a simulator (you may need to install the apple simulator application)

## How to run locally on device
1. Download the Expo Go app on your device
2. Install dependencies using command `npm install`
3. Run locally by running command `npm run start`
4. Switch to Expo Go (i.e. press S) in the command line
5. Open Expo Go app and load based on url i.e. exp://192.168.1.69:8081


## How to build/deploy
This app uses expo for building the app. Currently, only IOS builds are properly supported.

In order to setup the ability to build follow the instructions here: https://docs.expo.dev/build/setup/

## Commands - Preview build:
To generate 'production-like' build i.e. a build that lets you install and use on registered device without needing a running development server
`eas build --profile preview --platform ios`
