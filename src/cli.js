import arg from 'arg'
import fs from 'fs'

function parseArguments(rawArgs) {
    const args = arg({
        '-t': String,
        '-o': String,
        '-h': Boolean,
    }, {
        argv: rawArgs.slice(2),
    })
    return {
        format: args['-t'] || "",
        savePath: args['-o'] || "",
        help: args['-h'] || false,
    }
}

function jsonParse(data) {
    let array = data.split("\n")
    let dataArray = []
    for (let i = 0; i < array.length; i++) {
        if (array[i] === '') {
            continue
        }
        let tempArray = []
        tempArray = array[i].split(",")
        dataArray.push(tempArray)
    }

    let json = {}
    let c = 1
    dataArray.forEach((e1) => {
        let isdate = true
        let tempjson = {}
        e1.forEach((e2) => {
            let key
            if (isdate) {
                key = 'date'
                tempjson[key] = e2
                isdate = false
            } else if (e2.includes("batteryCurrent")) {
                key = "batteryCurrent"
                tempjson[key] = e2.split("batteryCurrent=")[1]
            } else {
                let arr = e2.split("=")
                key = arr[0].trim()
                tempjson[key] = arr[1]
            }
        })
        json[c] = tempjson
        c++
    })

    return(json)
}

export function cli(args) {
    const readPath = args[2]
    let options = parseArguments(args)

    if (options.help) {
        console.log('log_tool command')
        console.log('')
        console.log('usage:')
        console.log('')
        console.log('log_tool <directory file>')
        console.log('')
        console.log('flag:')
        console.log('')
        console.log('-t <format>','set format json or text')
        console.log('-o <directory file>','set directory path to save the file')
        console.log('-h','help')
        console.log('Bayu Puguh Yuhartono')
        return
    }

    fs.readFile(readPath, 'utf8', function (err, data) {
        if (err) {
            console.log('no such file or directory')
        } else {
            let ext = ".txt"
            if (options.format) {
                if (options.format === "json") {
                    data = JSON.stringify(jsonParse(data))
                    ext = ".json"
                }
            }

            let fileName = process.cwd() + "/log_tool-" + Date.now() + ext

            if (options.savePath) {
                fileName = options.savePath
            }

            fs.writeFile(fileName, data, function (err) {
                console.log('File is created successfully.');
                console.log('Path File:',fileName);
            });
        }
    })
}