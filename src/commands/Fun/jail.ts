import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import axios from 'axios'
import { readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import request from '../../lib/request';
// @ts-ignore
import imgbbUploader from 'imgbb-uploader';
export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'jail',
            description: 'to send people to jail who are horny',
            category: 'fun',
            usage: `${client.config.prefix}jail [(as caption | quote)[image] | @mention]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        const image:any = await (M.WAMessage?.message?.imageMessage
            ? this.client.downloadMediaMessage(M.WAMessage)
            : M.quoted?.message?.message?.imageMessage
            ? this.client.downloadMediaMessage(M.quoted.message)
            : M.mentioned[0]
            ? this.client.getProfilePicture(M.mentioned[0])
            : this.client.getProfilePicture(M.quoted?.sender || M.sender.jid))
        const buff = await request.buffer(image)
        const filename = `${tmpdir()}/pfp_${Math.random().toString(36)}`
     const download = await  writeFileSync(`${filename}.jpg`,buff)
     const ReadBuffer = await readFileSync(`${filename}.jpg`)
     const result = await imgbbUploader('235ef89fb9a32fa804cddf4a7226d775', `${filename}.jpg`)
    const pfp = result.url  
            await request.buffer(`https://some-random-api.ml/canvas/jail?avatar=${pfp}`)
            .then((response)=>{
              this.client.sendMessage(M.from,response,MessageType.image)
            }).catch((e)=>{
                M.reply('sorry couldn\'t send the image')
            })

    }
}
