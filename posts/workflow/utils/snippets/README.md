---
sort: 2
title: "常用代码片段"
description: ""
date: 2024-07-17 23:31:02
---

# 常用代码片段

## 1. 横向合并两张图片的函数
```python
from PIL import Image


def merge_images_horizontally(img_path1, img_path2, output_path):
    # 打开图片
    img1 = Image.open(img_path1)
    img2 = Image.open(img_path2)

    # 获取图片尺寸
    width1, height1 = img1.size
    width2, height2 = img2.size

    # 按较大的高度调整较小图片的大小，并保持比例
    if height1 > height2:
        new_height = height1
        new_width = int((width2 / height2) * new_height)
        img2 = img2.resize((new_width, new_height), Image.Resampling.LANCZOS)
    else:
        new_height = height2
        new_width = int((width1 / height1) * new_height)
        img1 = img1.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # 获取调整后的图片尺寸
    width1, height1 = img1.size
    width2, height2 = img2.size

    # 创建一个新的图像，用来存放合并后的图片
    new_img = Image.new('RGB', (width1 + width2, height1))

    # 将两张图片粘贴到新的图像中
    new_img.paste(img1, (0, 0))
    new_img.paste(img2, (width1, 0))

    # 保存合并后的图片
    new_img.save(output_path)
```

