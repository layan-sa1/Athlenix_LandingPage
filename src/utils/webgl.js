// Detects not just whether WebGL *exists*, but whether it actually renders correctly. Some GPU
// drivers report "hardware accelerated" while silently rendering wrong colors (exactly the bug
// hit during testing: a solid red clear color came back white). We render one pixel and read it
// back — if it isn't red, WebGL is unreliable on this device and the caller should fall back to
// a CSS-only experience instead of a broken 3D one.
export function isWebGLReliable() {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false

    gl.clearColor(1, 0, 0, 1) // pure red
    gl.clear(gl.COLOR_BUFFER_BIT)

    const pixel = new Uint8Array(4)
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

    const isRedEnough = pixel[0] > 200 && pixel[1] < 80 && pixel[2] < 80
    return isRedEnough
  } catch (e) {
    return false
  }
}
