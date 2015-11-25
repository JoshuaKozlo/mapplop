from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

# Create your models here.
class City(models.Model):
	name = models.CharField(max_length=50, null=True)
	county = models.CharField(max_length=50, null=True)
	state = models.CharField(max_length=2, null=True)
	population = models.IntegerField(default=0)
	lon = models.FloatField(default=0.0)
	lat = models.FloatField(default=0.0)
	point = models.PointField(blank=True)

	class Meta:
		ordering = ['state', 'name']

	def venue_count(self):
		"Returns a count of the total number of Venues In the City"
		c = City.objects.get(id=self.id)
		v = c.venue_set.all()
		return v.count()	

	def save(self, *args, **kwargs):
		self.point = Point(self.lon, self.lat)
		super().save(*args, **kwargs)


	def __str__(self):
		return self.state + ', ' + self.name


class Venue(models.Model):
	name = models.CharField(max_length=50, null=True)
	street = models.CharField(max_length=50, null=True)
	city = models.ForeignKey(City, null=True)
	website = models.CharField(max_length=250, null=True)
	image = models.ImageField(null=True)

	
	def city_state(self):
		v = Venue.objects.get(id=self.id)
		return [v.city.name, v.city.state]


	def __str__(self):
		return self.name


