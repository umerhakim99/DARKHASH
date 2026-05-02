from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from apps.stones.models import Category, Stone, StoneImage, PriceHistory


class Command(BaseCommand):
    help = "Seed marketplace with professional dummy precious stone data and generated images."

    def handle(self, *args, **options):
        categories = [
            {
                "name": "Sapphire",
                "description": "Premium blue sapphires sourced from trusted origins.",
            },
            {
                "name": "Ruby",
                "description": "Luxury red rubies with rich color and brilliance.",
            },
            {
                "name": "Emerald",
                "description": "Elegant green emeralds for collectors and jewelers.",
            },
            {
                "name": "Diamond",
                "description": "Certified diamonds with clarity and timeless appeal.",
            },
            {
                "name": "Other Stones",
                "description": "Rare and unique precious stones from global markets.",
            },
        ]

        category_objects = {}

        for item in categories:
            category, _ = Category.objects.get_or_create(
                name=item["name"],
                defaults={"description": item["description"]},
            )
            category_objects[item["name"]] = category

        stones = [
            {
                "name": "Royal Blue Sapphire",
                "category": "Sapphire",
                "description": "A premium royal blue sapphire with deep color saturation, excellent polish, and luxury-grade appeal.",
                "price": Decimal("2450.00"),
                "weight": Decimal("2.35"),
                "color": "Royal Blue",
                "clarity": "VS",
                "origin": "Sri Lanka",
                "stock": 6,
                "is_featured": True,
                "image_color": "#0B3DFF",
            },
            {
                "name": "Mozambique Ruby",
                "category": "Ruby",
                "description": "A vivid red ruby with beautiful brilliance, suitable for fine jewelry and premium collections.",
                "price": Decimal("2200.00"),
                "weight": Decimal("1.80"),
                "color": "Deep Red",
                "clarity": "VVS",
                "origin": "Mozambique",
                "stock": 4,
                "is_featured": True,
                "image_color": "#B00020",
            },
            {
                "name": "Zambian Emerald",
                "category": "Emerald",
                "description": "A natural green emerald with elegant tone, classic beauty, and strong marketplace demand.",
                "price": Decimal("1850.00"),
                "weight": Decimal("2.60"),
                "color": "Emerald Green",
                "clarity": "SI",
                "origin": "Zambia",
                "stock": 7,
                "is_featured": True,
                "image_color": "#008F5A",
            },
            {
                "name": "Brilliant Cut Diamond",
                "category": "Diamond",
                "description": "A brilliant cut diamond with excellent sparkle, suitable for luxury rings and investment pieces.",
                "price": Decimal("3750.00"),
                "weight": Decimal("1.25"),
                "color": "White",
                "clarity": "VVS1",
                "origin": "South Africa",
                "stock": 3,
                "is_featured": True,
                "image_color": "#E8F4FF",
            },
            {
                "name": "Yellow Sapphire",
                "category": "Sapphire",
                "description": "A golden yellow sapphire with warm glow, perfect for premium jewelry designs.",
                "price": Decimal("1650.00"),
                "weight": Decimal("1.95"),
                "color": "Yellow",
                "clarity": "VS",
                "origin": "Thailand",
                "stock": 8,
                "is_featured": False,
                "image_color": "#D4AF37",
            },
            {
                "name": "Pink Sapphire",
                "category": "Sapphire",
                "description": "A soft pink sapphire with romantic color and luxury appeal.",
                "price": Decimal("1290.00"),
                "weight": Decimal("1.45"),
                "color": "Pink",
                "clarity": "VS",
                "origin": "Madagascar",
                "stock": 5,
                "is_featured": False,
                "image_color": "#FF6FB1",
            },
            {
                "name": "Aquamarine",
                "category": "Other Stones",
                "description": "A calm blue aquamarine with elegant transparency and refined appeal.",
                "price": Decimal("850.00"),
                "weight": Decimal("2.10"),
                "color": "Aqua Blue",
                "clarity": "VS",
                "origin": "Brazil",
                "stock": 9,
                "is_featured": False,
                "image_color": "#60D8FF",
            },
            {
                "name": "Amethyst",
                "category": "Other Stones",
                "description": "A purple amethyst with strong color and decorative luxury use.",
                "price": Decimal("420.00"),
                "weight": Decimal("3.25"),
                "color": "Purple",
                "clarity": "SI",
                "origin": "Uruguay",
                "stock": 12,
                "is_featured": False,
                "image_color": "#7B2CBF",
            },
        ]

        for stone_data in stones:
            category = category_objects[stone_data["category"]]

            stone, created = Stone.objects.get_or_create(
                name=stone_data["name"],
                defaults={
                    "category": category,
                    "description": stone_data["description"],
                    "price": stone_data["price"],
                    "weight": stone_data["weight"],
                    "color": stone_data["color"],
                    "clarity": stone_data["clarity"],
                    "origin": stone_data["origin"],
                    "stock": stone_data["stock"],
                    "is_featured": stone_data["is_featured"],
                    "is_active": True,
                },
            )

            if created:
                PriceHistory.objects.create(
                    stone=stone,
                    price=stone.price - Decimal("150.00"),
                )
                PriceHistory.objects.create(
                    stone=stone,
                    price=stone.price - Decimal("75.00"),
                )
                PriceHistory.objects.create(
                    stone=stone,
                    price=stone.price,
                )

            if not stone.images.exists():
                image_path = self.create_dummy_image(
                    stone.name,
                    stone_data["image_color"],
                )

                with open(image_path, "rb") as image_file:
                    StoneImage.objects.create(
                        stone=stone,
                        image=File(image_file, name=image_path.name),
                        alt_text=stone.name,
                        is_primary=True,
                    )

        self.stdout.write(self.style.SUCCESS("Marketplace dummy data created successfully."))

    def create_dummy_image(self, stone_name, color):
        output_dir = Path(settings.MEDIA_ROOT) / "dummy_stones"
        output_dir.mkdir(parents=True, exist_ok=True)

        file_name = stone_name.lower().replace(" ", "_") + ".png"
        image_path = output_dir / file_name

        if image_path.exists():
            return image_path

        width = 900
        height = 650

        image = Image.new("RGB", (width, height), "#090909")
        draw = ImageDraw.Draw(image)

        center_x = width // 2
        center_y = height // 2

        for radius in range(260, 40, -20):
            shade = max(20, 255 - radius // 2)
            draw.ellipse(
                [
                    center_x - radius,
                    center_y - radius,
                    center_x + radius,
                    center_y + radius,
                ],
                outline=color,
                width=3,
            )

        draw.ellipse(
            [center_x - 180, center_y - 130, center_x + 180, center_y + 130],
            fill=color,
            outline="#D4AF37",
            width=8,
        )

        draw.polygon(
            [
                (center_x, center_y - 160),
                (center_x + 180, center_y),
                (center_x, center_y + 160),
                (center_x - 180, center_y),
            ],
            outline="#FFFFFF",
            width=4,
        )

        draw.text(
            (40, 40),
            "GEMLUXE",
            fill="#D4AF37",
        )

        draw.text(
            (40, height - 80),
            stone_name,
            fill="#FFFFFF",
        )

        image.save(image_path, "PNG")
        return image_path