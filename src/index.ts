// @dada78641/bot-tombawiki <https://github.com/msikma/bot-tombawiki>
// © MIT license

import CronBot from '@dada78641/cronbot'
import {requiredBotIntents} from './lib/permissions.ts'
import {taskTombaWiki} from './tasks/tombawiki/index.ts'

const tombaWikiBot = new CronBot({
  id: 'bot-tombawiki',
  name: 'TombaWikiBot',
  path: import.meta.dirname,
  tasks: [
    taskTombaWiki,
  ],
  clientOptions: {intents: requiredBotIntents}
})

export {
  tombaWikiBot
}
