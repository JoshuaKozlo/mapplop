from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from .serializers import CitySerializer, VenueSerializer
from rest_framework.renderers import JSONRenderer
from .models import City, Venue

# Create your views here.
def map(request):
	return render(request, 'map.html')


def getCities(request):
	serialized = CitySerializer(City.objects.filter(venue__pk__isnull=False).distinct(), many=True)
	json = JSONRenderer().render(serialized.data)
	#json = serialize('geojson', City.objects.filter(venue__isnull=False).distinct())
	response = HttpResponse(json)
	return response


def getVenues(request):
	query = request.GET
	level = query.get('level', 'ff')
	# fetchVenue = Venue.objects.filter(city__state='{}'.format(level)).order_by('city__state')
	fetchVenue = Venue.objects.all().order_by('city__state', 'city__name')
	serialized = VenueSerializer(fetchVenue, many=True)
	json = JSONRenderer().render(serialized.data)
	response = HttpResponse(json)
	return response







