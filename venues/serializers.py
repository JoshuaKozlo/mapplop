from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import City, Venue

class CitySerializer(GeoFeatureModelSerializer):
	class Meta:
		model = City
		geo_field = 'point'
		fields = ('name', 'state', 'population', 'venue_count')

class VenueSerializer(serializers.ModelSerializer):

	class Meta:
		model = Venue
		fields = ('name', 'street', 'city_state', 'website', 'image')



