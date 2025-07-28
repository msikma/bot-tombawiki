// @dada78641/bot-tombawiki <https://github.com/msikma/bot-tombawiki>
// © MIT license

import {orderBy} from 'lodash-es'
import {MwRecent, type RcEditRecord} from '@dada78641/mwrecent'
import {sleep, promiseSequential} from '@dada78641/cronbot/util'
import {taskTombaWiki} from './index.ts'
import type {TombaWikiConfig, TombaWikiFeedItem} from './types.ts'

const TOMBA_WIKI_BASE_URL = 'https://tomba.club/wiki/'
const TOMBA_WIKI_W_URL = 'https://tomba.club/w/'

/**
 * Creates a guid for an edit record.
 */
function createGuid(editRecord: RcEditRecord) {
  const id = editRecord.page.id
  const edited = Number(editRecord.timestamps.editedAt)
  const sha = editRecord.metadata.sha1 ?? '0'
  return `${taskTombaWiki.id}:${id}:${edited}:${sha.slice(0, 7)}`
}

/**
 * Filters recent changes to only items we consider relevant enough to post.
 */
function filterRecentChanges(feedItems: TombaWikiFeedItem[]): TombaWikiFeedItem[] {
  return feedItems.filter(feedItem => {
    // Don't include edits that people make to their own userpages.
    if (feedItem.data.page.namespace === 'User' && feedItem.data.page.name.startsWith(feedItem.data.editor.username)) {
      return false
    }
    return true
  })
}

/**
 * Fetches recent changes from the Tomba Club wiki.
 */
export async function getRecentChanges(taskRecentChanges: TombaWikiConfig['taskRecentChanges']): Promise<TombaWikiFeedItem[]> {
  const mw = new MwRecent({
    wUrl: TOMBA_WIKI_W_URL,
    baseUrl: TOMBA_WIKI_BASE_URL,
  })
  const results = await promiseSequential(taskRecentChanges.flatMap(taskRecentChange => async () => {
    await sleep(5000)
    const res = await mw.getRecentChanges()
    return res.editRecords.map(editRecord => {
      return {
        guid: createGuid(editRecord),
        data: editRecord,
        taskChannel: taskRecentChange.channel,
        taskConfig: taskRecentChange,
      }
    })
  }))
  return orderBy(filterRecentChanges(results.flat()), 'data.timestamps.editedAt', 'asc')
}
