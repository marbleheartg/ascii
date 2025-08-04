import Jimp from "jimp"
import { NextRequest, NextResponse } from "next/server"

// const asciiChars = "█▓▒░. ";
// const asciiChars = "@#%&?*+=-:. ";
// const asciiChars = "#WMBRXVYIti+=~:,.. ";
const asciiChars = "⣿⣷⣯⣟⡿⢿⠻⠿⠛⠋⠁⠀"
// const asciiChars = "█▓▒░⠿⠻⠶⠦⠤⠄⠂ "

export async function GET(req: NextRequest) {
  try {
    const pfpUrl = "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original"
    // req.nextUrl.searchParams.get("pfpUrl")
    if (!pfpUrl) return new NextResponse("Missing pfpUrl", { status: 400 })

    const width = req.nextUrl.searchParams.get("width")
    if (!width) return new NextResponse("Missing width", { status: 400 })

    const imageRes = await fetch(pfpUrl)
    if (!imageRes.ok) return new NextResponse("Failed to fetch image", { status: 400 })

    const buffer = Buffer.from(await imageRes.arrayBuffer())
    const ascii = await imageToASCII(buffer, Math.floor(Number(width) / 10.5))

    return new NextResponse(ascii, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

async function imageToASCII(buffer: Buffer, width = 36) {
  const aspectRatio = 0.7
  const image = await Jimp.read(buffer)
  image.resize(width, Math.floor(width * aspectRatio)).grayscale()

  let ascii = ""

  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      const pixel = image.getPixelColor(x, y)
      const { r, g, b } = Jimp.intToRGBA(pixel)
      const brightness = (r + g + b) / (3 * 255)
      const index = Math.floor((1 - brightness) * (asciiChars.length - 1))
      const char = asciiChars[index]
      ascii += char
    }
    ascii += "\n"
  }

  return ascii
}
