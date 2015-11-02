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
	


	def save(self, *args, **kwargs):
		self.point = Point(self.lon, self.lat)
		super().save(*args, **kwargs)


	def __str__(self):
		return self.name