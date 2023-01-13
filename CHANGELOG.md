# Changelog

## unreleased

### Added

* Basic auth support by @tnyeanderson

### Changed

* Dependency updates

## 0.6.0 - 2022-12-06

### Breaking

* Required NodeJS version is now 18

### Changed

* Docker image changed to base on Alpine to reduce size.

* Various dependency updates.

## 0.5.0 - 2021-09-23

### Changed

- Webhook endpoint now supports payloads up to 1M (up from 100k) by Sebastian Hasler.

## 0.4.0 - 2020-12-04

### Changed

- Improve formatting of alerts by using more attributes by @ssams
- Update Node version to 14 and bump various dependencies.

## 0.3.0 - 2020-07-17

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
