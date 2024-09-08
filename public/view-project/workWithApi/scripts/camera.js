/* grabbed from tutorial, pretty much 1 to 1 with the original */
const cameraVideoStream = document.getElementById('camera-stream')
const shutterButton = document.getElementById('shutter')
const photosButton = document.getElementById('photos-btn')
const gallery = document.querySelector('.gallery-view')
const currentImageElement = document.querySelector('.gallery-view img')
const closeGalleryButton = document.getElementById('close-gallery')
const nextButton = document.getElementById('next')
const prevButton = document.getElementById('prev')
const canvas = document.getElementById('canvas')

let width = window.innerWidth
let height = 0
let streaming = false

const capturedImages = []

// Connect media device
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ video: true })) {
  navigator.mediaDevices.getUserMedia({ video: true }).then ((stream) => {
    cameraVideoStream.srcObject = stream
    cameraVideoStream.play()
  })
} 

cameraVideoStream.addEventListener(
  "canplay",
  (ev) => {
    if (!streaming) {
      height = cameraVideoStream.videoHeight / (cameraVideoStream.videoWidth / width);
      
      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      cameraVideoStream.setAttribute("width", width);
      cameraVideoStream.setAttribute("height", height);
      streaming = true;
    }
  },
  false
);

// Capture snapshots using HTML Canvas
function captureImage () {
  const canvasContext = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  canvasContext.drawImage(cameraVideoStream, 0, 0, width, height)

  // Convert captured data to image (base64)
  const data = canvas.toDataURL('image/png')
  currentImageElement.src = data
  photosButton.style.backgroundImage = `url(${data})`
  capturedImages.push(data)
  capturedImages.reverse()
}

shutterButton.addEventListener('click', () => captureImage())

// Event handlers to close and open gallery
photosButton.addEventListener('click', () => {
  gallery.classList.add('show-gallery')
  currentImageElement.setAttribute('data-index', 0)
})
closeGalleryButton.addEventListener('click', () => gallery.classList.remove('show-gallery'))

// Event handlers to browse gallery (next and previous)
nextButton.addEventListener('click', () => {
  const index = Number(currentImageElement.getAttribute('data-index'))
  if (capturedImages[index + 1]) {
    currentImageElement.src = capturedImages[index + 1]
    currentImageElement.setAttribute('data-index', index + 1)
  }
})
prevButton.addEventListener('click', () => {
  const index = Number(currentImageElement.getAttribute('data-index'))
  if (capturedImages[index - 1]) {
    currentImageElement.src = capturedImages[index - 1]
    currentImageElement.setAttribute('data-index', index - 1)
  }
})