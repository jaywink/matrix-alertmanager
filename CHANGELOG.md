# Changelog

## Unreleased

### Added

- Add option to mention room when alert is firing by @sbruder

## 0.3.0-rc1 - 2020-07-06

### Changed

- Application will wait for initialization to complete before serving requests
  (ensures bot can connect to the homeserver and join the rooms) by @abelxluck
- Wait for message to send (or fail to send) before returning a success/error
  message to the caller by @abelxluck

## 0.2.0 - 2020-04-11

### Added

- Bot will now try to join rooms it is not in always before sending a message.

### Changed

- Default port 3000 is now set in the docker image by @ptman

## 0.1.0 - 2019-11-12

### Changed

- Added message styling by @daniego

## 0.0.2 - 2019-10-30

### Changed

- Matrix-JS-SDK version updated to latest by @Lyr

## 0.0.1

First released version
