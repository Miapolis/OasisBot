const mongo = require('./mongo')
const profileSchema = require('./schema/profile-schema')

const coinsCache = {} // guildId-userId: value

module.exports = (client) => { }

module.exports.addCoins = async (guildId, userId, coins) => {
    return await mongo().then(async (mongoose) => {
        try {
            console.log('Running findOneAndUpdate()')

            const result = await profileSchema.findOneAndUpdate(
                {
                    guildId,
                    userId,
                },
                {
                    guildId,
                    userId,
                    $inc: {
                        coins,
                    },
                },
                {
                    upsert: true,
                    new: true,
                }
            )

            console.log('NEW RESULT: ', result)

            coinsCache[`${guildId}-${userId}`] = result.coins

            return result.coins
        }
        finally {
            mongoose.connection.close()
        }
    })
}

module.exports.getCoins = async (guildId, userId) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]

    if (cachedValue) { return cachedValue }

    return await mongo().then(async mongoose => {
        try {
            console.log('Running findOne()')

            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            console.log('RESULT:', result)

            let coins = 0

            if (result) {
                coins = result.coins
            } else {
                console.log('Inserting a document')

                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }

            coinsCache[`${guildId}-${userId}`] = coins;

            return coins

        } finally {
            mongoose.connection.close()
        }
    })
}