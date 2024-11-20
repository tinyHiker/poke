//'./background_classes.json'

export default async function getJSON(path){
    try {
        let res = await fetch(path)
        let data = res.json()
        return data
    } catch (e) {
        console.log(e)
    }  
}



export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatsTotal(stats){
    let statsTotal = 0
    stats.forEach(stat => statsTotal += stat.base_stat)
    return statsTotal

}

export function getMaxMinStats(data){
    let stats = data.map(stat => stat.base_stat)
    let max = Math.max(...stats);
    let min = Math.min(...stats);
    return [max, min]
}
