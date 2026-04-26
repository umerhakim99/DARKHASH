import re
from rest_framework import serializers
from apps.stones.serializers import StoneSerializer
from .models import Cart, CartItem, Order, OrderItem


VALID_PROVINCES = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Gilgit-Baltistan",
    "Azad Kashmir",
]


PROVINCE_POSTAL_PREFIXES = {
    "Punjab": [
        "37", "38", "39", "40", "41", "42", "43", "44", "45", "46",
        "47", "48", "49", "50", "51", "52", "53", "54", "55", "56",
        "57", "58", "59", "60", "61", "62", "63", "64",
    ],
    "Sindh": [
        "65", "66", "67", "68", "69", "70", "71", "72", "73", "74",
        "75", "76", "77", "78", "79",
    ],
    "Khyber Pakhtunkhwa": [
        "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
        "28", "29",
    ],
    "Balochistan": [
        "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
        "90", "91", "92", "93",
    ],
    "Islamabad Capital Territory": [
        "44",
    ],
    "Gilgit-Baltistan": [
        "15", "16",
    ],
    "Azad Kashmir": [
        "10", "11", "12", "13",
    ],
}


CITY_ALIASES = {
    # Khyber Pakhtunkhwa
    "lower dir": "lower dir",
    "dir lower": "lower dir",
    "timergara": "lower dir",
    "timer gara": "lower dir",

    "upper dir": "upper dir",
    "dir upper": "upper dir",
    "dir": "dir",

    "peshawar": "peshawar",
    "swat": "swat",
    "mingora": "swat",
    "abbottabad": "abbottabad",
    "mardan": "mardan",
    "nowshera": "nowshera",
    "charsadda": "charsadda",
    "bannu": "bannu",
    "kohat": "kohat",
    "dera ismail khan": "dera ismail khan",
    "d i khan": "dera ismail khan",
    "dikhan": "dera ismail khan",

    # Punjab
    "lahore": "lahore",
    "rawalpindi": "rawalpindi",
    "faisalabad": "faisalabad",
    "multan": "multan",
    "gujranwala": "gujranwala",
    "sialkot": "sialkot",
    "bahawalpur": "bahawalpur",
    "sargodha": "sargodha",

    # Sindh
    "karachi": "karachi",
    "hyderabad": "hyderabad",
    "sukkur": "sukkur",
    "larkana": "larkana",
    "mirpur khas": "mirpur khas",

    # Islamabad
    "islamabad": "islamabad",

    # Balochistan
    "quetta": "quetta",
    "gwadar": "gwadar",
    "turbat": "turbat",
    "khuzdar": "khuzdar",

    # Gilgit-Baltistan
    "gilgit": "gilgit",
    "skardu": "skardu",
    "hunza": "hunza",

    # Azad Kashmir
    "muzaffarabad": "muzaffarabad",
    "mirpur": "mirpur",
    "rawalakot": "rawalakot",
}


CITY_POSTAL_CODES = {
    # Khyber Pakhtunkhwa
    "lower dir": ["18300"],
    "upper dir": ["18000"],
    "dir": ["18000", "18300"],
    "peshawar": ["25000"],
    "swat": ["19130"],
    "abbottabad": ["22010"],
    "mardan": ["23200"],
    "nowshera": ["24100"],
    "charsadda": ["24420"],
    "bannu": ["28100"],
    "kohat": ["26000"],
    "dera ismail khan": ["29050"],

    # Punjab
    "lahore": ["54000", "54660", "54792"],
    "rawalpindi": ["46000"],
    "faisalabad": ["38000"],
    "multan": ["60000"],
    "gujranwala": ["52250"],
    "sialkot": ["51310"],
    "bahawalpur": ["63100"],
    "sargodha": ["40100"],

    # Sindh
    "karachi": ["74000", "75300", "75600"],
    "hyderabad": ["71000"],
    "sukkur": ["65200"],
    "larkana": ["77150"],
    "mirpur khas": ["69000"],

    # Islamabad
    "islamabad": ["44000"],

    # Balochistan
    "quetta": ["87300"],
    "gwadar": ["91200"],
    "turbat": ["92600"],
    "khuzdar": ["89100"],

    # Gilgit-Baltistan
    "gilgit": ["15100"],
    "skardu": ["16100"],
    "hunza": ["15750"],

    # Azad Kashmir
    "muzaffarabad": ["13100"],
    "mirpur": ["10250"],
    "rawalakot": ["12350"],
}


