import { MessageType, Mimetype } from '@adiwajshing/baileys'
import { Sticker, Categories, StickerTypes } from 'wa-sticker-formatter'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import fs from 'fs';
import { tmpdir } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
// import webp from 'node-webpmux'
export default class Command extends BaseCommand {
    exe() {
        throw new Error('Method not implemented.')
    }
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'toimg',
            aliases: ['toimage'],
            description: 'sends image/gif of a sticker',
            category: 'media',
            usage: `${client.config.prefix}toimg [(tag)[sticker]]`,
            baseXp: 35
        })
    }
    
    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        let buffer
 let   exe = promisify(exec)
 
 if (M.quoted?.message?.message?.stickerMessage) buffer = await this.client.downloadMediaMessage(M.quoted.message)
 else if (M.quoted?.message?.message?.stickerMessage?.isAnimated) buffer = await this.client.downloadMediaMessage(M.WAMessage)
        if (!buffer) return void M.reply(`You didn't provide any sticker to convert`)
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        try {
            await  fs.writeFileSync(`${filename}.webp`,buffer)
            await exe(
                `ffmpeg -i ${filename}.webp ${filename}.png`
                )
     
                const imagebuffer = fs.readFileSync(`${filename}.png`)
                console.log(filename)       
            return void M.reply(
                imagebuffer,
                MessageType.image,
                undefined,
                undefined
                )
                /* only image works for now
		animated webp will give error 
		*/
            } catch (error) {
                M.reply(`could not convert animated stickers for now`)
                /*
                inherited From Xre 
                code is incomplete but you can always see and make changes
                */
                
                const webp = require('node-webpmux');
                
                const image = new webp.Image()
            const output = `${filename}.mp4`

            await image.load(buffer)

            let frames = image.anim.frames.length



            for (let i = 0; frames > i; i++) {
                await exe(`webpmux -get frame ${i} ${buffer} -o ${tmpdir()}/${i}.webp`)
                await exe(`dwebp ${tmpdir()}/${i}.webp -o ${tmpdir()}/${i}.png`)
            }

            await exe(`ffmpeg -framerate 22 -i ${tmpdir()}/%d.png -y -c:v libx264 -pix_fmt yuv420p -loop 4 ${output}`)
            for (frames === 0; frames--; ) {
                fs.unlink(`${tmpdir()}/${frames}.webp`,(err)=>{ if(err) console.error(err)})
                fs.unlink(`${tmpdir()}/${frames}.png`,(err)=>{ if(err) console.error(err)})
            }
        const animatedgif = fs.readFileSync(output)
            return void M.reply(
                animatedgif,
                MessageType.video,
                undefined,
                undefined
            )

        }
    }
}
