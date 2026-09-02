from rest_framework import serializers

from .models import Product, Inventory
from accounts.models import Account
from fish.models import FeedRecommendation


class ProductSerializer(
    serializers.ModelSerializer
):

    account_id = serializers.IntegerField(
        write_only=True,
        required=False
    )

    inventory_quantity = serializers.IntegerField(
        write_only=True,
        required=False
    )

    inventory = serializers.SerializerMethodField(
        read_only=True
    )

    class Meta:

        model = Product

        fields = [
            'id',
            'account_id',
            'feed_type',
            'feed_name',
            'brand_name',
            'price',
            'protein_range',
            'pellet_size',
            'image',
            'description',
            'inventory_quantity',
            'inventory',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'inventory',
        ]

        extra_kwargs = {
            'image': {
                'required': False,
                'allow_null': True,
            },
            'description': {
                'required': False,
                'allow_null': True,
            },
        }


    def validate_account_id(
        self,
        value
    ):

        try:

            account = Account.objects.get(
                id=value
            )

        except Account.DoesNotExist:

            raise serializers.ValidationError(
                'Account not found.'
            )

        if account.role != 'vendor':

            raise serializers.ValidationError(
                'Vendor account required.'
            )

        return value

    def validate_price(
       self,
       value
    ):

       if value < 0:

          raise serializers.ValidationError(
             'Price cannot be negative.'
          )

       return value

    def validate_inventory_quantity(
        self,
        value
    ):

        if value < 0:

            raise serializers.ValidationError(
                'Inventory quantity cannot be negative.'
            )

        return value


    def validate(
        self,
        data
    ):

        feed_type = data.get(
            'feed_type'
        )

        feed_name = data.get(
            'feed_name'
        )


        # -------------------------------------
        # Use existing values during update
        # -------------------------------------

        if self.instance:

            if feed_type is None:

                feed_type = self.instance.feed_type


            if feed_name is None:

                feed_name = self.instance.feed_name


        # -------------------------------------
        # Validate Feed Type + Feed Name
        # -------------------------------------

        exists = FeedRecommendation.objects.filter(
            feed_type=feed_type,
            feed_name=feed_name
        ).exists()


        if not exists:

            raise serializers.ValidationError({
                'feed_name':
                    'Selected feed name does not belong to the selected feed type.'
            })


        return data


    def get_inventory(
        self,
        obj
    ):

        try:

            inventory = obj.inventory

            return {
                'id': inventory.id,
                'quantity': inventory.quantity,
                'updated_at': inventory.updated_at,
            }

        except Inventory.DoesNotExist:

            return None


    def create(
        self,
        validated_data
    ):

        account_id = validated_data.pop(
            'account_id'
        )

        inventory_quantity = validated_data.pop(
            'inventory_quantity'
        )

        account = Account.objects.get(
            id=account_id
        )

        product = Product.objects.create(
            vendor=account,
            **validated_data
        )


        Inventory.objects.create(
            product=product,
            initial_quantity=inventory_quantity,
            quantity=inventory_quantity
        )


        return product


    def update(
        self,
        instance,
        validated_data
    ):

        # -------------------------------------
        # Remove Account ID
        # -------------------------------------

        validated_data.pop(
            'account_id',
            None
        )


        # -------------------------------------
        # Get Inventory Quantity
        # -------------------------------------

        inventory_quantity = validated_data.pop(
            'inventory_quantity',
            None
        )


        # -------------------------------------
        # Update Product
        # -------------------------------------

        for field, value in validated_data.items():

            setattr(
                instance,
                field,
                value
            )


        instance.save()


        # -------------------------------------
        # Update Inventory
        # -------------------------------------

        if inventory_quantity is not None:

            try:

                inventory = instance.inventory

                inventory.quantity = (
                    inventory_quantity
                )

                inventory.save()

            except Inventory.DoesNotExist:

                Inventory.objects.create(
                    product=instance,
                    initial_quantity=inventory_quantity,
                    quantity=inventory_quantity
                )


        return instance