from django.contrib import admin
from .models import City, Venue

# Register your models here.
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
	list_display = ('name', 'county', 'state', 'population', 'id')
	search_fields = ['venue__name']



@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
	list_display = ('name', 'street', 'city', 'featured')