import face_recognition
import math
import argparse
import base64
from PIL import Image, ImageDraw
from sys import argv

print("asdf")

def calc_mustache_dimensions(leftmost, rightmost):
    new_width = int((rightmost[0] - leftmost[0]) * 1.25)

    current_width, current_height = mustache.size
    width_percent = new_width / float(current_width)
    new_height = int((float(current_height) * float(width_percent)))

    return new_width, new_height

def calc_mustache_angle(topmost_left, topmost_right):
    return - math.degrees(
            math.atan2(
                topmost_right[1] - topmost_left[1],
                topmost_right[0] - topmost_left[0]
                )
            )

def calc_mustache_offset(mid, width, height):
    return mid[0] - int(width / 2), mid[1] - int(height / 2)

def draw_mustache(face, mustache, img):
    mid = face['top_lip'][3]
    topmost_left = face['top_lip'][2]
    topmost_right = face['top_lip'][4]
    leftmost = face['top_lip'][0]
    rightmost = face['top_lip'][6]

    angle = calc_mustache_angle(topmost_left, topmost_right)
    width, height = calc_mustache_dimensions(leftmost, rightmost)
    offset_x, offset_y = calc_mustache_offset(mid, width, height)

    mustache = mustache.resize((width, height), Image.ANTIALIAS).rotate(angle, Image.CUBIC)

    img.paste(mustache, (offset_x, offset_y), mustache)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='mustache as a service')
    parser.add_argument('file')

    parser.add_argument(
        '-b',
        dest='base64',
        help='output the base64 encoded image instead of opening an image viewer',
        action='store_const',
        default=False,
        const=True
    )

    parser.add_argument(
        '-o',
        dest='output',
        help='output file'
    )

    args = parser.parse_args()

    mustache = Image.open('img/mustache.png', 'r')

    target = face_recognition.load_image_file(args.file)
    landmarks_list = face_recognition.face_landmarks(target)
    img = Image.fromarray(target)

    for face_landmarks in landmarks_list:
        draw_mustache(face_landmarks, mustache, img)

    if args.base64:
        print(base64.b64encode(img.tobytes()))
    elif args.output:
        img.save(args.output)
    else:
        img.show()
