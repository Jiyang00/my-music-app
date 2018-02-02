/* 
针对专辑信息我们封装一个类模型。
使用类模型的好处可以使代码重复利用，方便后续继续使用，ui对应的数据清晰，把ui需要的字段统一作为类的属性，根据属性就能很清楚的知道ui需要哪些数据
*/

/**
 * 专辑类模型
 * 
 * @export
 * @class Album
 */
export class Album {
    constructor(id, mId, name, img, singer, publicTime) {
        this.id = id;
        this.mId = mId;
        this.name = name;
        this.img = img;
        this.singer = singer;
        this.publicTime = publicTime;
    }
}
/**
 * 通过专辑列表数据创建专辑对象函数	
 * 
 * @export
 * @param {any} data 
 * @returns 创建新专辑对象
 */
export function createAlbumByList(data) {
    return new Album(
        data.album_id,
        data.album_mid,
        data.album_name,
        `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.album_mid}.jpg?max_age=2592000`,
        filterSinger(data.singers),
        data.public_time
    )
}
/**
 * 歌手名单
 * 
 * @param {any} singer 
 * @returns 歌手列表，以"/"分割
 */
function filterSinger(singer) {
    let singerArray = singer.map(singer => {
        return singer.singer_name;
    })
    return singerArray.join("/");
}