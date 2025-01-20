// @dada78641/bot-tombawiki <https://github.com/msikma/bot-tombawiki>
// © MIT license

import {wrapInCodeBlock} from '@dada78641/cronbot/util'
import {MwRecent, type RcEditRecord} from '@dada78641/mwrecent'
import {taskTombaWiki} from './index.ts'
import {EmbedBuilder, type BaseMessageOptions} from 'discord.js'

// Icon of Tomba holding on to the Wikipedia globe.
const TOMBA_WIKI_THUMB = `https://i.imgur.com/6FWCJfn.png`

function getTimestamp(rcData: RcEditRecord) {
  return `<t:${Math.floor(Number(new Date(rcData.timestamps.editedAt)) / 1000)}:f>`
}

function getDescription(rcData: RcEditRecord) {
  const user = `[${rcData.editor.username}](${rcData.editor.userUrl})`
  const page = `[${rcData.page.title}](${rcData.page.url})`

  // Page related changes
  if (MwRecent.isPageEdit(rcData)) {
    return `User ${user} edited page ${page}.`
  }
  if (MwRecent.isPageCreation(rcData)) {
    return `User ${user} created new page ${page}.`
  }
  if (MwRecent.isPageMove(rcData) && rcData.log.params != null) {
    const target = rcData.log.params.target_title as string
    return `User ${user} moved page ${page} to [${target}](${rcData.page.url.replaceAll(rcData.page.title, target)}).`
  }
  if (MwRecent.isPageDeletion(rcData)) {
    return `User ${user} deleted page ${page}.`
  }

  // User related changes
  if (MwRecent.isUserRegistration(rcData)) {
    return `User ${user} registered an account. Welcome!`
  }
  if (MwRecent.isUserBan(rcData)) {
    return `User [${rcData.page.name}](${rcData.page.url}) got banned from the wiki by ${user}.`
  }

  // File related changes
  if (MwRecent.isFileUpload(rcData)) {
    return `User ${user} uploaded file ${page}.`
  }
  if (MwRecent.isFileDeletion(rcData)) {
    return `User ${user} deleted file ${page}.`
  }

  // If we're here, it means we've encountered a page type not seen before.
  throw new Error(`Unknown recent change type: ${rcData.editType} ${rcData.page.id}:${rcData.metadata.sha1}`)
}

/**
 * Returns a payload for a minor edit.
 */
function getMinorEditPayload(rcData: RcEditRecord, identifier?: string): BaseMessageOptions {
  const embed = new EmbedBuilder()
  embed.setColor(taskTombaWiki.design.color)
  embed.setDescription(`**Minor edit:** ${getDescription(rcData)}${rcData.comments.raw ? ` \`${rcData.comments.raw.replaceAll('`', ` ̀`)}\`` : ''}`)
  return {content: undefined, embeds: [embed]}
}

/**
 * Returns a payload for a recent change on the wiki.
 */
export async function getPayload(rcData: RcEditRecord, identifier?: string): Promise<BaseMessageOptions> {
  if (MwRecent.isPageEdit(rcData) && rcData.metadata.minor === true) {
    return getMinorEditPayload(rcData, identifier)
  }
  const embed = new EmbedBuilder()
  embed.setURL(rcData.page.url)
  embed.setColor(taskTombaWiki.design.color)
  embed.setAuthor({name: 'Tomba Club Wiki', url: 'https://tomba.club/wiki/', iconURL: taskTombaWiki.design.icon})
  embed.setThumbnail(TOMBA_WIKI_THUMB)
  embed.setDescription(getDescription(rcData))
  embed.setTimestamp(rcData.timestamps.editedAt)
  if (rcData.comments.raw) {
    embed.addFields({name: 'Comments', value: wrapInCodeBlock(rcData.comments.raw)})
  }
  return {content: undefined, embeds: [embed]}
}
