# Authentication Frontend

A **React Native** delivery mobile app

## Run in dev

- npm run start

## Icons

- list of icons: [https://oblador.github.io/react-native-vector-icons/](https://oblador.github.io/react-native-vector-icons/)

## Troubleshooting

CommandError: No development build (com.fredaguiar.authenticatorfrontend) for this project is installed. Please make and install a development build on the device first

Solution:

- Android Studio / Virtual Device Manager / Wipe data / cold boot
- npm run adroid

---

"RNCAndroidDialogPicker" was not found in the UIManager

Solution:

- Android Studio / Virtual Device Manager / Wipe data / cold boot
- npm run android
- make sure that there is nothing broken in the code

---

.env file can't be read

- variable key must start with EXPO PUBLIC

---

AxiosError: Network Error

- do not use localhost in the android emulator
- update the nodejs server ip address (ipconfig and .env)
- check if the NodeJS server has crashed (uncaught exception maybe?)
