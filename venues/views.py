from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from .models import City

# Create your views here.
def map(request):
	return render(request, 'map.html')


def getCities(request):
	json = serialize('geojson', City.objects.all())
	response = HttpResponse(json)
	return response




