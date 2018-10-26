import face_recognition
from PIL import Image, ImageDraw
from sys import argv

if __name__ == '__main__':
    face_recon_img = face_recognition.load_image_file(argv[1])
    face_landmarks_list = face_recognition.face_landmarks(face_recon_img)

    img = Image.fromarray(face_recon_img)

    canvas = Image.new('RGB', img.size, (255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    for face_landmarks in face_landmarks_list:
        for i, pos in enumerate(face_landmarks['top_lip']):
            draw.text((pos[0], pos[1]), str(i), fill=(0, 0, 0, 0))

    canvas.show()
