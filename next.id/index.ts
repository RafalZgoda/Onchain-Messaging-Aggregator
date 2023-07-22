const axios = require('axios');

type TNeighbor = {
    source: string;
    displayName: string;
    identity: string;
    profileUrl?: string;
}

type TUserProfile = {
    ENS: string | null;
    neighbors : TNeighbor[]
}

enum Platform {
    twitter = "twitter",
    ethereum = "ethereum",
    nextid = "nextid",
    keybase = "keybase",
    github = "github",
    reddit = "reddit",
    lens = "lens",
    dotbit = "dotbit",
    dns = "dns",
    minds = "minds",
    unstoppabledomains = "unstoppabledomains",
    farcaster = "farcaster",
    space_id = "space_id",
    unknown = "unknown"
}

const getUserOnChainData = async (identity: string, platform: string) : Promise<TUserProfile> => {
    let data = JSON.stringify({
        query: `query findOneIdentity {
    identity(platform: "${platform}", identity: "${identity.toLocaleLowerCase()}") {
        status
        uuid
        displayName
        createdAt
        addedAt
        updatedAt
        neighborWithTraversal(depth: 3) {
        source
        from {
            uuid
            platform
            identity
            displayName
        }
        to {
            uuid
            platform
            identity
            displayName
            avatarUrl
            profileUrl
        }
        }
    }
    }`,
        variables: {}
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://relation-service.next.id/',
        headers: {
            'content-type': 'application/json'
        },
        data: data
    };

    const response = (await axios(config)).data;
    const neighbors:TNeighbor[] = []
    for (const neighbor of response.data.identity.neighborWithTraversal) {
        const neighborProfile: TNeighbor = {
            source: neighbor.source,
            displayName: neighbor.to.displayName,
            identity: neighbor.to.identity,
            profileUrl: neighbor.to.profileUrl
        }
        neighbors.push(neighborProfile)
    }

    const userProfile: TUserProfile = {
        ENS: response.data.identity.displayName,
        neighbors: neighbors
    }
    return userProfile
}

(async () => {
    await getUserOnChainData("0x551e546355FF2FAd9D8f2e528908ef2E49C1C8c9", "ethereum")
})()