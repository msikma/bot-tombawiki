// @dada78641/bot-tombawiki <https://github.com/msikma/bot-tombawiki>
// © MIT license

import type {BaseMessageOptions} from 'discord.js'
import {FeedTask} from '@dada78641/cronbot'
import {scheduleEvery} from '@dada78641/cronbot/util'
import type {BotTask} from '@dada78641/cronbot'
import {getPayload} from './payload.ts'
import {getRecentChanges} from './data.ts'
import type {TombaWikiConfig, TombaWikiFeedItem} from './types.ts'

class TombaWikiFeedTask extends FeedTask<TombaWikiConfig> {
  async getFeedItems(): Promise<TombaWikiFeedItem[]> {
    return getRecentChanges(this.taskConfig.taskRecentChanges)
  }
  async getFeedItemPayload(rcItem: TombaWikiFeedItem): Promise<BaseMessageOptions> {
    return await getPayload(rcItem.data, rcItem.taskConfig.identifier)
  }
}

export const taskTombaWiki: BotTask<TombaWikiConfig> = {
  id: 'tombawiki',
  name: 'TombaWiki',
  design: {
    color: 0xf070d8,
    icon: 'https://i.imgur.com/DLPrJiq.png',
  },
  actions: [
    {
      action: TombaWikiFeedTask,
      description: 'reports on edits made to the Tomba Club wiki',
      interval: scheduleEvery(1, 'minute'),
      deferred: false,
      batchLimit: 10,
    }
  ]
}