def normalize_city(value):
    city = value.strip().lower()
    city = re.sub(r"\s+", " ", city)
    return CITY_ALIASES.get(city, city)


def validate_pakistan_phone(value):
    phone = value.strip()

    if not re.fullmatch(r"(03[0-9]{9}|\+923[0-9]{9})", phone):
        raise serializers.ValidationError(
            "Enter a valid Pakistan phone number. Example: 03XXXXXXXXX or +923XXXXXXXXX."
        )

    return value


def validate_postal_code(value):
    if not re.fullmatch(r"[0-9]{5}", value):
        raise serializers.ValidationError("Postal code must be exactly 5 digits.")

    return value


def validate_province_postal_code(province, postal_code):
    allowed_prefixes = PROVINCE_POSTAL_PREFIXES.get(province, [])

    if not allowed_prefixes:
        return

    prefix = postal_code[:2]

    if prefix not in allowed_prefixes:
        allowed_text = ", ".join(allowed_prefixes)

        raise serializers.ValidationError(
            {
                "postal_code": (
                    f"Postal code {postal_code} does not match {province}. "
                    f"For {province}, postal code should start with one of: {allowed_text}."
                )
            }
        )


def validate_city_postal_code(city, postal_code):
    normalized_city = normalize_city(city)
    allowed_codes = CITY_POSTAL_CODES.get(normalized_city)

    if not allowed_codes:
        return

    if postal_code not in allowed_codes:
        allowed_text = ", ".join(allowed_codes)

        raise serializers.ValidationError(
            {
                "postal_code": (
                    f"Postal code {postal_code} does not match {city}. "
                    f"Allowed postal code(s) for {city}: {allowed_text}."
                )
            }
        )


def validate_manual_address(city, province, postal_code):
    if province not in VALID_PROVINCES:
        raise serializers.ValidationError(
            {"province": "Please select a valid province/state."}
        )

    if not city or len(city.strip()) < 2:
        raise serializers.ValidationError(
            {"city": "Please enter a valid city, town, or district name."}
        )

    if not re.fullmatch(r"^[A-Za-z\s\-'./]+$", city.strip()):
        raise serializers.ValidationError(
            {"city": "City name should contain letters only."}
        )

    validate_postal_code(postal_code)
    validate_province_postal_code(province, postal_code)
    validate_city_postal_code(city, postal_code)


class CartItemSerializer(serializers.ModelSerializer):
    stone_detail = StoneSerializer(source="stone", read_only=True)
    total_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = CartItem
        fields = ["id", "stone", "stone_detail", "quantity", "total_price"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Cart
        fields = ["id", "items", "total_price", "created_at"]


class AddToCartSerializer(serializers.Serializer):
    stone_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class RemoveFromCartSerializer(serializers.Serializer):
    stone_id = serializers.IntegerField()


class OrderItemSerializer(serializers.ModelSerializer):
    stone_detail = StoneSerializer(source="stone", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "stone", "stone_detail", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "username",
            "total_price",
            "status",
            "payment_method",
            "payment_status",
            "full_name",
            "email",
            "phone",
            "address_line_1",
            "address_line_2",
            "city",
            "province",
            "country",
            "postal_code",
            "customer_note",
            "created_at",
            "updated_at",
            "items",
        ]


class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=160)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=40)

    address_line_1 = serializers.CharField(max_length=255)
    address_line_2 = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )

    city = serializers.CharField(max_length=100)
    province = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default="Pakistan")
    postal_code = serializers.CharField(max_length=30)

    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.CASH_ON_DELIVERY,
    )

    customer_note = serializers.CharField(required=False, allow_blank=True)

    def validate_phone(self, value):
        return validate_pakistan_phone(value)

    def validate_postal_code(self, value):
        return validate_postal_code(value)

    def validate(self, attrs):
        if attrs.get("country") != "Pakistan":
            raise serializers.ValidationError(
                {"country": "Currently Cash on Delivery is available only in Pakistan."}
            )

        validate_manual_address(
            city=attrs.get("city"),
            province=attrs.get("province"),
            postal_code=attrs.get("postal_code"),
        )

        return attrs


class AdminOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status", "payment_status"]