import fs from 'fs'
import path from 'path'

export const initStorage = () => {

  const uploadPath = path.join(process.cwd(), 'uploads')

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
    console.log('Uploads folder created')
  } else {
    console.log('Uploads folder already exists')
  }

}