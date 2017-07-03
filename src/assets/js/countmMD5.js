import SparkMD5 from 'spark-md5'
import {getFileExtension} from './util'
/**
 * 调用sparkMd5进行hash计算
 * 顺带把文件名更改为md5加后缀
 */
const countMD5 = function (file) {
    return new Promise((resolve, reject) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
        let chunkSize = 2097152                             // Read in chunks of 2MB
        let chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        let fileReader = new FileReader()
        fileReader.onload = (e) => {
            // console.log('read chunk nr', currentChunk + 1, 'of', chunks)
            let dataURL = e.target.result
            spark.append(dataURL)                   // Append array buffer
            currentChunk++

            if (currentChunk < chunks) {
                loadNext()
            } else {
                // md5计算完毕
                let md5 = spark.end()
                let ext = getFileExtension(file.name)
                let formdata = new FormData()
                formdata.append('file', file, `${md5}.${ext}`)
                let newFile = formdata.get('file')
                resolve({
                    md5,
                    newFile
                })
            }
        }

        fileReader.onerror = () => {
            reject('file load error')
        }

        const loadNext = () => {
            let start = currentChunk * chunkSize
            let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext()
    })
}
export default countMD5
