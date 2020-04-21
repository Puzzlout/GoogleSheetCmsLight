#!/bin/sh
npm run release && git push --follow-tags origin master && npm publish