## 2. 给图片增加水印的工具
```python
import enum
import math
import textwrap
from PIL import Image, ImageFont, ImageDraw, ImageEnhance, ImageChops, ImageOps


class WatermarkerStyles(enum.Enum):
    """水印样式"""
    STRIPED = 1  # 斜向重复
    CENTRAL = 2  # 居中


class Watermarker:
    """图片水印工具"""

    def __init__(
            self, image_path: str, text: str,
            style: WatermarkerStyles,
            angle=30,
            color='#D3D3D3',
            font_file='./arial.ttf',
            font_height_crop=1.2,
            opacity=0.15,
            quality=80,
            size=30,
            space=100,
            chars_per_line=8,
    ):
        """
        :param image_path:
        :param text: 水印文字
        :param angle: 角度
        :param color: 水印颜色
        :param font_file: 字体文件名
        :param font_height_crop: 水印字体高度裁剪大小（默认即可，按需调整）
        :param opacity: 水印透明度
        :param quality: 图片质量
        :param size: 水印单个文字的大小
        :param space: 水印的间距（仅斜向重复样式有效）
        :param chars_per_line: 每行字数（超过就换行，仅居中水印有效）
        """
        self.image_path = image_path
        self.text = text
        self.style = style
        self.angle = angle
        self.color = color
        self.font_file = font_file
        self.font_height_crop = font_height_crop
        self.opacity = opacity
        self.quality = quality
        self.size = size
        self.space = space
        self.chars_per_line = chars_per_line
        self._result_image = None

    @staticmethod
    def set_image_opacity(image: Image, opacity: float):
        """设置图片透明度"""
        assert 0 <= opacity <= 1
        alpha = image.split()[3]
        alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
        image.putalpha(alpha)
        return image

    @staticmethod
    def crop_image_edge(image: Image):
        """裁剪图片边缘空白"""
        bg = Image.new(mode='RGBA', size=image.size)
        diff = ImageChops.difference(image, bg)
        bbox = diff.getbbox()
        return image.crop(bbox) if bbox else image

    def _generate_watermark_image(self, text: str):
        """生成水印图片"""
        width = len(text) * self.size
        height = round(self.size * self.font_height_crop)
        watermark_image = Image.new(mode='RGBA', size=(width, height))
        draw_table = ImageDraw.Draw(im=watermark_image)
        draw_table.text(
            xy=(0, 0),
            text=text,
            fill=self.color,
            font=ImageFont.truetype(self.font_file, size=self.size)
        )
        watermark_image = Watermarker.crop_image_edge(watermark_image)
        return Watermarker.set_image_opacity(watermark_image, self.opacity)

    def _add_mark_striped(self):
        """添加斜向重复水印"""
        origin_image = Image.open(self.image_path)
        origin_image = ImageOps.exif_transpose(origin_image)
        watermark_image = self._generate_watermark_image(self.text)
        c = int(math.sqrt(origin_image.size[0] ** 2 + origin_image.size[1] ** 2))
        watermark_mask = Image.new(mode='RGBA', size=(c, c))

        y, idx = 0, 0
        while y < c:
            x = -int((watermark_image.size[0] + self.space) * 0.5 * idx)
            idx = (idx + 1) % 2
            while x < c:
                watermark_mask.paste(watermark_image, (x, y))
                x += watermark_image.size[0] + self.space
            y += watermark_image.size[1] + self.space

        watermark_mask = watermark_mask.rotate(self.angle)
        if origin_image.mode != 'RGBA':
            origin_image = origin_image.convert('RGBA')
        origin_image.paste(
            watermark_mask,
            (int((origin_image.size[0] - c) / 2), int((origin_image.size[1] - c) / 2)),
            mask=watermark_mask.split()[3]
        )
        return origin_image

    def _add_mark_central(self):
        """添加居中水印"""
        origin_image = Image.open(self.image_path)
        origin_image = ImageOps.exif_transpose(origin_image)
        text_lines = textwrap.wrap(self.text, width=self.chars_per_line)
        text = '\n'.join(text_lines)
        watermark_image = self._generate_watermark_image(text)
        c = int(math.sqrt(origin_image.size[0] ** 2 + origin_image.size[1] ** 2))
        watermark_mask = Image.new(mode='RGBA', size=(c, c))
        watermark_mask.paste(
            watermark_image,
            (int((watermark_mask.width - watermark_image.width) / 2),
             int((watermark_mask.height - watermark_image.height) / 2))
        )
        watermark_mask = watermark_mask.rotate(self.angle)
        if origin_image.mode != 'RGBA':
            origin_image = origin_image.convert('RGBA')
        box = (
            int((origin_image.width - watermark_mask.width) / 2),
            int((origin_image.height - watermark_mask.height) / 2))
        origin_image.paste(watermark_mask, box, mask=watermark_mask.split()[3])
        return origin_image

    @property
    def image(self):
        """获取加了水印的图片对象"""
        if not self._result_image:
            if self.style == WatermarkerStyles.STRIPED:
                self._result_image = self._add_mark_striped()
            elif self.style == WatermarkerStyles.CENTRAL:
                self._result_image = self._add_mark_central()
        return self._result_image

    def save(self, file_path: str, image_format: str = 'png'):
        """保存带水印的图像"""
        with open(file_path, 'wb') as f:
            self.image.save(f, image_format)

    def show(self):
        """显示带水印的图像"""
        self.image.show()
```

## 3. 向指定目录下文件批量写入文字水印
```python
import os
import fnmatch
import shutil

from test import Watermarker, WatermarkerStyles

# 指定目录和文件扩展名
directory = '文件绝对路径'
extensions = ['*.png', '*.jpg', '*.jpeg']
filter_dirs = ['dist', 'public']


def find_files(directory, extensions):
    for root, dirs, files in os.walk(directory):
        for extension in extensions:
            for filename in fnmatch.filter(files, extension):
                # 过滤文件夹
                if any(filter_dir in root for filter_dir in filter_dirs):
                    continue
                
                # 原始路径
                origin_path = str(os.path.join(root, filename))

                # 从原始路径备份一个
                name, ext = os.path.splitext(filename)
                new_name = f"{name}_origin{ext}"
                os.rename(origin_path, os.path.join(root, new_name))
                new_path = str(os.path.join(root, new_name))
                
                # 向新文件路径写入水印
                Watermarker(image_path=new_path, text='https://yqqy.top', style=WatermarkerStyles.STRIPED, space=120).save(origin_path)
                print(origin_path + " >> 加水印完成")
                
                # 将原始路径文件移动到备份文件夹
                shutil.move(new_path, "./origin_blog/"+new_name)
```