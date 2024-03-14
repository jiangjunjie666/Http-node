const fs = require('fs')
const path = require('path')

const addOnline = () => {
  const addOnlinePath = path.join(__dirname, '../public/jsonData/apiInvoke.json')
  fs.readFile(addOnlinePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      try {
        const apiInvoke = JSON.parse(data)
        const today = new Date().toLocaleDateString()
        const index = apiInvoke.findIndex((item) => item.date === today)
        if (index === -1) {
          apiInvoke.push({
            id: apiInvoke.length + 1,
            date: today,
            num: 1
          })
        } else {
          apiInvoke[index].num = apiInvoke[index].num + 1
        }
        fs.writeFileSync(addOnlinePath, JSON.stringify(apiInvoke, null, 2) + '\n')
      } catch (err) {
        console.log(err)
      }
    }
  })
}

module.exports = addOnline
