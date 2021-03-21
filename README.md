# `titan`

Named after the first private server I've ever played, `titan` is a library of Node.js modules that helps bring MapleStory private server development to a larger audience.

# Overview

## Packages
* calc

A calculator library that implements standard MapleStory specific calculations such as damage, stat modifiers, experience, and levels.

* crypto

A cryptography library that exposes everything you need to encrypt/decrypt data for MapleStory.

* net

A packet parser using method-chaining syntax for compact and efficient parsing/writing of packet structures.

* wz

A WZ library that can read and write to the WZ file format.

## Current Features
* Implements a simple packet parser and writer with method chaining for succinct code

```node
const packet = new Packet.Parser(<input buffer>);
const fields = ['id', 'name', 'hp'];
const unpacked = packet.int().mapleascii().int().collect(fields);
/** Returns {id: <number value>, name: <ascii string value>, hp: <number value>} */
```

* Uses Google's recommended JS style guidelines, fully documented code including full JSDoc comments
* Implements AES and MapleStory Shanda encryption algorithms
* Full unit tests and modular package structure. Only use the packages that you need!

# Project Goals

## MapleStory-related Packages
* Cryptography
* Networking protocol
* Damage calculations
* Event timers
* NPC script manager
* Event script manager
* Support WZ and NX file formats
* Generic MapleStory abstractions
* Multiple MapleStory versions

## Modern Features
* Stateless server system with cache and message broker
* Multi-threaded worker pool queue system using `worker_threads`

# Project Overview

## Linter

```
npm run lint
```

## Test

```
npm run test
```

# Contributing

For now, there are no contribution guidelines. I only ask that you follow the `eslint` rules when contributing a pull request. Thanks!

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/Naereen/)