from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.serializers import serialize
from rest_framework.renderers import JSONRenderer
from django.core.mail import send_mail
from .models import City, Venue
from .forms import ModifyVenuesForm
from .serializers import CitySerializer, VenueSerializer

# Create your views here.
def home(request):
	return render(request, 'home.html')


def map(request):
	return render(request, 'map.html')

def thanks(request):
	return render(request, 'thanks.html')


def getCities(request):
	serialized = CitySerializer(City.objects.filter(venue__pk__isnull=False).distinct(), many=True)
	json = JSONRenderer().render(serialized.data)
	#json = serialize('geojson', City.objects.filter(venue__isnull=False).distinct())
	response = HttpResponse(json)
	return response

def getCity(request):
	city = request.GET.get('city')
	state = request.GET.get('state')
	serialized = CitySerializer(City.objects.filter(name=city, state=state).distinct(), many=True)
	json = JSONRenderer().render(serialized.data)
	response = HttpResponse(json)
	return response


def getVenues(request):
	level = request.GET.get('scale')
	if level == 'US':
		venues = Venue.objects.filter(featured=True).order_by('city__state', 'city__name', 'name')
	elif level == 'state':
		state = request.GET.get('state')
		venues = Venue.objects.filter(city__state=state).order_by('-featured', 'city__state', 'city__name', 'name')
	else:
		state = request.GET.get('state')
		city = request.GET.get('city')
		venues = Venue.objects.filter(city__state=state, city__name=city).order_by('city__state', 'city__name', 'name')

	serialized = VenueSerializer(venues, many=True)
	json = JSONRenderer().render(serialized.data)
	response = HttpResponse(json)
	return response


def promo(request, state, city):
	state = state.upper()
	city = city.replace('_', ' ')
	city =city.title()
	query = City.objects.filter(state=state, name=city)
	context = {'state': query[0].state, 'city': query[0].name}
	return render(request, 'promo.html', context)


def modifyVenues(request):
	form = ModifyVenuesForm(request.POST or None, auto_id=False)
	if request.method == 'POST':
		if form.is_valid():
			fromEmail = settings.EMAIL_HOST_USER
			toEmail = 'mapplop@gmail.com'
			subject = '{}: {}, {} - {}'.format(request.POST['action'].upper(),
				request.POST['city'], request.POST['state'], request.POST['venue'])
			send_mail(subject, request.POST['comment'], fromEmail, [toEmail], fail_silently=True)
			return HttpResponseRedirect('/map/modifyvenues/thanks')
	context = {
		"form": form,
	}
	return render(request, 'modify_venue.html', context)





