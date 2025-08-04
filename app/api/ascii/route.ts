import Jimp from "jimp"
import { NextRequest, NextResponse } from "next/server"

const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. "

export async function GET(req: NextRequest) {
  try {
    const pfpUrl = "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original"
    // || req.nextUrl.searchParams.get("pfpUrl")
    if (!pfpUrl) return new NextResponse("Missing pfpUrl", { status: 400 })

    const imageRes = await fetch(pfpUrl)
    if (!imageRes.ok) return new NextResponse("Failed to fetch image", { status: 400 })

    const buffer = Buffer.from(await imageRes.arrayBuffer())
    const ascii = await imageToASCII(buffer)

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

async function imageToASCII(buffer: Buffer, width = 40) {
  const image = await Jimp.read(buffer)
  image.resize(width, Jimp.AUTO).grayscale()

  let ascii = ""

  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      const pixel = image.getPixelColor(x, y)
      const { r } = Jimp.intToRGBA(pixel)
      const brightness = r / 255
      const index = Math.floor((1 - brightness) * (asciiChars.length - 1))
      const char = asciiChars[index]
      ascii += char
    }
    ascii += "\n"
  }

  return ascii
}
