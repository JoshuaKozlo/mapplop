from django.contrib import admin
from .models import City, Venue

# Register your models here.
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
	list_display = ('name', 'county', 'state', 'population', 'id')
	list_filter = ['state']
	search_fields = ['name', 'county']
	


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
	list_display = ('name', 'street', 'city', 'featured')
	list_filter = ['city__state']
	search_fields = ['name', 'city__name']