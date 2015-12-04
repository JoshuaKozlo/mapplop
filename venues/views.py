from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from .serializers import CitySerializer, VenueSerializer
from rest_framework.renderers import JSONRenderer
from django.core.mail import send_mail
from .models import City, Venue

# Create your views here.
def home(request):
	return render(request, 'home.html')

def map(request):
	return render(request, 'map.html')

def addVenue(request):
	if request.method == 'POST':
		data = [request.POST['name'],
				request.POST['city'],
				request.POST['state']]
		emailAddRemoveRequest(data, 'add')
		return render(request, 'addvenueconfirm.html')

	return render(request, 'addvenue.html')

def removeVenue(request):
	if request.method == 'POST':
		data = [request.POST['name'],
				request.POST['city'],
				request.POST['state'],
				request.POST['description']]
		emailAddRemoveRequest(data, 'change or remove')
		return render(request, 'removevenueconfirm.html')

	return render(request, 'removevenue.html')


def getCities(request):
	serialized = CitySerializer(City.objects.filter(venue__pk__isnull=False).distinct(), many=True)
	json = JSONRenderer().render(serialized.data)
	#json = serialize('geojson', City.objects.filter(venue__isnull=False).distinct())
	response = HttpResponse(json)
	return response


def getVenues(request):
	level = request.GET.get('scale')
	if level == 'US':
		venues = Venue.objects.filter(featured=True).order_by('city__state', 'city__name', 'name')
	elif level == 'state':
		state = request.GET.get('state')
		venues = Venue.objects.filter(city__state=state).order_by('city__state', 'city__name', 'name')
	else:
		state = request.GET.get('state')
		city = request.GET.get('city')
		venues = Venue.objects.filter(city__state=state, city__name=city).order_by('city__state', 'city__name', 'name')

	serialized = VenueSerializer(venues, many=True)
	json = JSONRenderer().render(serialized.data)
	response = HttpResponse(json)
	return response

def emailAddRemoveRequest(data, reqType):
	fromEmail = settings.EMAIL_HOST_USER
	toEmail = 'mapplop@gmail.com'
	if reqType == 'add':
		subject = 'ADD: {}, {} - {}'.format(data[1], data[2], data[0])
		send_mail(subject, '', fromEmail, [toEmail], fail_silently=True)
	else:
		subject = 'CHANGE/REMOVE: {} - {}, {}'.format(data[0], data[1], data[2])
		send_mail(subject, data[3], fromEmail, [toEmail], fail_silently=True)





